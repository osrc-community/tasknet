from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(
    tags=["ROOT"],
)


@router.get("/")
def root():
    return JSONResponse(content={"project": "Issue-Board", "version": 1.0})
