from typing import Optional

from pydantic import BaseModel


class User(BaseModel):
    """
    All different varieties the user are child classes!
    User:
        email: string
    """
    email: str


class CreateUser(User):
    password: str
    firstname: str
    lastname: str


class UpdateUser(User):
    password: Optional[str] = None
    image: Optional[str] = None
    firstname: Optional[str] = None
    lastname: Optional[str] = None


class DeleteUser(User):
    """
    Just here to have good name, doesn't add anything!
    """
    pass


class AuthUser(User):
    id: int
    password_hash: Optional[str] = None
    image: Optional[str] = None
    firstname: str
    lastname: str
    token: Optional[str] = None


class LoginUser(User):
    password: str
