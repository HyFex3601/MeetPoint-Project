from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base

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