# NextByte Admin API Documentation

## Overview

This API provides comprehensive admin management functionality for the NextByte platform, including user registration, authentication, profile management, and administrative operations.

## Base URL

```
http://localhost:3000/admin
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Admin Registration

**POST** `/admin/register`

Creates a new admin account and sends welcome email with credentials.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@nextbyte.com",
  "bio": "Experienced software engineer with 5+ years in web development",
  "designation": "Senior Developer",
  "experience": 5,
  "fbLink": "https://facebook.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "instaLink": "https://instagram.com/johndoe",
  "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
  "salary": 75000.0,
  "jobType": "permanent",
  "photoUrl": "https://example.com/photo.jpg",
  "role": "admin",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@nextbyte.com",
  "bio": "Experienced software engineer with 5+ years in web development",
  "designation": "Senior Developer",
  "experience": 5,
  "fbLink": "https://facebook.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "instaLink": "https://instagram.com/johndoe",
  "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
  "salary": 75000.0,
  "jobType": "permanent",
  "photoUrl": "https://example.com/photo.jpg",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Admin Login

**POST** `/admin/login`

Authenticates admin and returns JWT token.

**Request Body:**

```json
{
  "email": "john.doe@nextbyte.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "admin": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@nextbyte.com",
    "bio": "Experienced software engineer with 5+ years in web development",
    "designation": "Senior Developer",
    "experience": 5,
    "fbLink": "https://facebook.com/johndoe",
    "linkedinLink": "https://linkedin.com/in/johndoe",
    "instaLink": "https://instagram.com/johndoe",
    "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
    "salary": 75000.0,
    "jobType": "permanent",
    "photoUrl": "https://example.com/photo.jpg",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get All Admins

**GET** `/admin`

Returns all admin accounts (requires authentication).

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@nextbyte.com",
    "bio": "Experienced software engineer with 5+ years in web development",
    "designation": "Senior Developer",
    "experience": 5,
    "fbLink": "https://facebook.com/johndoe",
    "linkedinLink": "https://linkedin.com/in/johndoe",
    "instaLink": "https://instagram.com/johndoe",
    "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
    "salary": 75000.0,
    "jobType": "permanent",
    "photoUrl": "https://example.com/photo.jpg",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 4. Get Admin by ID

**GET** `/admin/:id`

Returns a specific admin by ID (requires authentication).

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@nextbyte.com",
  "bio": "Experienced software engineer with 5+ years in web development",
  "designation": "Senior Developer",
  "experience": 5,
  "fbLink": "https://facebook.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "instaLink": "https://instagram.com/johndoe",
  "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
  "salary": 75000.0,
  "jobType": "permanent",
  "photoUrl": "https://example.com/photo.jpg",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 5. Update Admin

**PATCH** `/admin/:id`

Updates admin information (requires authentication).

**Request Body:**

```json
{
  "name": "John Smith",
  "designation": "Lead Developer",
  "salary": 85000.0
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john.doe@nextbyte.com",
  "bio": "Experienced software engineer with 5+ years in web development",
  "designation": "Lead Developer",
  "experience": 5,
  "fbLink": "https://facebook.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "instaLink": "https://instagram.com/johndoe",
  "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
  "salary": 85000.0,
  "jobType": "permanent",
  "photoUrl": "https://example.com/photo.jpg",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

### 6. Delete Admin

**DELETE** `/admin/:id`

Deletes an admin account (requires authentication).

**Response:**

```json
{
  "message": "Admin deleted successfully"
}
```

### 7. Deactivate Admin

**PATCH** `/admin/:id/deactivate`

Deactivates an admin account (requires authentication).

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@nextbyte.com",
  "bio": "Experienced software engineer with 5+ years in web development",
  "designation": "Senior Developer",
  "experience": 5,
  "fbLink": "https://facebook.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "instaLink": "https://instagram.com/johndoe",
  "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
  "salary": 75000.0,
  "jobType": "permanent",
  "photoUrl": "https://example.com/photo.jpg",
  "role": "admin",
  "isActive": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### 8. Activate Admin

**PATCH** `/admin/:id/activate`

Activates a deactivated admin account (requires authentication).

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@nextbyte.com",
  "bio": "Experienced software engineer with 5+ years in web development",
  "designation": "Senior Developer",
  "experience": 5,
  "fbLink": "https://facebook.com/johndoe",
  "linkedinLink": "https://linkedin.com/in/johndoe",
  "instaLink": "https://instagram.com/johndoe",
  "expertise": ["JavaScript", "React", "Node.js", "TypeScript"],
  "salary": 75000.0,
  "jobType": "permanent",
  "photoUrl": "https://example.com/photo.jpg",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:30:00.000Z"
}
```

### 9. Get Admins by Role

**GET** `/admin/role/:role`

Returns all admins with a specific role (requires authentication).

**Available Roles:**

- `moderator`
- `admin`
- `super_admin`

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@nextbyte.com",
    "role": "admin",
    "isActive": true
    // ... other fields
  }
]
```

### 10. Get Admins by Job Type

**GET** `/admin/job-type/:jobType`

Returns all admins with a specific job type (requires authentication).

**Available Job Types:**

- `permanent`
- `contractual`
- `project_based`

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@nextbyte.com",
    "jobType": "permanent",
    "isActive": true
    // ... other fields
  }
]
```

### 11. Get Active Admins

**GET** `/admin/search/active`

Returns all active admin accounts (requires authentication).

**Response:**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@nextbyte.com",
    "isActive": true
    // ... other fields
  }
]
```

### 12. Get Inactive Admins

**GET** `/admin/search/inactive`

Returns all inactive admin accounts (requires authentication).

**Response:**

```json
[
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@nextbyte.com",
    "isActive": false
    // ... other fields
  }
]
```

## Data Models

### Admin Entity

```typescript
interface Admin {
  id: number;
  name: string;
  email: string;
  bio?: string;
  designation?: string;
  experience?: number;
  fbLink?: string;
  linkedinLink?: string;
  instaLink?: string;
  expertise?: string[];
  salary?: number;
  jobType: 'permanent' | 'contractual' | 'project_based';
  photoUrl?: string;
  role: 'moderator' | 'admin' | 'super_admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (for welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Admin not found",
  "error": "Not Found"
}
```

### 409 Conflict

```json
{
  "statusCode": 409,
  "message": "Admin with this email already exists",
  "error": "Conflict"
}
```

## Features

### ✅ Implemented Features

- **Complete CRUD Operations**: Create, Read, Update, Delete admin accounts
- **Authentication System**: JWT-based login with email/password
- **Role-Based Access**: Moderator, Admin, Super Admin roles
- **Job Type Management**: Permanent, Contractual, Project-based employment types
- **Profile Management**: Bio, designation, experience, social links, expertise, salary
- **Account Status**: Active/Inactive account management
- **Email Notifications**: Automatic welcome emails with login credentials
- **Security**: Password hashing with bcrypt
- **Data Validation**: Comprehensive input validation
- **Search & Filter**: By role, job type, and account status

### 🔧 Technical Features

- **TypeORM Integration**: Database operations with PostgreSQL
- **JWT Authentication**: Secure token-based authentication
- **Email Service**: Nodemailer integration for automated emails
- **Input Validation**: Class-validator decorators
- **Response Transformation**: Class-transformer for data sanitization
- **Error Handling**: Comprehensive error responses
- **TypeScript**: Full type safety

## Usage Examples

### Creating a Super Admin

```bash
curl -X POST http://localhost:3000/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@nextbyte.com",
    "password": "superpassword123",
    "role": "super_admin",
    "designation": "System Administrator",
    "jobType": "permanent"
  }'
```

### Admin Login

```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@nextbyte.com",
    "password": "superpassword123"
  }'
```

### Getting All Admins (with authentication)

```bash
curl -X GET http://localhost:3000/admin \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Updating Admin Profile

```bash
curl -X PATCH http://localhost:3000/admin/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "designation": "Lead Developer",
    "salary": 90000.00
  }'
```

## Security Considerations

1. **Password Security**: All passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Tokens expire after 24 hours for security
3. **Input Validation**: All inputs are validated using class-validator
4. **Email Verification**: Welcome emails are sent to verify account creation
5. **Role-Based Access**: Different admin roles have different permissions
6. **Account Status**: Admins can be deactivated without deletion

## Email Templates

The system automatically sends welcome emails with:

- Professional HTML formatting
- Login credentials
- Security reminders
- Direct login links
- Company branding

## Database Schema

The admin table includes all necessary fields for comprehensive admin management:

- Personal information (name, email, bio)
- Professional details (designation, experience, expertise)
- Social media links (Facebook, LinkedIn, Instagram)
- Employment details (salary, job type)
- System fields (role, status, timestamps)
- Security (hashed password)
