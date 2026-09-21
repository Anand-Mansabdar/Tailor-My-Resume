#!/usr/bin/env python3
"""Test registration endpoint"""
from app.models.user import UserCreate
import json

# Test data
test_data = {
    "email": "test@example.com",
    "username": "testuser",
    "password": "testpass123"
}

print("Testing UserCreate validation...")
print(f"Input: {test_data}")

try:
    user = UserCreate(**test_data)
    print(f"✓ Validation successful!")
    print(f"  Email: {user.email}")
    print(f"  Username: {user.username}")
    print(f"  Password length: {len(user.password)}")
except Exception as e:
    print(f"✗ Validation failed: {e}")
    exit(1)

print("\n✅ Registration data model is working correctly!")
