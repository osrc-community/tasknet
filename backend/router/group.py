from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette import status

from database import DatabaseSqlite
from models.Group import CreateGroup, UpdateGroup
from models.Panel import Panel, ReturnPanel
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
            print(ReturnPanel(identifier=p_identifier, title=p_title, image=p_image))
            panels_parsed.append(ReturnPanel(identifier=p_identifier, title=p_title, image=p_image).__dict__)

        return_list.append({"identifier": identifier, "title": title, "panels": panels_parsed})

    return JSONResponse({"success": 1, "groups": return_list})


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


@router.patch("/group/patch")
def patch_group(group: UpdateGroup) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        exists = identifier_exists(group.identifier, 'groups', 'identifier')

        if not exists:
            return JSONResponse({"success": 0, "message": "Gruppe exisitert nicht!"}, status_code=status.HTTP_404_NOT_FOUND)

        sql = """UPDATE groups
        SET
            title = CASE WHEN ? IS NOT NULL THEN ? ELSE title END
        WHERE
            identifier = ?;"""

        cursor.execute(sql, (group.title, group.title, group.identifier))

        db.conn.commit()
        if cursor.rowcount > 0:
            return JSONResponse({"success": 1, "message": "Gruppe geupdatet!"}, status_code=status.HTTP_200_OK)
        cursor.close()

        return JSONResponse({"success": 0, "message": "Fehler während des Updates!"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.delete("/group/delete/{identifier}")
def delete_group(identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        # Check if group exists
        exists = identifier_exists(identifier, 'groups', 'identifier')

        if not exists:
            return JSONResponse(
                {"success": 0, "message": "Gruppe nicht gefunden!"},
                status_code=status.HTTP_404_NOT_FOUND
            )

        cursor.execute("DELETE FROM group_panel WHERE group_identifier = ?", (identifier,))
        cursor.execute("DELETE FROM groups WHERE identifier = ?", (identifier,))

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
