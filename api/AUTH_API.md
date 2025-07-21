# Authentication API Documentation

## Overview
This document describes the JWT-based authentication system implemented in the Leave Request Management System backend.

## Authentication Endpoints

### 1. User Registration
**Endpoint**: `POST /auth/register`

**Description**: Creates a new user account with hashed password storage.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "employee"
}
```

**Validation Rules**:
- `email`: Must be a valid email format
- `password`: Minimum 6 characters
- `first_name`: Optional string
- `last_name`: Optional string  
- `role`: Optional enum (`admin`, `manager`, `employee`). Defaults to `employee`

**Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "employee",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Responses**:
- `409 Conflict`: User with email already exists
- `400 Bad Request`: Validation errors

### 2. User Login
**Endpoint**: `POST /auth/login`

**Description**: Authenticates user credentials and returns JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "employee",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Validation errors

## Protected Endpoints

### 3. Get All Users
**Endpoint**: `GET /users`

**Description**: Retrieves list of all users (requires authentication).

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "employee",
    "created_at": "2025-07-21T10:00:00.000Z",
    "updated_at": "2025-07-21T10:00:00.000Z"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT token

## JWT Token Structure

**Payload**:
```json
{
  "sub": 1,
  "email": "user@example.com",
  "role": "employee",
  "iat": 1642780800,
  "exp": 1643385600
}
```

**Token Expiration**: 7 days (configurable via `JWT_EXPIRES_IN`)

## User Roles

- **admin**: Full system access
- **manager**: Department-level access  
- **employee**: Limited access to own data

## Security Features

1. **Password Hashing**: Uses bcrypt with salt rounds (10)
2. **JWT Secret**: Configurable secret key for token signing
3. **Token Expiration**: Automatic token expiry (7 days default)
4. **Input Validation**: Comprehensive request validation using class-validator
5. **CORS Configuration**: Controlled cross-origin access
6. **Password Exclusion**: Password hashes never returned in responses

## Database Schema

**Users Table**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role user_role DEFAULT 'employee',
  first_name VARCHAR,
  last_name VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
```

## Environment Variables

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
DATABASE_URL=postgresql://username:password@localhost:5432/lrms_db
```

## Usage Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### Access protected endpoint
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error
