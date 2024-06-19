from pydantic import BaseModel


class List(BaseModel):
    identifier: str
    title: str
