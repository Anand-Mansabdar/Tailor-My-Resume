from typing import Optional
from datetime import datetime
from pymongo.database import Database
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException, status
import logging

from app.models.user import UserCreate, UserLogin, UserInDB, UserResponse, TokenResponse
from app.utils.auth import AuthUtils

logger = logging.getLogger(__name__)

class AuthService:
    """Service for handling user authentication operations"""
    
    def __init__(self, db: Database):
        self.db = db
        self.users_collection = db.users
    
    async def register_user(self, user_data: UserCreate) -> TokenResponse:
        """Register a new user"""
        try:
            # Normalize email to lowercase
            email_lower = str(user_data.email).lower()
            username_lower = user_data.username.lower()
            
            # Check if user already exists
            existing_user = self.users_collection.find_one({
                "$or": [
                    {"email": email_lower},
                    {"username": username_lower}
                ]
            })
            
            if existing_user:
                if existing_user.get("email") == email_lower:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email already registered"
                    )
                else:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Username already taken"
                    )
            
            # Hash the password
            hashed_password = AuthUtils.hash_password(user_data.password)
            
            # Create user document
            user_doc = {
                "email": email_lower,
                "username": username_lower,
                "hashed_password": hashed_password,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "is_active": True
            }
            
            # Insert user into database
            result = self.users_collection.insert_one(user_doc)
            user_doc["_id"] = result.inserted_id
            
            logger.info(f"New user registered: {email_lower}")
            
            # Generate access token
            access_token = AuthUtils.create_access_token(
                data={
                    "sub": email_lower,
                    "user_id": str(result.inserted_id)
                }
            )
            
            # Return token response
            user_response = UserResponse(
                id=str(result.inserted_id),
                email=email_lower,
                username=username_lower,
                created_at=user_doc["created_at"]
            )
            
            return TokenResponse(
                access_token=access_token,
                user=user_response
            )
            
        except HTTPException:
            raise
        except DuplicateKeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email or username already exists"
            )
        except Exception as e:
            logger.error(f"Registration error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to register user"
            )
    
    async def login_user(self, login_data: UserLogin) -> TokenResponse:
        """Authenticate user and return access token"""
        try:
            # Normalize email to lowercase
            email_lower = str(login_data.email).lower()
            
            # Find user by email
            user = self.users_collection.find_one({"email": email_lower})
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            # Verify password
            if not AuthUtils.verify_password(login_data.password, user["hashed_password"]):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            # Check if user is active
            if not user.get("is_active", True):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Account is inactive"
                )
            
            logger.info(f"User logged in: {email_lower}")
            
            # Generate access token
            access_token = AuthUtils.create_access_token(
                data={
                    "sub": email_lower,
                    "user_id": str(user["_id"])
                }
            )
            
            # Return token response
            user_response = UserResponse(
                id=str(user["_id"]),
                email=user["email"],
                username=user["username"],
                created_at=user["created_at"]
            )
            
            return TokenResponse(
                access_token=access_token,
                user=user_response
            )
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Login error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Login failed"
            )
    
    async def get_current_user(self, email: str) -> Optional[UserResponse]:
        """Get current user by email"""
        try:
            user = self.users_collection.find_one({"email": email})
            
            if not user:
                return None
            
            return UserResponse(
                id=str(user["_id"]),
                email=user["email"],
                username=user["username"],
                created_at=user["created_at"]
            )
            
        except Exception as e:
            logger.error(f"Error fetching user: {e}")
            return None
    
    async def verify_user(self, email: str) -> bool:
        """Verify if user exists and is active"""
        try:
            user = self.users_collection.find_one({"email": email})
            return user is not None and user.get("is_active", True)
        except Exception as e:
            logger.error(f"Error verifying user: {e}")
            return False
