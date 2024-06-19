from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from database import DatabaseSqlite
from models.Group import Group
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

    returnList: list = []

    for group in groups:
        identifier, title = group
        sql_panels = """
        SELECT * 
        FROM group_panel 
        JOIN panels ON group_panel.panel_identifier = panels.identifier
        WHERE group_identifier = ?
        """

        #group_title, panel_identifier, panel_title, panel_image = r
        #returnList.append({"group_title": group_title, "panel_identifier": panel_identifier, "panel_title": panel_title, "panel_image": panel_image})

    return JSONResponse({"success": 1, "groups": returnList})