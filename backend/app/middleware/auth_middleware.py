from fastapi import Request, HTTPException, status, Depends
from typing import Optional
import logging

from app.utils.auth import AuthUtils
from app.models.user import UserResponse
from app.services.auth_service import AuthService
from app.database import get_database

logger = logging.getLogger(__name__)

async def get_current_user_from_cookie(
    request: Request,
    db = Depends(get_database)
) -> UserResponse:
    """
    Middleware dependency to extract and verify user from JWT cookie.
    Raises 401 if authentication fails.
    """
    # Get token from cookie
    access_token = request.cookies.get("access_token")
    
    if not access_token:
        logger.warning("No access token found in cookies")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please login."
        )
    
    # Decode and verify token
    payload = AuthUtils.decode_access_token(access_token)
    
    if not payload:
        logger.warning("Invalid or expired token")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please login again."
        )
    
    # Extract user email from token
    email = payload.get("sub")
    if not email:
        logger.warning("No email found in token payload")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get user from database
    auth_service = AuthService(db)
    user = await auth_service.get_current_user(email)
    
    if not user:
        logger.warning(f"User not found for email: {email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user

async def get_optional_user_from_cookie(
    request: Request,
    db = Depends(get_database)
) -> Optional[UserResponse]:
    """
    Optional middleware dependency to extract user from JWT cookie.
    Returns None if authentication fails instead of raising exception.
    """
    try:
        return await get_current_user_from_cookie(request, db)
    except HTTPException:
        return None
