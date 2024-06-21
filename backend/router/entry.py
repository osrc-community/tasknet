from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from starlette import status

from database import DatabaseSqlite
from models.Entry import CreateEntry, UpdateEntry
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


@router.post("/entry/create/{list_identifier}")
def create_entry(entry: CreateEntry, list_identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()
        identifier = gen_identifier()
        already_exists = identifier_exists(identifier, 'entries', 'identifier')

        if not already_exists:
            sql = """INSERT INTO entries (identifier, type, message) VALUES (?, ?, ?)"""
            cursor.execute(sql, (identifier, entry.type, entry.message))

            db.conn.commit()
            if cursor.rowcount > 0:
                sql_list = """INSERT INTO list_entries (list_identifier, entry_identifier) VALUES (?, ?)"""
                cursor.execute(sql_list, (list_identifier, identifier))

                db.conn.commit()
                if cursor.rowcount > 0:
                    new_entry = {"identifier": identifier, "type": entry.type, "message": entry.message}
                    return JSONResponse({"success": 1, "message": "Erstellt", "new_entry": new_entry})

        cursor.close()
        return JSONResponse({"success": 0, "message": "Fehler!"}, status_code=status.HTTP_201_CREATED)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.patch("/entry/patch")
def patch_entry(entry: UpdateEntry) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        exists = identifier_exists(entry.identifier, 'entries', 'identifier')

        if not exists:
            return JSONResponse({"success": 0, "message": "Entry exisitert nicht!"}, status_code=status.HTTP_404_NOT_FOUND)

        sql = """UPDATE entries
        SET
            type = CASE WHEN ? IS NOT NULL THEN ? ELSE type END,
            message = CASE WHEN ? IS NOT NULL THEN ? ELSE message END
        WHERE
            identifier = ?;"""

        cursor.execute(sql, (entry.type, entry.type, entry.message, entry.message, entry.identifier))

        db.conn.commit()
        if cursor.rowcount > 0:
            return JSONResponse({"success": 1, "message": "Entry geupdatet!"}, status_code=status.HTTP_200_OK)
        cursor.close()

        return JSONResponse({"success": 0, "message": "Fehler während des Updates!"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        return JSONResponse({"success": 0, "message": str(e)}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.delete("/entry/delete/{identifier}")
def delete_entry(identifier: str) -> JSONResponse:
    try:
        db = DatabaseSqlite()
        cursor = db.get_cursor()

        # Check if group exists
        exists = identifier_exists(identifier, 'entries', 'identifier')

        if not exists:
            return JSONResponse(
                {"success": 0, "message": "Entry nicht gefunden!"},
                status_code=status.HTTP_404_NOT_FOUND
            )

        cursor.execute("DELETE FROM list_entries WHERE entry_identifier = ?", (identifier,))
        cursor.execute("DELETE FROM entries WHERE identifier = ?", (identifier,))

        db.conn.commit()

        return JSONResponse(
            {"success": 1, "message": "Entry erfolgreich gelöscht!"},
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        return JSONResponse(
            {"success": 0, "message": str(e)},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
