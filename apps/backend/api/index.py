from fastapi import FastAPI
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(
    DATABASE_URL or "postgresql+asyncpg://user:password@localhost/dbname",
    echo=True,
)

async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend is healthy"} 