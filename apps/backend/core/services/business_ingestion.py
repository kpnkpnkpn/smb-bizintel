import os
import httpx
from dotenv import load_dotenv
from typing import Any, Dict, Optional
from api.business_model import Business, BusinessORM
from sqlalchemy.ext.asyncio import AsyncSession
from api.business_repository import BusinessRepository

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../../.env'))

class BusinessIngestionService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('EXTERNAL_API_KEY')
        self.base_url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'

    async def fetch_business_data(self, business_name: str, city: str) -> Optional[Dict[str, Any]]:
        params = {
            'input': f'{business_name}, {city}',
            'inputtype': 'textquery',
            'fields': 'name,formatted_address,geometry,place_id',
            'key': self.api_key,
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(self.base_url, params=params)
            response.raise_for_status()
            data = response.json()
            candidates = data.get('candidates', [])
            if not candidates:
                return None
            return candidates[0]

    def map_to_business_model(self, api_data: Dict[str, Any]) -> BusinessORM:
        # This mapping is simplified and should be extended for real API fields
        location = api_data.get('geometry', {}).get('location', {})
        return BusinessORM(
            name=api_data.get('name', ''),
            address=api_data.get('formatted_address', ''),
            city='',  # Extract from address or API if available
            state='TX',
            zipCode='',  # Extract from address or API if available
            latitude=location.get('lat', 0.0),
            longitude=location.get('lng', 0.0),
        )

    async def ingest_and_save(self, business_name: str, city: str, session: AsyncSession) -> Optional[BusinessORM]:
        api_data = await self.fetch_business_data(business_name, city)
        if not api_data:
            return None
        business_orm = self.map_to_business_model(api_data)
        repo = BusinessRepository(session)
        return await repo.add(business_orm) 