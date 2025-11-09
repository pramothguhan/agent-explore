# JWT Authentication Setup

The frontend is now fully configured for JWT authentication with your FastAPI backend.

## What's Implemented

### ✅ Complete Auth System
- **Login & Signup**: Full forms with validation
- **JWT Token Management**: Secure storage in localStorage
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Auth Context**: Global auth state management
- **Input Validation**: Client-side validation using Zod
- **Error Handling**: User-friendly error messages
- **Auto-redirect**: Logged-in users redirected from auth page

### ✅ Security Features
- **Password Requirements**: Min 8 chars, uppercase, lowercase, number
- **Email Validation**: Proper email format checking
- **Name Validation**: Alphanumeric with spaces, hyphens, apostrophes
- **Token Verification**: Validates token on app load
- **Secure Storage**: JWT stored in localStorage (consider httpOnly cookies for production)
- **No Sensitive Logging**: Authentication details not logged to console

## Required Backend Endpoints

Your FastAPI backend needs these endpoints:

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**
- 400: Validation error (email already exists, weak password, etc.)
- 422: Invalid input format

### POST /api/auth/login
Authenticate existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** Same as signup
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

**Error Responses:**
- 401: Invalid credentials
- 422: Invalid input format

### GET /api/auth/verify
Verify if a token is valid.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "User Name",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Error Responses:**
- 401: Invalid or expired token

### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Same as verify

### POST /api/auth/refresh (Optional)
Refresh an expired token.

**Request Body:**
```json
{
  "token": "old-jwt-token"
}
```

**Response:** Same as login

## FastAPI Implementation Example

```python
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import uuid

app = FastAPI()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Config
SECRET_KEY = "your-secret-key-here"  # Use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    email: str
    name: str
    created_at: datetime

class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

# Helper functions
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        # Fetch user from database
        user = get_user_by_id(user_id)  # Implement this
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Endpoints
@app.post("/api/auth/signup", response_model=AuthResponse)
async def signup(user_data: UserCreate):
    # Check if user exists
    if user_exists(user_data.email):  # Implement this
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate password strength (basic example)
    if len(user_data.password) < 8:
        raise HTTPException(status_code=400, detail="Password too weak")
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    # Save to database (implement this)
    save_user(user_id, user_data.name, user_data.email, hashed_password)
    
    # Create token
    access_token = create_access_token(data={"sub": user_id})
    
    user = User(
        id=user_id,
        email=user_data.email,
        name=user_data.name,
        created_at=datetime.utcnow()
    )
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=user
    )

@app.post("/api/auth/login", response_model=AuthResponse)
async def login(credentials: UserLogin):
    # Get user from database
    user = get_user_by_email(credentials.email)  # Implement this
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create token
    access_token = create_access_token(data={"sub": user.id})
    
    return AuthResponse(
        access_token=access_token,
        token_type="bearer",
        user=User(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at
        )
    )

@app.get("/api/auth/verify", response_model=User)
async def verify_token(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

## Required Python Packages

```bash
pip install fastapi uvicorn python-jose[cryptography] passlib[bcrypt] python-multipart
```

## Environment Variables

Add to your backend `.env`:

```env
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Testing the Auth Flow

1. **Start your FastAPI backend**:
   ```bash
   uvicorn main:app --reload
   ```

2. **Start the React frontend**:
   ```bash
   npm run dev
   ```

3. **Test signup**:
   - Navigate to `/auth`
   - Click "Sign up"
   - Enter name, email, and password
   - Should create account and redirect to home

4. **Test login**:
   - Logout using the button in navigation
   - Click "Sign in"
   - Enter credentials
   - Should login and redirect to home

5. **Test protected routes**:
   - Logout
   - Try to access `/`
   - Should redirect to `/auth`

## Security Recommendations for Production

1. **Use httpOnly cookies instead of localStorage** for JWT storage
2. **Implement refresh tokens** for better security
3. **Add rate limiting** to prevent brute force attacks
4. **Use HTTPS** for all communication
5. **Implement CORS** properly in FastAPI
6. **Add email verification** for new accounts
7. **Implement password reset** functionality
8. **Add 2FA** for enhanced security
9. **Monitor failed login attempts**
10. **Regular security audits**

## CORS Configuration

Add to your FastAPI app:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Next Steps

1. ✅ Frontend auth is ready
2. 🔧 Implement the 5 auth endpoints in FastAPI
3. 🔗 Test the full auth flow
4. 🔒 Add session/paper ownership to your other endpoints
5. 📊 Link sessions to authenticated users

The frontend will automatically include the JWT token in all API requests via the `Authorization: Bearer <token>` header.
