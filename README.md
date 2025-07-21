# Leave Request Management System - Backend

## Overview
NestJS-based backend API for the Leave Request Management System (LRMS). This backend provides REST APIs for managing employee leave requests, authentication, and role-based access control for administrators, managers, and employees.

## Tech Stack
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Language**: TypeScript
- **Environment**: Node.js
- **Security**: bcryptjs for password hashing, role-based access control

## Features

### ✅ Completed Features
- **JWT Authentication System**: Complete registration and login functionality
- **Role-Based Access Control (RBAC)**: Support for ADMIN, MANAGER, and EMPLOYEE roles
- **User Management**: User profiles, role assignment, and user queries
- **Security**: Password hashing, input validation, and authorization guards
- **API Documentation**: Comprehensive documentation with examples

### 🚀 Architecture Features
- **Modular Design**: Separate modules for Auth, User, and core functionality
- **Type Safety**: Full TypeScript implementation with DTOs and validation
- **Guard System**: JWT authentication and role-based authorization guards
- **Error Handling**: Consistent error responses and validation
- **Database Integration**: TypeORM with PostgreSQL

## User Roles

### ADMIN
- Full system access
- Can assign roles to other users
- Access to all user management functions
- Can view all users and filter by role

### MANAGER
- Can view users and access management functions
- Cannot assign roles (admin-only function)
- Limited administrative capabilities

### EMPLOYEE
- Basic access level
- Can view and manage own profile
- Default role for new registrations

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sithikaru/leave-request-management-system-backend.git
cd leave-request-management-system-backend
```

2. Install dependencies:
```bash
cd api
npm install
```

3. Environment Configuration:
Create a `.env` file in the `api/` directory with the following variables:
```properties
DATABASE_URL=postgresql://username:password@localhost:5432/lrms_db
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3000
```

4. Database Setup:
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE lrms_db;
```

5. Start the application:
```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod

# Build the application
npm run build
```

6. Create Admin User:
After starting the application, create your first admin user:
```bash
npm run seed:admin
```

This creates an admin user with:
- Email: `admin@lrms.com`
- Password: `admin123`
- Role: `ADMIN`

## Project Structure
```
api/
├── src/
│   ├── auth/
│   │   ├── dto/              # Authentication DTOs (RegisterDto, LoginDto, UpdateUserRoleDto)
│   │   ├── guards/           # Authentication guards (JwtAuthGuard, RolesGuard)
│   │   ├── strategies/       # Passport strategies (JWT, Local)
│   │   ├── auth.controller.ts # Authentication endpoints
│   │   ├── auth.module.ts    # Authentication module
│   │   └── auth.service.ts   # Authentication logic
│   ├── user/
│   │   ├── user.controller.ts # User management endpoints
│   │   ├── user.module.ts    # User module
│   │   └── user.service.ts   # User business logic
│   ├── entities/
│   │   └── user.entity.ts    # User database entity with roles
│   ├── decorators/
│   │   ├── current-user.decorator.ts # Extract current user from JWT
│   │   └── roles.decorator.ts        # Role-based access decorator
│   ├── app.controller.ts     # Main application controller
│   ├── app.module.ts         # Root application module
│   ├── app.service.ts        # Main application service
│   └── main.ts              # Application entry point
├── scripts/
│   └── seed-admin.ts        # Admin user creation script
├── test/                    # End-to-end tests
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```
## API Endpoints

### Authentication Endpoints
```http
POST /auth/register    # Register new user (defaults to EMPLOYEE role)
POST /auth/login       # Login with email/password, returns JWT token
```

### User Management Endpoints (Require JWT Authentication)
```http
GET /users             # Get all users (ADMIN, MANAGER only)
GET /users/profile     # Get current user profile (All roles)
GET /users/role/:role  # Get users by role (ADMIN, MANAGER only)
PUT /users/role        # Update user role (ADMIN only)
```

### Example Usage

1. **Register a new user**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employee@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lrms.com",
    "password": "admin123"
  }'
```

3. **Get user profile** (requires JWT token):
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

4. **Update user role** (admin only):
```bash
curl -X PUT http://localhost:3000/users/role \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "role": "MANAGER"
  }'
```

## API Documentation
Detailed API documentation with examples is available in:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Basic authentication endpoints
- [API_DOCUMENTATION_RBAC.md](./API_DOCUMENTATION_RBAC.md) - Role-based access control endpoints

## Available Scripts
```bash
npm run start:dev     # Start development server with hot reload
npm run start:prod    # Start production server
npm run build         # Build the application
npm run seed:admin    # Create admin user (email: admin@lrms.com, password: admin123)
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Run ESLint
```

## Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Granular permissions based on user roles
- **Input Validation**: class-validator for request validation
- **CORS Configuration**: Secure cross-origin resource sharing
- **Environment Variables**: Secure configuration management

## Database Schema

### User Entity
```typescript
{
  id: number (Primary Key, Auto-generated)
  email: string (Unique, Required)
  password: string (Hashed, Required)
  first_name?: string (Optional)
  last_name?: string (Optional)
  role: UserRole (ADMIN | MANAGER | EMPLOYEE, Default: EMPLOYEE)
  createdAt: Date (Auto-generated)
  updatedAt: Date (Auto-generated)
}
```

## Error Handling
The API returns consistent error responses:
- `400 Bad Request`: Invalid input or validation errors
- `401 Unauthorized`: Missing or invalid JWT token
- `403 Forbidden`: Insufficient permissions for the requested action
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `500 Internal Server Error`: Unexpected server errors

## Development Notes
- TypeScript is used throughout the application for type safety
- All endpoints use DTOs (Data Transfer Objects) for request/response validation
- Password fields are automatically excluded from all API responses
- The application uses TypeORM with PostgreSQL for data persistence
- Global validation pipes ensure all requests are validated before processing

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
