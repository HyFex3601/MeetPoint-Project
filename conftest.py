from dotenv import load_dotenv
load_dotenv(".env.test")

from app.database import Base, engine
from app import models
from app.mongo import posts_collection

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

assert posts_collection.database.name == "meetpoint_test", "Refusing to wipe a non-test database"
posts_collection.delete_many({})