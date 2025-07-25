from fastapi import FastAPI, APIRouter, Depends, HTTPException, Request, status
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from apps.backend.core.services.business_ingestion import BusinessIngestionService
from apps.backend.api.business_model import Business
from apps.backend.api.business_repository import BusinessRepository
from fastapi.responses import JSONResponse
from typing import List
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_500_INTERNAL_SERVER_ERROR

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL or "postgresql+asyncpg://user:password@localhost/dbname",
    echo=True,
)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

ingestion_router = APIRouter()

# --- DB Session Dependency ---
async def get_async_session():
    async with async_session() as session:
        yield session

# --- API Key Auth Dependency ---
API_KEY = os.getenv("API_KEY")

def verify_api_key(request: Request):
    api_key = request.headers.get("X-API-Key")
    if not api_key or api_key != API_KEY:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail={"code": "UNAUTHORIZED", "message": "Invalid or missing API key."}
        )

# --- Error Handler for Standardized Error Format ---
@app.exception_handler(HTTPException)
def custom_http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail if isinstance(exc.detail, dict) else {"code": "ERROR", "message": str(exc.detail)}}
    )

# --- GET /api/businesses Endpoint ---
@app.get("/api/businesses", response_model=List[Business])
async def get_businesses(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    _: None = Depends(verify_api_key),
):
    try:
        repo = BusinessRepository(session)
        businesses_orm = await repo.list_all()
        businesses = [Business.from_orm(b) for b in businesses_orm]
        return businesses
    except Exception as e:
        return JSONResponse(
            status_code=HTTP_500_INTERNAL_SERVER_ERROR,
            content={"detail": {"code": "INTERNAL_SERVER_ERROR", "message": str(e)}}
        )

@ingestion_router.post('/ingest-business')
async def ingest_business(
    business_name: str,
    city: str,
    session: AsyncSession = Depends(get_async_session),
):
    service = BusinessIngestionService()
    result = await service.ingest_and_save(business_name, city, session)
    if not result:
        raise HTTPException(status_code=404, detail='Business not found or could not be ingested')
    return {'id': str(result.id), 'name': result.name, 'address': result.address}

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is healthy"} 