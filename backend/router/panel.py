from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette import status

from database import DatabaseSqlite
from models.Entry import UpdateEntry, CreateEntry
from models.List import UpdateList, CreateList
from models.Panel import CreatePanel, UpdatePanel, ExtendedPatch
from router.entry import patch_entry, create_entry
from router.list import patch_list, create_list
from utils.auth import verify_token, gen_identifier, identifier_exists

router = APIRouter(
    tags=["FUNCTIONS"],
    prefix="/func",
    dependencies=[
        Depends(verify_token),
    ]
)


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
                    entries_parsed.append({"identifier": entry_identifier, "type": entry_type, "message": entry_message})
            lists_parsed.append({"identifier": list_identifier, "title": list_title, "entries": entries_parsed})

        return_object = {
            "identifier": identifier,
            "title": panel_title,
            "image": panel_image,
            "lists": lists_parsed
        }

        return JSONResponse({"success": 1, "result": return_object})
    except Exception as e:
        return JSONResponse({"success": 0, "message": e})


@router.post("/panel/create")
def create_panel(panel: CreatePanel) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()
        identifier = gen_identifier()
        already_exists = identifier_exists(identifier, 'panels', 'identifier')

        if not already_exists:
            sql = """INSERT INTO panels (identifier, title, image) VALUES (?, ?, ?)"""
            cursor.execute(sql, (identifier, panel.title, panel.image))

            db.conn.commit()
            if cursor.rowcount > 0:
                new_panel = {"identifier": identifier, "title": panel.title, "image": panel.image}
                return JSONResponse({"success": 1, "message": "Erstellt", "panel": new_panel})

        cursor.close()
        return JSONResponse({"success": 0, "message": "Fehler!"}, status_code=status.HTTP_201_CREATED)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.patch("/panel/patch")
def patch_panel(panel: UpdatePanel) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        exists = identifier_exists(panel.identifier, 'panels', 'identifier')

        if not exists:
            return JSONResponse({"success": 0, "message": "Panel exisitert nicht!"}, status_code=status.HTTP_404_NOT_FOUND)

        sql = """UPDATE panels
        SET
            title = CASE WHEN ? IS NOT NULL THEN ? ELSE title END,
            image = CASE WHEN ? IS NOT NULL THEN ? ELSE image END
        WHERE
            identifier = ?;"""

        cursor.execute(sql, (panel.title, panel.title, panel.image, panel.image, panel.identifier))

        db.conn.commit()
        if cursor.rowcount > 0:
            return JSONResponse({"success": 1, "message": "Gruppe geupdatet!"}, status_code=status.HTTP_200_OK)
        cursor.close()

        return JSONResponse({"success": 0, "message": "Fehler während des Updates!"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.delete("/panel/delete/{identifier}")
def delete_panel(identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        # Check if group exists
        exists = identifier_exists(identifier, 'panels', 'identifier')

        if not exists:
            return JSONResponse(
                {"success": 0, "message": "Panel nicht gefunden!"},
                status_code=status.HTTP_404_NOT_FOUND
            )

        cursor.execute("DELETE FROM panel_list WHERE panel_identifier = ?", (identifier,))
        cursor.execute("DELETE FROM panels WHERE identifier = ?", (identifier,))

        db.conn.commit()

        return JSONResponse(
            {"success": 1, "message": "Panel erfolgreich gelöscht!"},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(
            {"success": 0, "message": str(e)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@router.patch("/panel/extended_patch")
def extended_patch(body: ExtendedPatch) -> JSONResponse:
    print(body)
    #for list in body.lists:
    #    exists = identifier_exists(list.identifier, 'lists', 'identifier')
    #    if exists:
    #        patch_list(UpdateList(identifier=list.identifier, title=list.title))
    #    else:
    #        create_list(CreateList(identifier=list.identifier, title=list.title))

    #    for entry in list.entries:
    #        exists = identifier_exists(entry.identifier, 'entries', 'identifier')
    #        if exists:
    #            patch_entry(UpdateEntry(identifier=entry.identifier, type=entry.type, message=entry.message))
    #        else:
    #            create_entry(CreateEntry(identifier=entry.identifier, type=entry.type, message=entry.message))

    return JSONResponse({"success": 1, "message": "."}, status_code=status.HTTP_200_OK)
