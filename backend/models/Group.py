from pydantic import BaseModel
from typing import Optional


class Group(BaseModel):
    identifier: str
    title: str


class CreateGroup(BaseModel):
    title: Optional[str] = None
