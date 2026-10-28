from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "meetpoint")
MONGO_DB_URL = os.getenv("MONGO_DB_URL")

client = MongoClient(MONGO_DB_URL)



database = client[MONGO_DB_NAME]

posts_collection = database["posts"]
