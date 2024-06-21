from pydantic import BaseModel
from typing import Optional


class Group(BaseModel):
    identifier: str
    title: str


class CreateGroup(Group):
    pass


class UpdateGroup(Group):
    pass
