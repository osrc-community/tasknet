import warnings
from importlib import import_module
from pathlib import Path

from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

app = FastAPI()

warnings.filterwarnings("ignore", message="Unverified HTTPS request")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

router_path = Path(__file__).parent / "router"

for router_file in router_path.glob("*.py"):
    if router_file.name != "__init__.py":
        module_path = f"router.{router_file.stem}"
        router_module = import_module(module_path)
        app.include_router(router_module.router)


@app.exception_handler(Exception)
async def unicorn_exception_handler(_: Request, exc: Exception):
    return JSONResponse(status_code=HTTP_500_INTERNAL_SERVER_ERROR, content={"message": str(exc)})


# This for local development and can be deleted in Release Version
if __name__ == "__main__":
    """For IDE debugging purposes"""
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
