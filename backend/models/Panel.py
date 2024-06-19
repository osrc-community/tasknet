from pydantic import BaseModel


class Panel(BaseModel):
    identifier: str
    title: str
    image: str
