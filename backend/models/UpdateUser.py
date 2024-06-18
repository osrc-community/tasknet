from typing import Optional

from pydantic import BaseModel


class UpdateUser(BaseModel):
    email: str
    password: Optional[str] = None
    image: Optional[str] = None
    firstname: Optional[str] = None
    lastname: Optional[str] = None
