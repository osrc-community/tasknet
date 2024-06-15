from typing import Optional

from pydantic import BaseModel


class AuthUser(BaseModel):
    id: int
    email: str
    password_hash: Optional[str] = None
    image: str | None
    firstname: str
    lastname: str
    token: Optional[str] = None
