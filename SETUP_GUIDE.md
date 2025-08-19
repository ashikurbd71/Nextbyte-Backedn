# NextByte Admin System Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository and install dependencies:**

```bash
git clone <repository-url>
cd nextbyte-api
npm install
```

2. **Install additional dependencies:**

```bash
npm install nodemailer @types/nodemailer
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/nextbyte_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (for welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password in `SMTP_PASS`

## Database Setup

1. **Create PostgreSQL database:**

```sql
CREATE DATABASE nextbyte_db;
```

2. **The application will automatically create tables** when you start it (synchronize: true is enabled)

## Running the Application

1. **Development mode:**

```bash
npm run start:dev
```

2. **Production mode:**

```bash
npm run build
npm run start:prod
```

## Testing the Admin System

### 1. Create a Super Admin

```bash
curl -X POST http://localhost:3000/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@nextbyte.com",
    "password": "superpassword123",
    "role": "super_admin",
    "designation": "System Administrator",
    "jobType": "permanent",
    "bio": "System administrator with full access",
    "experience": 10,
    "expertise": ["System Administration", "Security", "Database Management"],
    "salary": 100000.00
  }'
```

### 2. Login as Admin

```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@nextbyte.com",
    "password": "superpassword123"
  }'
```

### 3. Create Additional Admins

```bash
curl -X POST http://localhost:3000/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Developer",
    "email": "john@nextbyte.com",
    "password": "devpassword123",
    "role": "admin",
    "designation": "Senior Developer",
    "jobType": "permanent",
    "bio": "Full-stack developer with 5 years experience",
    "experience": 5,
    "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
    "salary": 75000.00,
    "fbLink": "https://facebook.com/johndev",
    "linkedinLink": "https://linkedin.com/in/johndev",
    "instaLink": "https://instagram.com/johndev",
    "photoUrl": "https://example.com/john-photo.jpg"
  }'
```

### 4. Get All Admins (with authentication)

```bash
curl -X GET http://localhost:3000/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_FROM_LOGIN"
```

## Available Job Types

- `permanent` - Full-time permanent employee
- `contractual` - Contract-based employee
- `project_based` - Project-specific employment

## Available Admin Roles

- `moderator` - Basic moderation privileges
- `admin` - Administrative privileges
- `super_admin` - Full system access

## Features Overview

### ✅ Implemented Features

1. **Admin Registration & Authentication**
   - Secure registration with email validation
   - JWT-based login system
   - Password hashing with bcrypt

2. **Profile Management**
   - Complete profile information (name, email, bio, designation)
   - Professional details (experience, expertise, salary)
   - Social media links (Facebook, LinkedIn, Instagram)
   - Profile photo URL

3. **Employment Management**
   - Job type classification (permanent, contractual, project-based)
   - Salary management
   - Role-based access control

4. **Account Management**
   - Account activation/deactivation
   - Admin search and filtering
   - Complete CRUD operations

5. **Email Notifications**
   - Automatic welcome emails with login credentials
   - Professional HTML email templates
   - Security reminders

6. **Security Features**
   - JWT token authentication
   - Password hashing
   - Input validation
   - Role-based access control

## API Endpoints Summary

| Method | Endpoint                   | Description            | Auth Required |
| ------ | -------------------------- | ---------------------- | ------------- |
| POST   | `/admin/register`          | Create new admin       | No            |
| POST   | `/admin/login`             | Admin login            | No            |
| GET    | `/admin`                   | Get all admins         | Yes           |
| GET    | `/admin/:id`               | Get admin by ID        | Yes           |
| PATCH  | `/admin/:id`               | Update admin           | Yes           |
| DELETE | `/admin/:id`               | Delete admin           | Yes           |
| PATCH  | `/admin/:id/deactivate`    | Deactivate admin       | Yes           |
| PATCH  | `/admin/:id/activate`      | Activate admin         | Yes           |
| GET    | `/admin/role/:role`        | Get admins by role     | Yes           |
| GET    | `/admin/job-type/:jobType` | Get admins by job type | Yes           |
| GET    | `/admin/search/active`     | Get active admins      | Yes           |
| GET    | `/admin/search/inactive`   | Get inactive admins    | Yes           |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check database credentials

2. **Email Not Sending**
   - Verify SMTP credentials
   - Check if 2FA is enabled on Gmail
   - Ensure app password is correct

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration (24 hours)
   - Ensure Authorization header format is correct

4. **Validation Errors**
   - Check required fields in request body
   - Verify email format
   - Ensure password meets minimum requirements (6 characters)

### Logs

Check application logs for detailed error information:

```bash
npm run start:dev
```

## Production Deployment

1. **Environment Variables**
   - Use strong JWT_SECRET
   - Configure production database
   - Set up production email service

2. **Security**
   - Enable HTTPS
   - Configure CORS properly
   - Use environment-specific configurations

3. **Database**
   - Disable synchronize in production
   - Use proper database migrations
   - Configure connection pooling

## Support

For issues and questions:

1. Check the API documentation
2. Review error logs
3. Verify environment configuration
4. Test with provided examples

## Next Steps

1. **Frontend Integration**
   - Create admin dashboard
   - Implement authentication UI
   - Add profile management forms

2. **Additional Features**
   - Password reset functionality
   - Email verification
   - Audit logging
   - Advanced search and filtering

3. **Security Enhancements**
   - Rate limiting
   - Input sanitization
   - API versioning
   - Monitoring and logging
