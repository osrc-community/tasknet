from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from utils.auth import verify_token

router = APIRouter(
    tags=["ROOT"],
    dependencies=[
        Depends(verify_token),
    ]
)


@router.get("/")
def root():
    return JSONResponse(content={"project": "Issue-Board", "version": 1.0})
