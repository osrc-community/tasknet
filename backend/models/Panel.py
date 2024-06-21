from pydantic import BaseModel
from typing import Optional


class Panel(BaseModel):
    identifier: str


class CreatePanel(BaseModel):
    title: str
    image: str


class UpdatePanel(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None


class ReturnPanel(Panel):
    title: str
    image: str
