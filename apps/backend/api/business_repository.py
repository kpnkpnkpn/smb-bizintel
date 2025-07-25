from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .business_model import BusinessORM
from typing import List, Optional
import uuid

class BusinessRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, business_id: uuid.UUID) -> Optional[BusinessORM]:
        result = await self.session.execute(
            select(BusinessORM).where(BusinessORM.id == business_id)
        )
        return result.scalars().first()

    async def list_all(self) -> List[BusinessORM]:
        result = await self.session.execute(select(BusinessORM))
        return result.scalars().all()

    async def add(self, business: BusinessORM) -> BusinessORM:
        self.session.add(business)
        await self.session.commit()
        await self.session.refresh(business)
        return business

    async def delete(self, business_id: uuid.UUID) -> None:
        business = await self.get_by_id(business_id)
        if business:
            await self.session.delete(business)
            await self.session.commit() 