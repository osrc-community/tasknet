from pydantic import BaseModel
from typing import Optional


class Panel(BaseModel):
    identifier: Optional[str] = None
    title: str
    image: str
