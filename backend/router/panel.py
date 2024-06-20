from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette import status

from database import DatabaseSqlite
from models.CreateGroup import CreateGroup
from models.Panel import Panel
from utils.auth import verify_token, gen_identifier, identifier_exists

router = APIRouter(
    tags=["FUNCTIONS"],
    prefix="/func",
    dependencies=[
        Depends(verify_token),
    ]
)


@router.get("/groups_panels")
def get_groups_panels():
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    sql = """
    SELECT groups.identifier, groups.title
    FROM groups
    """
    cursor.execute(sql)
    groups = cursor.fetchall()

    return_list: list = []

    for group in groups:
        identifier, title = group
        sql_panels = """
        SELECT panels.identifier, panels.title, panels.image
        FROM group_panel 
        JOIN panels ON group_panel.panel_identifier = panels.identifier
        WHERE group_identifier = ?
        """
        panels_raw = cursor.execute(sql_panels, (identifier,)).fetchall()
        panels_parsed = []
        for panel in panels_raw:
            p_identifier, p_title, p_image = panel
            if p_image is None:
                p_image = "assets/images/example.png"
            panels_parsed.append(Panel(identifier=p_identifier, title=p_title, image=p_image).__dict__)

        return_list.append({"identifier": identifier, "title": title, "panels": panels_parsed})

    return JSONResponse({"success": 1, "groups": return_list})


@router.get("/panel/{identifier}")
def get_panel_lists(identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        sql = """SELECT title, image FROM panels WHERE identifier = ?"""
        panel = cursor.execute(sql, (identifier,)).fetchone()
        panel_title, panel_image = panel

        sql_lists = """SELECT list_identifier FROM panel_list WHERE panel_identifier = ?"""
        cursor.execute(sql_lists, (identifier,))
        list_identifiers = cursor.fetchall()

        lists_parsed: list = []

        for a in list_identifiers:
            list_identifier, = a
            sql_list = """SELECT title FROM lists WHERE identifier = ?"""
            list_title = cursor.execute(sql_list, (list_identifier,)).fetchone()[0]
            entries_parsed: list = []

            sql_entries = """SELECT entry_identifier FROM list_entries WHERE list_identifier = ?"""
            entries = cursor.execute(sql_entries, (list_identifier,)).fetchall()
            if len(entries) > 0:
                for entry in entries:
                    entry_identifier = entry[0]
                    sql_entry = """SELECT * FROM entries WHERE identifier = ?"""
                    entry = cursor.execute(sql_entry, (entry_identifier,)).fetchone()
                    entry_identifier, entry_type, entry_message = entry
                    entries_parsed.append({"type": entry_type, "message": entry_message})
            lists_parsed.append({"title": list_title, "entries": entries_parsed})

        return_object = {
            "identifier": identifier,
            "title": panel_title,
            "image": panel_image,
            "lists": lists_parsed
        }

        return JSONResponse({"success": 1, "result": return_object})
    except Exception as e:
        return JSONResponse({"success": 0, "message": e})


@router.post("/group/create")
def create_group(group: CreateGroup) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()
        identifier = gen_identifier()
        already_exists = identifier_exists(identifier, 'groups', 'identifier')

        if not already_exists:
            sql = """INSERT INTO groups (identifier, title) VALUES (?, ?)"""
            cursor.execute(sql, (identifier, group.title,))

            db.conn.commit()
            if cursor.rowcount > 0:
                new_group = {"identifier": identifier, "title": group.title}
                return JSONResponse({"success": 1, "message": "Erstellt", "group": new_group})

        cursor.close()
        return JSONResponse({"success": 0, "message": "Fehler!"}, status_code=status.HTTP_201_CREATED)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/group/patch")
def patch_group(identifier: str, new_identifier: str = None, add_users: list[str] = [],
                remove_users: list[str] = []) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        sql = """SELECT id FROM groups WHERE name = ?"""
        cursor.execute(sql, (identifier,))
        group_identifier = cursor.fetchone()
        if not group_identifier:
            return JSONResponse({"success": 0, "message": "Gruppe nicht gefunden!"},
                                status_code=status.HTTP_404_NOT_FOUND)

        if new_identifier:
            sql = """UPDATE groups SET name = ? WHERE name = ?"""
            cursor.execute(sql, (new_identifier, identifier))

        for user in add_users:
            sql = """INSERT INTO group_users (group_id, user_id) VALUES (?, (SELECT id FROM users WHERE email = ?))"""
            cursor.execute(sql, (group_identifier, user))

        for user in remove_users:
            sql = """DELETE FROM group_users WHERE group_id = ? AND user_id = (SELECT id FROM users WHERE email = ?)"""
            cursor.execute(sql, (group_identifier, user))

        db.conn.commit()

        return JSONResponse({"success": 1, "message": "Gruppe erfolgreich aktualisiert!"},
                            status_code=status.HTTP_200_OK)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.delete("/group/delete/{identifier}")
def delete_group(identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        # Check if group exists
        cursor.execute("SELECT id FROM groups WHERE name = ?", (identifier,))
        group_identifier = cursor.fetchone()
        if not group_identifier:
            return JSONResponse(
                {"success": 0, "message": "Gruppe nicht gefunden!"},
                status_code=status.HTTP_404_NOT_FOUND
            )

        cursor.execute("DELETE FROM group_users WHERE group_id = ?", (group_identifier[0],))

        cursor.execute("DELETE FROM groups WHERE name = ?", (identifier,))

        db.conn.commit()

        return JSONResponse(
            {"success": 1, "message": "Gruppe erfolgreich gelöscht!"},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(
            {"success": 0, "message": str(e)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.post("/panel/create")
def create_panel(identifier: str, description: str, users: list[str] = []) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        cursor.execute("SELECT id FROM panels WHERE name =?", (identifier,))
        if cursor.fetchone():
            return JSONResponse(
                {"success": 0, "message": "Panel bereits vorhanden!"},
                status_code=status.HTTP_400_BAD_REQUEST
            )

        cursor.execute("INSERT INTO panels ({identifier}, description) VALUES (?, ?)", (identifier, description))
        panel_identifier = cursor.lastrowid

        for user in users:
            cursor.execute(
                "INSERT INTO panel_users (panel_identifier, user_identifier) VALUES (?, (SELECT id FROM users WHERE email =?))",
                (panel_identifier, user))

        db.conn.commit()

        return JSONResponse(
            {"success": 1, "message": "Panel erfolgreich erstellt!", "panel": {
                f"identifier": Panel[0],
                "name": Panel[1],
                "description": Panel[2]
            }},
            status_code=status.HTTP_201_CREATED
        )
    except Exception as e:
        return JSONResponse(
            {"success": 0, "message": str(e)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
