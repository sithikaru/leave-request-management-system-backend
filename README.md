# Leave Request Management System - Backend

## Overview
NestJS-based backend API for the Leave Request Management System (LRMS). This backend provides REST APIs for managing employee leave requests, authentication, and administrative functions.

## Tech Stack
- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Language**: TypeScript
- **Environment**: Node.js

## Features
- Employee authentication and authorization
- Leave request management (create, read, update, delete)
- Leave approval workflow
- Team calendar and availability tracking
- Administrative dashboard APIs
- Real-time notifications

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd leave-request-management-system-backend
```

2. Install dependencies:
```bash
cd api
npm install
```

3. Environment Configuration:
Copy the `.env.example` to `.env` and update the database connection details:
```bash
cp api/.env.example api/.env
```

Update the following variables in `api/.env`:
```properties
DATABASE_URL=postgresql://username:password@localhost:5432/lrms_db
PORT=3000
```

4. Database Setup:
Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE lrms_db;
```

5. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Project Structure
```
api/
├── src/
│   ├── app.controller.ts     # Main application controller
│   ├── app.module.ts         # Root application module
│   ├── app.service.ts        # Main application service
│   └── main.ts              # Application entry point
├── test/                     # End-to-end tests
├── .env                     # Environment variables
├── package.json             # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## API Documentation
Once the server is running, API documentation will be available at:
- Development: `http://localhost:3000/api`

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
