# LRMS Backend API Documentation - Role-Based Access Control

## Role-Based Access Control (RBAC) System

### User Roles
- **ADMIN**: Full access to all endpoints, can assign roles to other users
- **MANAGER**: Can view users and access management functions
- **EMPLOYEE**: Basic access, can view own profile

### Authentication Required
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

## User Management Endpoints

### 1. Get All Users
```http
GET /users
Authorization: Bearer <jwt_token>
Roles: ADMIN, MANAGER
```

**Response:**
```json
[
  {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Get User Profile
```http
GET /users/profile
Authorization: Bearer <jwt_token>
Roles: ALL (own profile only)
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "EMPLOYEE",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Get Users by Role
```http
GET /users/role/:role
Authorization: Bearer <jwt_token>
Roles: ADMIN, MANAGER

Parameters:
- role: ADMIN | MANAGER | EMPLOYEE
```

**Example:**
```http
GET /users/role/EMPLOYEE
```

**Response:**
```json
[
  {
    "id": 2,
    "username": "employee1",
    "email": "emp1@example.com",
    "role": "EMPLOYEE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4. Update User Role (Admin Only)
```http
PUT /users/role
Authorization: Bearer <jwt_token>
Roles: ADMIN only
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": 2,
  "newRole": "MANAGER"
}
```

**Response:**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": 2,
    "username": "employee1",
    "email": "emp1@example.com",
    "role": "MANAGER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- **403 Forbidden** (Non-admin trying to update roles):
```json
{
  "message": "Only admins can assign roles",
  "statusCode": 403
}
```

- **404 Not Found** (User doesn't exist):
```json
{
  "message": "User not found",
  "statusCode": 404
}
```

- **400 Bad Request** (Invalid role):
```json
{
  "message": ["newRole must be one of the following values: ADMIN, MANAGER, EMPLOYEE"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## Authentication Endpoints (Previously Implemented)

### Register
```http
POST /auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "newuser",
    "email": "user@example.com",
    "role": "EMPLOYEE"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "adminpassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "ADMIN"
  }
}
```

## Security Features

### 1. Role-Based Guards
- `@Roles()` decorator specifies which roles can access an endpoint
- `RolesGuard` enforces role-based access control
- JWT authentication required for all protected endpoints

### 2. Input Validation
- All request bodies validated using class-validator
- Type safety ensured with TypeScript DTOs
- Proper error messages for validation failures

### 3. Password Security
- Passwords hashed using bcryptjs before storage
- Passwords excluded from all API responses
- Secure password validation during login

### 4. Admin Restrictions
- Only ADMIN users can assign roles to other users
- Role assignment includes validation to prevent unauthorized access
- Audit trail through proper error handling and logging

## Usage Examples

### Creating an Admin User (First Time Setup)
Since the first user defaults to EMPLOYEE role, you'll need to manually update the database or create a seed script:

```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'your_first_admin_user';
```

### Typical Admin Workflow
1. Admin logs in and receives JWT token
2. Admin views all users: `GET /users`
3. Admin assigns manager role: `PUT /users/role`
4. Manager can now view users but cannot assign roles

### Error Handling
All endpoints return consistent error formats with appropriate HTTP status codes:
- 400: Bad Request (validation errors)
- 401: Unauthorized (missing/invalid JWT)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error
