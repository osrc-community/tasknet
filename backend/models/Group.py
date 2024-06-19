from pydantic import BaseModel


class Group(BaseModel):
    identifier: str
    title: str
