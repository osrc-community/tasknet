from fastapi import APIRouter, status, Depends
from fastapi.responses import JSONResponse, Response

from database import DatabaseSqlite
from models.AuthUser import AuthUser
from models.LoginUser import LoginUser
from utils.auth import hash_password, gen_token

router = APIRouter(
    tags=["AUTHENTICATION"],
    prefix="/auth"
)


@router.post("/login")
async def login(login_user: LoginUser, response: Response) -> JSONResponse:
    """
    When sent a Login-User with Email and Password it generates an auth token, saves and returns it.

    Login-User:\n
        email: str
        password: str

    Authenticated-User:\n
        id: int
        email: str
        image: str
        firstname: str
        lastname: str
    """

    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("SELECT id,email,password_hash,image,firstname,lastname from users WHERE email LIKE ?", (login_user.email,))
    result = cursor.fetchone()

    id, email, password_hash, image, firstname, lastname = result
    user = AuthUser(id=id, email=email, password_hash=password_hash, image=image, firstname=firstname, lastname=lastname)

    if hash_password(login_user.password) == user.password_hash:
        user.__delattr__("password_hash")
        token = gen_token(user.id, -1)
        if token is None:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return JSONResponse({"success": 0, "message": "Falsche Email oder Passwort"})
        user.token = token
        response.status_code = status.HTTP_200_OK
        return JSONResponse({"success": 1, "user": user.__dict__})
    else:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return JSONResponse({"success": 0, "message": "Falsche Email oder Passwort"})


@router.post("/logout")
async def logout(user: AuthUser, response: Response) -> JSONResponse:
    db = DatabaseSqlite()
    cursor = db.get_cursor()
    cursor.execute("DELETE FROM auth_tokens WHERE user_id LIKE ?", (user.email,))
    result = cursor.fetchone()

    db.conn.commit()
    if cursor.rowcount > 0:
        return JSONResponse({"success": 1, "message": "Erfolgreich Abgemeldet."})
    cursor.close()

    return JSONResponse({"success": 0, "message": "Fehler während der Abmeldung."})
