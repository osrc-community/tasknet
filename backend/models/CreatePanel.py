from pydantic import BaseModel
from typing import Optional


class Panel(BaseModel):
    title: str
    image: str
    identifier: Optional[str] = None
