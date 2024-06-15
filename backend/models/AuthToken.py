from pydantic import BaseModel


class AuthToken(BaseModel):
    user_id: str
    token: str
    ttl: int
