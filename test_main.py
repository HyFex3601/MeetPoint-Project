from fastapi.testclient import TestClient
from app.main import app
import uuid
import random
import json
from datetime import datetime
from app.database import SessionLocal
from app import models
from sqlalchemy import Column, Integer, String
from app.auth import hash_password
client = TestClient(app)


def test_register():
    unique_name = str(uuid.uuid4())[:8]

    check_register = client.post("/register", json={"username": unique_name, "password": "testpass123"})

    assert check_register.status_code == 200


def test_login():

    login_test_user = str(uuid.uuid4())[:8]

    check_register = client.post("/register", json={"username":login_test_user, "password": "testpass123"})

    check_login = client.post("/login", data={"username": login_test_user, "password": "testpass123"})

    assert check_login.status_code == 200




def test_get_events():
    check_events = client.get("/Events")

    assert check_events.status_code == 200





def test_create_events():
    unique_name = str(uuid.uuid4())[:8]

    db = SessionLocal()
    new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="organizer")
    db.add(new_user)
    db.commit()

    check_login = client.post("/login", data={"username": new_user.username, "password": "testpass123"})

    token_data = check_login.json()

    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    check_event = client.post("/create-events", json={"title": "anything", "description": "anything", "date": datetime.utcnow().isoformat(), "location": "anything", "capacity": random.randint(1, 8)}, headers=headers)

    assert check_event.status_code == 200




def test_check_event():
    unique_name = str(uuid.uuid4())[:8]
    
    db = SessionLocal()
    new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="organizer")
    db.add(new_user)
    db.commit()
    
    check_login = client.post("/login", data={"username": new_user.username, "password": "testpass123"})
    
    token_data = check_login.json()
    
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    create_event = client.post("/create-events", json={"title": "anything", "description": "anything", "date": datetime.utcnow().isoformat(), "location": "anything", "capacity": random.randint(1, 8)}, headers=headers)

    event_data = create_event.json()
    event_id = event_data["event"]["id"]
    check_event = client.get(f"/Events/{event_id}")

    assert check_event.status_code == 200





def test_sql_injection():
    check_sql_injection = client.post("/login", data={"username": "' OR '1'='1'", "password": "anything"})

    assert check_sql_injection.status_code == 404