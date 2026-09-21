from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "Users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String(15), unique=True)

    hashed_password = Column(String(255))

    role = Column(String(10), default="attendee")

class Event(Base):
    __tablename__ = 'Events'

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150))

    description = Column(String(500))

    date = Column(DateTime)

    location = Column(String(100))

    capacity = Column(Integer)

    organizer_id = Column(Integer, ForeignKey("Users.id"))


class Booking(Base):
    __tablename__ = "Booking"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("Users.id"))

    event_id = Column(Integer, ForeignKey("Events.id"))

    booked_at = Column(DateTime, default=datetime.utcnow) 


class Message(Base):
    __tablename__ = "Messages"

    id = Column(Integer, primary_key=True, index=True)

    event_id = Column(Integer, ForeignKey("Events.id"), nullable=True)

    username = Column(String(15))

    content = Column(String(500))

    room_id = Column(String(20), default="global")

    sent_at = Column(DateTime, default=datetime.utcnow)