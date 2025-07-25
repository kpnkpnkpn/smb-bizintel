import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from core.services.business_ingestion import BusinessIngestionService
from api.business_model import BusinessORM

@pytest.mark.asyncio
async def test_map_to_business_model():
    api_data = {
        'name': 'Test Business',
        'formatted_address': '123 Main St, Austin, TX 78701',
        'geometry': {'location': {'lat': 30.2672, 'lng': -97.7431}},
    }
    service = BusinessIngestionService(api_key='dummy')
    business = service.map_to_business_model(api_data)
    assert business.name == 'Test Business'
    assert business.address == '123 Main St, Austin, TX 78701'
    assert business.latitude == 30.2672
    assert business.longitude == -97.7431

@pytest.mark.asyncio
@patch('core.services.business_ingestion.httpx.AsyncClient')
async def test_fetch_business_data(mock_client):
    mock_response = MagicMock()
    mock_response.json.return_value = {
        'candidates': [{
            'name': 'Test Business',
            'formatted_address': '123 Main St, Austin, TX 78701',
            'geometry': {'location': {'lat': 30.2672, 'lng': -97.7431}},
        }]
    }
    mock_response.raise_for_status = MagicMock()
    mock_client.return_value.__aenter__.return_value.get = AsyncMock(return_value=mock_response)
    service = BusinessIngestionService(api_key='dummy')
    data = await service.fetch_business_data('Test Business', 'Austin')
    assert data['name'] == 'Test Business'

@pytest.mark.asyncio
@patch('core.services.business_ingestion.BusinessRepository')
@patch.object(BusinessIngestionService, 'fetch_business_data')
async def test_ingest_and_save(mock_fetch, mock_repo):
    mock_fetch.return_value = {
        'name': 'Test Business',
        'formatted_address': '123 Main St, Austin, TX 78701',
        'geometry': {'location': {'lat': 30.2672, 'lng': -97.7431}},
    }
    mock_session = MagicMock()
    mock_repo_instance = MagicMock()
    mock_repo.return_value = mock_repo_instance
    mock_repo_instance.add = AsyncMock(return_value='saved_business')
    service = BusinessIngestionService(api_key='dummy')
    result = await service.ingest_and_save('Test Business', 'Austin', mock_session)
    assert result == 'saved_business' 