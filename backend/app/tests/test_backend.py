import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
from app.rules import calculate_z_score, evaluate_measurement

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_yanapiri.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="module")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

# 1. Test Rules Engine Mathematics
def test_z_score_calculation():
    # Boys median at 18 months is 10.9 kg. Z-score should be 0.0
    z1 = calculate_z_score(10.9, 18, "M")
    assert -0.1 <= z1 <= 0.1
    
    # Boys median at 24 months is 12.2 kg. If weight is 9.0 kg, Z-score should be < -2
    z2 = calculate_z_score(9.0, 24, "M")
    assert z2 < -2.0

def test_muac_rules():
    # MUAC < 11.5 cm is urgent
    lvl, desc, _, _ = evaluate_measurement("muac", 11.0, 12, "M")
    assert lvl == "urgent"
    
    # MUAC between 11.5 and 12.5 is follow-up
    lvl2, desc2, _, _ = evaluate_measurement("muac", 12.0, 12, "F")
    assert lvl2 == "follow-up"

# 2. Test API auth, registration, and RBAC
def test_auth_flow(client):
    # Register caregiver
    resp = client.post("/auth/register", json={
        "username": "mariapru",
        "email_or_phone": "987654321",
        "password": "mariapassword",
        "role": "CAREGIVER",
        "name": "Maria",
        "lastname": "Prueba",
        "district": "Huancavelica",
        "community": "Anchonga"
    })
    assert resp.status_code == 201
    
    # Login caregiver
    resp_login = client.post("/auth/login", data={
        "username": "mariapru",
        "password": "mariapassword"
    })
    assert resp_login.status_code == 200
    token = resp_login.json()["access_token"]
    assert token is not None
    assert resp_login.json()["role"] == "CAREGIVER"
    
    # Register Health Professional
    resp_prof = client.post("/auth/register", json={
        "username": "carlospru",
        "email_or_phone": "carlos@test.org",
        "password": "carlospassword",
        "role": "PROFESSIONAL",
        "name": "Carlos",
        "lastname": "Prueba",
        "district": "Huancavelica",
        "community": "Anchonga",
        "specialty": "Pediatria",
        "establishment": "Hospital Central",
        "colegiatura_code": "CMP 12345"
    })
    assert resp_prof.status_code == 201

# 3. Test Child registration and measurements
def test_child_and_measurement(client):
    # Login professional to get token
    login_resp = client.post("/auth/login", data={
        "username": "carlospru",
        "password": "carlospassword"
    })
    prof_token = login_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {prof_token}"}
    
    # Register a new child
    child_resp = client.post("/children", headers=headers, json={
        "name": "Juan Test Quispe",
        "sex": "M",
        "date_of_birth": "2024-08-01T00:00:00", # ~24 months old in August 2026
        "district": "Huancavelica",
        "community": "Anchonga",
        "relationship": "Hijo"
    })
    assert child_resp.status_code == 201
    child_id = child_resp.json()["id"]
    
    # Register weight that triggers alert
    # Weight of 9.0 kg at 24 months should be follow-up or urgent
    measure_resp = client.post(f"/children/{child_id}/measurements", headers=headers, json={
        "type": "weight",
        "value": 9.0,
        "unit": "kg",
        "method": "professional"
    })
    assert measure_resp.status_code == 200
    
    # Fetch alerts for child and verify alert generation
    alerts_resp = client.get(f"/children/{child_id}/alerts", headers=headers)
    assert alerts_resp.status_code == 200
    alerts = alerts_resp.json()
    assert len(alerts) > 0
    assert alerts[0]["level"] in ["urgent", "follow-up"]
