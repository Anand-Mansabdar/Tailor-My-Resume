# Authentication System Setup Guide

This guide will help you set up and test the authentication system for the AI Resume Tailor application.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- MongoDB installed and running locally (or MongoDB Atlas account)

## Backend Setup

### 1. Install MongoDB (if not already installed)

#### Windows:
- Download MongoDB Community Server from https://www.mongodb.com/try/download/community
- Install and run MongoDB as a service, or start manually with `mongod`

#### macOS (with Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
Follow instructions at https://docs.mongodb.com/manual/installation/

### 2. Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

3. Edit `.env` and update the following variables:
   - `GROQ_API_KEY`: Your Groq API key
   - `JWT_SECRET_KEY`: Generate a secure random string (e.g., use `openssl rand -hex 32`)
   - `MONGODB_URL`: MongoDB connection string (default: `mongodb://localhost:27017`)
   - `MONGODB_DB_NAME`: Database name (default: `tailor_resume_db`)

### 3. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

The backend should now be running at http://localhost:8000

## Frontend Setup

### 1. Configure Frontend Environment

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

3. Verify `.env` contains:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Start the Frontend Development Server

```bash
npm run dev
```

The frontend should now be running at http://localhost:5173

## Testing the Authentication Flow

### 1. Test User Registration

1. Open http://localhost:5173 in your browser
2. Click "Register" in the navbar or navigate to http://localhost:5173/register
3. Fill in the registration form:
   - Email: test@example.com
   - Username: testuser
   - Password: testpassword123
   - Confirm Password: testpassword123
4. Click "Create account"
5. You should be automatically logged in and redirected to /tailor-resume

### 2. Test Protected Route Access

1. While logged in, navigate to http://localhost:5173/tailor-resume
2. You should see the resume tailoring page
3. Open a new incognito/private window
4. Navigate to http://localhost:5173/tailor-resume directly
5. You should be redirected to the login page

### 3. Test User Login

1. Logout using the "Logout" button in the navbar
2. Click "Log in" or navigate to http://localhost:5173/login
3. Enter your credentials:
   - Email: test@example.com
   - Password: testpassword123
4. Click "Log in"
5. You should be logged in and redirected to /tailor-resume

### 4. Test Logout

1. While logged in, click the "Logout" button in the navbar
2. You should be logged out and redirected to the home page
3. The navbar should now show "Log in" and "Register" buttons
4. Try accessing http://localhost:5173/tailor-resume
5. You should be redirected to the login page

### 5. Test Session Persistence

1. Log in to your account
2. Refresh the page
3. You should remain logged in (the authentication cookie persists)
4. Close and reopen the browser
5. Navigate back to the site - you should still be logged in (for 7 days by default)

### 6. Test Backend API Protection

1. While logged out, try to access the API directly:
   ```bash
   curl -X POST http://localhost:8000/api/tailor-resume \
     -F "job_description=Software Engineer" \
     -F "resume_text=Sample resume"
   ```
2. You should receive a 401 Unauthorized error

3. Log in through the frontend, then check your browser's cookies (Developer Tools > Application > Cookies)
4. Copy the `access_token` cookie value
5. Try the API call again with the cookie:
   ```bash
   curl -X POST http://localhost:8000/api/tailor-resume \
     -H "Cookie: access_token=YOUR_TOKEN_HERE" \
     -F "job_description=Software Engineer" \
     -F "resume_text=Sample resume"
   ```
6. The request should now succeed (assuming you have a valid Groq API key)

## Verifying MongoDB

You can verify that users are being stored in MongoDB:

```bash
# Connect to MongoDB shell
mongosh

# Switch to the database
use tailor_resume_db

# View all users (passwords are hashed)
db.users.find().pretty()

# Count total users
db.users.countDocuments()
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod --version` or check services
- Verify the MongoDB URL in `.env` matches your setup
- Check MongoDB logs for errors

### CORS Issues

- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check browser console for CORS errors
- Verify `credentials: "include"` is present in all frontend API calls

### Cookie Not Being Set

- Ensure backend and frontend are running on the same domain (localhost)
- Check that `credentials: "include"` is in fetch requests
- Verify `allow_credentials=True` in CORS middleware
- For production with HTTPS, set `secure=True` in cookie settings

### Token Expiration

- Default token expiry is 7 days (10080 minutes)
- Adjust `JWT_ACCESS_TOKEN_EXPIRE_MINUTES` in `.env` if needed
- Expired tokens will automatically log users out

## Security Notes for Production

When deploying to production:

1. **Generate a Strong JWT Secret**:
   ```bash
   openssl rand -hex 32
   ```

2. **Enable HTTPS**: Set `secure=True` in cookie configuration (auth_routes.py)

3. **Use Environment Variables**: Never commit `.env` files to version control

4. **MongoDB Security**:
   - Use MongoDB Atlas or secure your MongoDB instance
   - Enable authentication
   - Use strong passwords
   - Restrict network access

5. **Update CORS Settings**: Set specific frontend URLs instead of wildcard

6. **Password Requirements**: Consider enforcing stronger password policies

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT cookie
- `POST /api/auth/logout` - Logout and clear JWT cookie
- `GET /api/auth/verify` - Verify current authentication token
- `GET /api/auth/me` - Get current user information

### Protected Endpoints

- `POST /api/tailor-resume` - Tailor resume (requires authentication)

## Architecture Overview

### Backend
- **FastAPI**: Web framework
- **MongoDB**: User data storage
- **PyMongo**: MongoDB driver
- **bcrypt**: Password hashing
- **PyJWT**: JWT token generation and verification
- **HTTP-only cookies**: Secure token storage

### Frontend
- **React**: UI framework
- **React Router**: Client-side routing
- **Context API**: Global authentication state
- **Fetch API**: HTTP requests with credentials

### Security Features
- ✅ Password hashing with bcrypt
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies (XSS protection)
- ✅ SameSite cookie attribute (CSRF protection)
- ✅ Protected API routes with middleware
- ✅ Client-side route protection
- ✅ Email and username uniqueness validation
- ✅ Password strength requirements

## Success Criteria

✅ Users can register with email, username, and password
✅ Passwords are securely hashed with bcrypt
✅ Users can log in and receive JWT token in HTTP-only cookie
✅ Authenticated users can access /tailor-resume page
✅ Unauthenticated users are redirected to login page
✅ Users can logout and session is cleared
✅ Authentication state persists across page refreshes
✅ Backend API /tailor-resume endpoint is protected
✅ Navbar shows appropriate buttons based on auth state
✅ MongoDB stores user data with unique email and username indexes

Your authentication system is now complete and ready to use! 🎉
