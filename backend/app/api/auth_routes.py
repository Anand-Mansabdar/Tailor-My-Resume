from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from typing import Optional
import logging

from app.models.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.database import get_database
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def get_auth_service(db = Depends(get_database)) -> AuthService:
    """Dependency to get auth service instance"""
    return AuthService(db)

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Register a new user
    
    - **email**: Valid email address
    - **username**: Unique username (3-50 characters, alphanumeric)
    - **password**: Strong password (minimum 8 characters)
    """
    try:
        token_response = await auth_service.register_user(user_data)
        
        # Set HTTP-only cookie with JWT token
        response.set_cookie(
            key="access_token",
            value=token_response.access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=settings.jwt_access_token_expire_minutes * 60
        )
        
        logger.info(f"User registered successfully: {user_data.email}")
        return token_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )

@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: UserLogin,
    response: Response,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Authenticate user and return access token
    
    - **email**: Registered email address
    - **password**: User password
    """
    try:
        token_response = await auth_service.login_user(login_data)
        
        # Set HTTP-only cookie with JWT token
        response.set_cookie(
            key="access_token",
            value=token_response.access_token,
            httponly=True,
            secure=False,  # Set to True in production with HTTPS
            samesite="lax",
            max_age=settings.jwt_access_token_expire_minutes * 60
        )
        
        logger.info(f"User logged in successfully: {login_data.email}")
        return token_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

@router.post("/logout")
async def logout(response: Response):
    """
    Logout user by clearing the authentication cookie
    """
    response.delete_cookie(key="access_token", samesite="lax")
    logger.info("User logged out successfully")
    return {"message": "Logged out successfully"}

@router.get("/verify", response_model=UserResponse)
async def verify_token(
    access_token: Optional[str] = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Verify the current authentication token and return user info
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    from app.utils.auth import AuthUtils
    
    # Decode token
    payload = AuthUtils.decode_access_token(access_token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get user info
    user = await auth_service.get_current_user(email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    access_token: Optional[str] = Cookie(None),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    Get current authenticated user information
    """
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    from app.utils.auth import AuthUtils
    
    payload = AuthUtils.decode_access_token(access_token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = await auth_service.get_current_user(email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
