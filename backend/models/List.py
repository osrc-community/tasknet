from pydantic import BaseModel


class List(BaseModel):
    identifier: str


class CreateList(List):
    title: str


class UpdateList(List):
    title: str
