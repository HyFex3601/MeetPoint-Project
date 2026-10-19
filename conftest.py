from dotenv import load_dotenv

load_dotenv(".env.test")

from app.database import Base, engine
from app import models

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

