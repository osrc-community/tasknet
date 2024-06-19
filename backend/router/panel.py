from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from database import DatabaseSqlite
from models.Group import Group
from models.Panel import Panel
from utils.auth import verify_token

router = APIRouter(
    tags=["FUNCTIONS"],
    prefix="/func",
    dependencies=[
        Depends(verify_token),
    ]
)


@router.get("/groups")
def get_groups() -> JSONResponse:
    """
    Token: 3955df76-911f-4ab4-ba61-5924162b19d5\n
    Nutzer: 1\n
    Returns all Groups\n
    Group: \n
        identifier: str
        title: str
    """
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("SELECT * FROM groups")
    result = cursor.fetchall()
    groupList: list = []

    for group in result:
        identifier, title = group
        groupList.append(Group(identifier=identifier, title=title).__dict__)

    return JSONResponse({"success": 1, "result": groupList})


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