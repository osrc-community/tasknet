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