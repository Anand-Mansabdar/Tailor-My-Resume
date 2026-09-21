# Quick Start Guide - Fixed and Ready!

## ✅ Issue Fixed

The Pydantic v2 compatibility error has been resolved. The backend is now ready to start.

## Prerequisites

### MongoDB Setup

You need MongoDB running. Choose one option:

**Option 1: Install MongoDB Locally (Recommended for Development)**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB:
   - Windows: It should start automatically as a service
   - Or manually: Run `mongod` in a terminal

**Option 2: Use MongoDB Atlas (Free Cloud Database)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env`: `MONGODB_URL=your_connection_string`

**Check if MongoDB is Running:**
```powershell
# Try connecting
mongosh --eval "db.version()"
```

## Start the Application

### Terminal 1: Start Backend

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Successfully connected to MongoDB: tailor_resume_db
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2: Start Frontend

```powershell
cd frontend
npm run dev
```

You should see:
```
VITE v... ready in ...ms

➜  Local:   http://localhost:5173/
```

## Test Authentication

1. Open http://localhost:5173
2. Click "Register"
3. Create an account:
   - Email: test@example.com
   - Username: testuser
   - Password: testpass123
4. You should be logged in and redirected to /tailor-resume
5. Try logging out and logging in again
6. Try accessing /tailor-resume in an incognito window (should redirect to login)

## Troubleshooting

### "MongoDB connection failed"
- **Check if MongoDB is running**: `mongod --version`
- **Start MongoDB**: 
  - Windows: `net start MongoDB` (as Administrator)
  - Or use MongoDB Compass to start it
- **Verify connection string** in `backend/.env`

### "Module not found" errors
```powershell
cd backend
pip install -r requirements.txt
```

### Frontend errors
```powershell
cd frontend
npm install
```

### Port already in use
- Backend port 8000 busy: Use `--port 8001` instead
- Frontend port 5173 busy: Vite will auto-select another port

## Environment Configuration

Ensure `backend/.env` has these set:

```env
# Required for authentication
JWT_SECRET_KEY=your_secure_random_string_here
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=tailor_resume_db

# Required for resume tailoring
GROQ_API_KEY=your_groq_api_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

Generate a secure JWT secret:
```powershell
# If you have OpenSSL
openssl rand -hex 32

# Or use Python
python -c "import secrets; print(secrets.token_hex(32))"
```

## Success Indicators

✅ **Backend Started:**
- "Successfully connected to MongoDB" message appears
- No errors in terminal
- Visit http://localhost:8000/docs - Should see API documentation

✅ **Frontend Started:**
- Vite dev server running
- Open http://localhost:5173 - Should see landing page
- Navbar shows "Log in" and "Register" buttons

✅ **Authentication Working:**
- Can register new user
- Can login
- Navbar shows username when logged in
- /tailor-resume accessible only when logged in
- Logout works and redirects to home

## MongoDB Commands (Optional)

View registered users:
```powershell
mongosh
use tailor_resume_db
db.users.find().pretty()
db.users.countDocuments()
```

## All Fixed! 🎉

The Pydantic v2 error is resolved. Your authentication system is ready to use!
