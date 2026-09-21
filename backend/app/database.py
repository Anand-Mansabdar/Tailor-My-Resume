from pymongo import MongoClient, ASCENDING
from pymongo.errors import ConnectionFailure
from app.config import settings
import logging

logger = logging.getLogger(__name__)

class Database:
    client: MongoClient = None
    db = None

db = Database()

def connect_to_mongo():
    """Connect to MongoDB database"""
    try:
        db.client = MongoClient(settings.mongodb_url)
        db.db = db.client[settings.mongodb_db_name]
        
        # Test the connection
        db.client.admin.command('ping')
        logger.info(f"Successfully connected to MongoDB: {settings.mongodb_db_name}")
        
        # Create indexes
        create_indexes()
        
    except ConnectionFailure as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")

def create_indexes():
    """Create database indexes for optimal performance"""
    try:
        # Unique index on email
        db.db.users.create_index([("email", ASCENDING)], unique=True)
        # Unique index on username
        db.db.users.create_index([("username", ASCENDING)], unique=True)
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.error(f"Error creating indexes: {e}")

def get_database():
    """Dependency to get database instance"""
    return db.db
