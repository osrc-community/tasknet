from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse, Response

from database import DatabaseSqlite
from models.CreateUser import CreateUser
from utils.auth import hash_password

router = APIRouter(
    tags=["ACCOUNT"],
    prefix="/account"
)


@router.post("/create")
async def create(user: CreateUser, response: Response) -> JSONResponse:
    """
    When sent a Create User, a User gets created in the database and a token is generated.

    Create-User:\n
        email: str
        password: str
        firstname: str
        lastname: str

    Return:\n
        409: Account already exists
    """
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("SELECT email,firstname,lastname from users WHERE email LIKE ?", (user.email,))
    result = cursor.fetchone()
    password_hash = hash_password(user.password)

    if result is not None:
        return JSONResponse({"success": 0, "message": "Benutzer mit dieser E-Mail existiert bereits!"}, status_code=status.HTTP_409_CONFLICT)

    cursor.execute(
        "INSERT INTO users (email, password_hash, firstname, lastname) VALUES (?, ?, ?, ?)",
        (user.email, password_hash, user.firstname, user.lastname)
    )

    db.conn.commit()
    if cursor.rowcount > 0:
        return JSONResponse({"success": 1, "message": "Benutzer Erstellt. Willkommen."})
    cursor.close()

    return JSONResponse({"success": 0, "message": "Fehler während des Erstellens. Bitte probieren Sie es später erneut."})
