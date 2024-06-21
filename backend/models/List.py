from pydantic import BaseModel

from models.Entry import UpdateEntry


class List(BaseModel):
    identifier: str


class CreateList(BaseModel):
    title: str


class UpdateList(List):
    title: str


class ExtendedList(List):
    title: str
    entries: list[UpdateEntry]
