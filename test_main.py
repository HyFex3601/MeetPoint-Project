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
import pytest 
from starlette.websockets import WebSocketDisconnect

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


def test_booking():
    unique_name = str(uuid.uuid4())[:8]
        
    db = SessionLocal()
    new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="organizer")
    db.add(new_user)
    db.commit()
        
    check_login = client.post("/login", data={"username": new_user.username, "password": "testpass123"})
        
    token_data = check_login.json()
        
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
        
    create_event = client.post("/create-events", json={"title": "anything", "description": "anything", "date": datetime.utcnow().isoformat(), "location": "anything", "capacity": 1}, headers=headers)

    unique_name = str(uuid.uuid4())[:8]
            
    db = SessionLocal()
    brand_new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="attendee")
    db.add(brand_new_user)
    db.commit()


    check_login = client.post("/login", data={"username": brand_new_user.username, "password": "testpass123"})

    token_data = check_login.json()
            
    token = token_data["access_token"]
    new_headers = {"Authorization": f"Bearer {token}"}

    event_data = create_event.json()
    event_id = event_data   ["event"]["id"]

    book_event = client.post(f"/Events/{event_id}/book", headers=new_headers)

    assert book_event.status_code == 200


def test_double_booking():
    unique_name = str(uuid.uuid4())[:8]
            
    db = SessionLocal()
    new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="organizer")
    db.add(new_user)
    db.commit()
            
    check_login = client.post("/login", data={"username": new_user.username, "password": "testpass123"})
            
    token_data = check_login.json()
            
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
            
    create_event = client.post("/create-events", json={"title": "anything", "description": "anything", "date": datetime.utcnow().isoformat(), "location": "anything", "capacity": 1}, headers=headers)

    unique_name = str(uuid.uuid4())[:8]
                
    db = SessionLocal()
    brand_new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="attendee")
    db.add(brand_new_user)
    db.commit()
    
    
    check_login = client.post("/login", data={"username": brand_new_user.username, "password": "testpass123"})
    
    token_data = check_login.json()
                
    token = token_data["access_token"]
    new_headers = {"Authorization": f"Bearer {token}"}
    
    event_data = create_event.json()
    event_id = event_data["event"]["id"]
    
    book_event = client.post(f"/Events/{event_id}/book", headers=new_headers)

    double_booking = client.post(f"/Events/{event_id}/book", headers=new_headers)

    assert double_booking.status_code == 400


def test_capacity_full():

    unique_name = str(uuid.uuid4())[:8]

    db = SessionLocal()
    new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="organizer")
    db.add(new_user)
    db.commit()
            
    check_login = client.post("/login", data={"username": new_user.username, "password": "testpass123"})
            
    token_data = check_login.json()
            
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
            
    create_event = client.post("/create-events", json={"title": "anything", "description": "anything", "date": datetime.utcnow().isoformat(), "location": "anything", "capacity": 1}, headers=headers)

    unique_name = str(uuid.uuid4())[:8]
                
    db = SessionLocal()
    brand_new_user = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="attendee")
    db.add(brand_new_user)
    db.commit()
    
    
    check_login2 = client.post("/login", data={"username": brand_new_user.username, "password": "testpass123"})
    
    token_data = check_login2.json()
                
    token = token_data["access_token"]
    new_headers = {"Authorization": f"Bearer {token}"}
    
    event_data = create_event.json()
    event_id = event_data["event"]["id"]
    
    unique_name = str(uuid.uuid4())[:8]
                
    db = SessionLocal()
    brand_new_user2 = models.User(username=unique_name, hashed_password=hash_password("testpass123"), role="attendee")
    db.add(brand_new_user2)
    db.commit()

    check_login3 = client.post("/login", data={"username": brand_new_user2.username, "password": "testpass123"})

    token_data = check_login3.json()
                
    token2 = token_data["access_token"]
    new_headers2 = {"Authorization": f"Bearer {token2}"}
    
    event_data2 = create_event.json()
    event_id2 = event_data["event"]["id"]


    book_event_user = client.post(f"/Events/{event_id}/book", headers=new_headers)

    book_event_user2 = client.post(f"/Events/{event_id}/book", headers=new_headers2)


    assert book_event_user.status_code == 200
    assert book_event_user2.status_code == 409


def make_user_token():
    name = str(uuid.uuid4())[:8]
    client.post("/register", json={"username": name, "password": "testpass123"})
    login = client.post("/login", data={"username": name, "password": "testpass123"})
    return name, login.json()["access_token"]

def test_websocket_chat():
    name = str(uuid.uuid4())[:8]
    room = str(uuid.uuid4())[:8]

    client.post("/register", json={"username": name, "password": "testpass123"})
    check_login = client.post("/login", data={"username": name, "password": "testpass123"})
    token = check_login.json()["access_token"]

    with client.websocket_connect(f"/ws/{room}?token={token}") as websocket:
        websocket.send_text(f"{name}: hello from test")
        response = websocket.receive_text()

        assert response == f"{name}: hello from test"


def test_websocket_bad_token():
    room = str(uuid.uuid4())[:8]

    with pytest.raises(WebSocketDisconnect):
        with client.websocket_connect(f"/ws/{room}?token-not-a-real-token"):
            pass



def test_websocket_two_users_same_room():
    room = str(uuid.uuid4())[:8]
    name1, token1 = make_user_token()
    name2, token2 = make_user_token()

    with client.websocket_connect(f"/ws/{room}?token={token1}") as ws1:
        with client.websocket_connect(f"/ws/{room}?token={token2}") as ws2:
            ws1.send_text(f"{name1}: hi from user 1")


            assert ws1.receive_text() == f"{name1}: hi from user 1"
            assert ws2.receive_text() == f"{name1}: hi from user 1"



def test_websocket_history():
    room = str(uuid.uuid4())[:8]
    name1, token1 = make_user_token()
    name2, token2 = make_user_token()

    with client.websocket_connect(f"/ws/{room}?token={token1}") as ws1:
        ws1.send_text(f"{name1}: saved message")
        assert ws1.receive_text() == f"{name1}: saved message"

    with client.websocket_connect(f"/ws/{room}?token={token2}") as ws2:
        assert ws2.receive_text() == f"{name1}: saved message"