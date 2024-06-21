from typing import Optional

from pydantic import BaseModel


class Entry(BaseModel):
    identifier: str


class CreateEntry(BaseModel):
    type: str
    message: str


class UpdateEntry(Entry):
    type: Optional[str] = None
    message: Optional[str] = None
