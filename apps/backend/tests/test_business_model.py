import uuid
from datetime import datetime
from ..api.business_model import Business

def test_business_model_creation():
    now = datetime.utcnow()
    business = Business(
        id=uuid.uuid4(),
        name="Test Business",
        address="123 Main St",
        city="Austin",
        state="TX",
        zipCode="78701",
        latitude=30.2672,
        longitude=-97.7431,
        website="https://test.com",
        phoneNumber="555-1234",
        ownerName="Jane Doe",
        yearStarted=2020,
        starRating=4.5,
        reviewCount=10,
        naicsCode="541511",
        createdAt=now,
        updatedAt=now
    )
    assert business.name == "Test Business"
    assert business.state == "TX"
    assert business.latitude == 30.2672
    assert business.starRating == 4.5
    assert business.createdAt == now
    assert business.updatedAt == now 