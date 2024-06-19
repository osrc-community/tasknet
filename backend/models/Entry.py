from pydantic import BaseModel


class Entry(BaseModel):
    identifier: str
    type: str
    message: str
