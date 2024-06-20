from pydantic import BaseModel
from typing import Optional


class CreateGroup(BaseModel):
    title: Optional[str] = None
