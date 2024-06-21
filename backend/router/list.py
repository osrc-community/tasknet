from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette import status

from database import DatabaseSqlite
from models.Group import CreateGroup, UpdateGroup
from models.List import CreateList, UpdateList
from models.Panel import Panel
from utils.auth import verify_token, gen_identifier, identifier_exists

router = APIRouter(
    tags=["FUNCTIONS"],
    prefix="/func",
    dependencies=[
        Depends(verify_token),
    ]
)


@router.post("/list/create")
def create_list(list: CreateList) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()
        identifier = gen_identifier()
        already_exists = identifier_exists(identifier, 'lists', 'identifier')

        if not already_exists:
            sql = """INSERT INTO lists (identifier, title) VALUES (?, ?)"""
            cursor.execute(sql, (identifier, list.title,))

            db.conn.commit()
            if cursor.rowcount > 0:
                new_list = {"identifier": identifier, "title": list.title}
                return JSONResponse({"success": 1, "message": "Erstellt", "list": new_list})

        cursor.close()
        return JSONResponse({"success": 0, "message": "Fehler!"}, status_code=status.HTTP_201_CREATED)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.patch("/list/patch")
def patch_list(list: UpdateList) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        exists = identifier_exists(list.identifier, 'lists', 'identifier')

        if not exists:
            return JSONResponse({"success": 0, "message": "Liste exisitert nicht!"}, status_code=status.HTTP_404_NOT_FOUND)

        sql = """UPDATE lists
        SET
            title = CASE WHEN ? IS NOT NULL THEN ? ELSE title END
        WHERE
            identifier = ?;"""

        cursor.execute(sql, (list.title, list.title, list.identifier))

        db.conn.commit()
        if cursor.rowcount > 0:
            return JSONResponse({"success": 1, "message": "List geupdatet!"}, status_code=status.HTTP_200_OK)
        cursor.close()

        return JSONResponse({"success": 0, "message": "Fehler während des Updates!"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.delete("/list/delete/{identifier}")
def delete_list(identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        # Check if list exists
        exists = identifier_exists(identifier, 'lists', 'identifier')

        if not exists:
            return JSONResponse(
                {"success": 0, "message": "Liste nicht gefunden!"},
                status_code=status.HTTP_404_NOT_FOUND
            )

        cursor.execute("DELETE FROM list_entries WHERE list_identifier = ?", (identifier,))
        cursor.execute("DELETE FROM lists WHERE identifier = ?", (identifier,))

        db.conn.commit()

        return JSONResponse(
            {"success": 1, "message": "Liste erfolgreich gelöscht!"},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(
            {"success": 0, "message": str(e)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
