from fastapi import APIRouter
from fastapi.responses import JSONResponse

from models.LoginUser import LoginUser
from utils.hash import hash_password

router = APIRouter(
    tags=["AUTHENTICATION"],
    prefix="/auth",
)

users = [
    {
        "email": "dev@dev.com",
        "password_hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
        "image": "https://avatars.githubusercontent.com/u/77273892?v=4" #Kann auch Base64 sein
    }
]


@router.post("/login")
async def login(login_user: LoginUser) -> JSONResponse:
    #TODO Bitte eine echte Abfrage bei der Datenbank einbauen, danke! (Und eine beschreibung wäre nett)
    """
    Description
    """
    if login_user.email == users[0]["email"]:
        if hash_password(login_user.password) == users[0]["password_hash"]:
            return JSONResponse({"success": 1, "user": {"email": login_user.email, "image": users[0]["image"]}})
    return JSONResponse({"success": 0, "message": "Wrong email or password"})


@router.post("/logout")
async def logout():
    return
