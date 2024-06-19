from pydantic import BaseModel


class DeleteUser(BaseModel):
    email: str

