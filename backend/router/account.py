from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse, Response

from database import DatabaseSqlite
from models.AuthUser import AuthUser
from models.UpdateUser import UpdateUser
from models.CreateUser import CreateUser
from utils.account import user_exists
from utils.auth import hash_password, gen_token

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
    password_hash = hash_password(user.password)
    already_exists = user_exists(user.email)

    if already_exists:
        return JSONResponse({"success": 0, "message": "Benutzer mit dieser E-Mail existiert bereits!"}, status_code=status.HTTP_409_CONFLICT)

    cursor.execute(
        "INSERT INTO users (email, password_hash, firstname, lastname) VALUES (?, ?, ?, ?)",
        (user.email, password_hash, user.firstname, user.lastname)
    )

    db.conn.commit()
    if cursor.rowcount > 0:
        user_id = cursor.lastrowid
        token = gen_token(user_id, 10000)
        user = AuthUser(id=user_id, email=user.email, image=None, firstname=user.firstname, lastname=user.lastname, token=token)
        return JSONResponse({"success": 1, "message": "Benutzer Erstellt. Willkommen.", "user": user.__dict__})
    cursor.close()

    return JSONResponse({"success": 0, "message": "Fehler während des Erstellens. Bitte probieren Sie es später erneut."})


@router.post("/update")
async def update(user: UpdateUser) -> JSONResponse:
    """
    When sent a Create User, a User gets created in the database and a token is generated.

    Update-User:\n
        email: str
        password: str
        image: str
        firstname: str
        lastname: str

    Return:\n
        JSONResponse:\n
            success: 0|1
            message: str
    """
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    already_exists = user_exists(user.email)
    password_hash = None
    if user.password:
        password_hash = hash_password(user.password)

    if not already_exists:
        return JSONResponse({"success": 0, "message": "Fehler während des Updates!"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    sql = """UPDATE users
    SET
        email = CASE WHEN ? IS NOT NULL THEN ? ELSE email END,
        password_hash = CASE WHEN ? IS NOT NULL THEN ? ELSE password_hash END,
        image = CASE WHEN ? IS NOT NULL THEN ? ELSE image END,
        firstname = CASE WHEN ? IS NOT NULL THEN ? ELSE firstname END,
        lastname = CASE WHEN ? IS NOT NULL THEN ? ELSE lastname END
    WHERE
        email = ?;"""

    cursor.execute(sql, (user.email, user.email, password_hash, password_hash, user.image, user.image, user.firstname, user.firstname, user.lastname, user.lastname, user.email))

    db.conn.commit()
    if cursor.rowcount > 0:
        return JSONResponse({"success": 1, "message": "Benutzer geupdatet!"}, status_code=status.HTTP_200_OK)
    cursor.close()

    return JSONResponse({"success": 0, "message": "Fehler während des Updates!"}, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
