from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from app.database import Base, engine, SessionLocal
from app import models
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
import json
from fastapi import Request
from app.auth import hash_password, verify_password, create_access_token, get_current_user, require_role
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class UserCreate(BaseModel):
    username: str
    password: str

class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    location: str
    capacity: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    check_user = db.query(models.User).filter(models.User.username == user.username).first()

    if check_user is not None:
        raise HTTPException(status_code=400, detail="Username already taken")
    else:
        new_user = models.User(username = user.username, hashed_password=hash_password(user.password))
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message" : "User added Successfully"}


@app.post("/login")
def login(info: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    check_username = db.query(models.User).filter(models.User.username == info.username).first()


    if check_username is not None:
        existing_user = verify_password(info.password, check_username.hashed_password)
        if existing_user:
            token = create_access_token({"sub": info.username, "role": check_username.role})
            return {"access_token": token, "token_type": "bearer"}
        else:
            raise HTTPException(status_code=401, detail="Invalid Password")
    else:
        raise HTTPException(status_code=404, detail="User not Found")


@app.post("/create-events")
def create_event(event: EventCreate, db: Session = Depends(get_db), required_role: dict = Depends(require_role(["organizer", "admin", "attendee"]))):

    check_user = db.query(models.User).filter(models.User.username == required_role["username"]).first()

    if check_user is not None:
        new_event = models.Event(organizer_id=check_user.id, title=event.title, description=event.description, date=event.date, location=event.location, capacity=event.capacity)
        db.add(new_event)
        db.commit()
        db.refresh(new_event)
        return {"event": new_event}
    else:
        raise HTTPException(status_code=404, detail="User Not Found")

@app.get("/Events")
def view_events(db: Session = Depends(get_db)):

    return db.query(models.Event).all()


@app.get("/Events/{event_id}")
def specific_event(event_id: int, db: Session = Depends(get_db)):

    check_event = db.query(models.Event).filter(models.Event.id == event_id).first()

    if check_event is not None:
        return check_event
    else:
        raise HTTPException(status_code=404, detail="Event not Found")


@app.put("/Events/{event_id}")
def update_event(edit_event: EventCreate, event_id: int, db: Session = Depends(get_db), user_role: dict = Depends(require_role(["organizer", "admin"]))):

    check_event = db.query(models.Event).filter(models.Event.id == event_id).first()

    if check_event is None:
        raise HTTPException(status_code=404, detail="Event not Found")
    else:
        check_user = db.query(models.User).filter(models.User.username == user_role["username"]).first()

        if check_event.organizer_id == check_user.id:
            check_event.location = edit_event.location
            check_event.date = edit_event.date
            check_event.capacity= edit_event.capacity
            check_event.description = edit_event.description
            check_event.title = edit_event.title
            db.commit()
            db.refresh(check_event)
            return {"message": "Event Updated Successfully"}
        else:
            raise HTTPException(status_code=403, detail="Not Authorized")

            


@app.delete("/Events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db), user_role: dict = Depends(require_role(["organizer", "admin"]))):

    check_event = db.query(models.Event).filter(models.Event.id == event_id).first()

    if check_event is None:
        raise HTTPException(status_code=404, detail="Event not Found")
    else:
        check_user = db.query(models.User).filter(models.User.username == user_role["username"]).first()

        if check_event.organizer_id == check_user.id:
            db.delete(check_event)
            db.commit()
            return {"message": "Event Deleted Successfully"}
        else:
            raise HTTPException(status_code=403, detail="Not Authorized")



@app.post("/Events/{event_id}/book")
def booking(event_id: int, db: Session = Depends(get_db), user_role: dict = Depends(require_role(["organizer", "admin", "attendee"]))):
    check_event = db.query(models.Event).filter(models.Event.id == event_id).with_for_update().first()

    if check_event is None:
        raise HTTPException(status_code=404, detail="Event not Found")

    booking = db.query(models.Booking).filter(models.Booking.event_id == event_id).count()

        
    check_user = db.query(models.User).filter(models.User.username == user_role["username"]).first()

    existing_booking = db.query(models.Booking).filter(models.Booking.event_id == check_event.id, models.Booking.user_id == check_user.id).first()

    if existing_booking is not None:
        raise HTTPException(status_code=400, detail="You are already booked for this Event")

    if booking >= check_event.capacity:
        raise HTTPException(status_code=409, detail="There is No More Booking!")


    new_booking = models.Booking(user_id=check_user.id, event_id=check_event.id)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"message": "You are booked for this Event"}



@app.get("/my-bookings")
def my_booking(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):

    check_user = db.query(models.User).filter(models.User.username == user["username"]).first()

    check_booking = db.query(models.Booking).filter(models.Booking.user_id == check_user.id).all()

    results = []

    for booking in check_booking:
        each_event = db.query(models.Event).filter(models.Event.id == booking.event_id).first()
        event_info = {"id": each_event.id, "title": each_event.title, "description": each_event.description, "date": each_event.date, "location": each_event.location, "capacity": each_event.capacity}
        results.append(event_info)


    if check_booking:
        return results
    else:
        raise HTTPException(status_code=404, detail="You don't have any Events booked")