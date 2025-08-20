# Certificate API Guide

This guide provides comprehensive documentation for the Certificate API endpoints in the NextByte platform.

## Overview

The Certificate API allows you to:

- Generate certificates when students complete courses
- Verify certificate authenticity
- Manage certificate data
- Retrieve certificate statistics
- Get user-specific certificates with filtering and sorting

## Base URL

```
http://localhost:3000/certificate
```

## Authentication

- **User endpoints**: Require JWT token (User authentication)
- **Admin endpoints**: Require Admin JWT token (Admin authentication)
- **Public endpoints**: No authentication required

## Endpoints

### 1. Get My Certificates (Current User)

**GET** `/certificate/my-certificates`

Get all certificates for the currently authenticated user.

**Authentication**: User JWT required

**Query Parameters**:

- `isActive` (optional): Filter by active status (`true`/`false`)
- `sortBy` (optional): Sort by field (`issuedDate`, `courseName`, `completionPercentage`)
- `sortOrder` (optional): Sort order (`ASC`/`DESC`, default: `DESC`)
- `limit` (optional): Number of records to return
- `offset` (optional): Number of records to skip

**Example Request**:

```
GET /certificate/my-certificates?sortBy=issuedDate&sortOrder=DESC&limit=10&isActive=true
```

**Response**:

```json
[
  {
    "id": 1,
    "certificateNumber": "CERT-1703123456789-123",
    "studentName": "John Doe",
    "courseName": "Web Development Fundamentals",
    "completionPercentage": 100,
    "issuedDate": "2023-12-21T10:30:00.000Z",
    "isActive": true,
    "certificateUrl": "https://example.com/certificate.pdf",
    "certificatePdfUrl": "https://example.com/certificate.pdf",
    "student": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "course": {
      "id": 1,
      "name": "Web Development Fundamentals",
      "slugName": "web-development-fundamentals"
    },
    "enrollment": {
      "id": 123,
      "status": "completed",
      "progress": 100
    },
    "createdAt": "2023-12-21T10:30:00.000Z",
    "updatedAt": "2023-12-21T10:30:00.000Z"
  }
]
```

### 2. Get My Certificate Statistics

**GET** `/certificate/my-certificates/stats`

Get certificate statistics for the currently authenticated user.

**Authentication**: User JWT required

**Response**:

```json
{
  "totalCertificates": 5,
  "activeCertificates": 4,
  "expiredCertificates": 1,
  "recentCertificates": 2
}
```

### 3. Get User Certificates

**GET** `/certificate/user/:userId/certificates`

Get all certificates for a specific user.

**Authentication**: User JWT required

**Query Parameters**: Same as "Get My Certificates"

**Example Request**:

```
GET /certificate/user/123/certificates?sortBy=courseName&sortOrder=ASC
```

**Response**: Same as "Get My Certificates"

### 4. Get User Certificate Statistics

**GET** `/certificate/user/:userId/certificates/stats`

Get certificate statistics for a specific user.

**Authentication**: User JWT required

**Response**: Same as "Get My Certificate Statistics"

### 5. Get Student Certificates (Legacy Route)

**GET** `/certificate/student/:studentId`

Get all certificates for a specific student (legacy route, same as user certificates).

**Authentication**: User JWT required

**Query Parameters**: Same as "Get My Certificates"

### 6. Generate Certificate for Completed Course

**POST** `/certificate/generate`

Generate a certificate when a student completes a course (100% progress).

**Authentication**: User JWT required

**Request Body**:

```json
{
  "enrollmentId": 123,
  "certificateUrl": "https://example.com/certificate.pdf",
  "certificatePdfUrl": "https://example.com/certificate.pdf"
}
```

**Response**:

```json
{
  "id": 1,
  "certificateNumber": "CERT-1703123456789-123",
  "studentName": "John Doe",
  "courseName": "Web Development Fundamentals",
  "completionPercentage": 100,
  "issuedDate": "2023-12-21T10:30:00.000Z",
  "isActive": true,
  "certificateUrl": "https://example.com/certificate.pdf",
  "certificatePdfUrl": "https://example.com/certificate.pdf",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "course": {
    "id": 1,
    "name": "Web Development Fundamentals",
    "slugName": "web-development-fundamentals"
  },
  "enrollment": {
    "id": 123,
    "status": "completed",
    "progress": 100
  },
  "createdAt": "2023-12-21T10:30:00.000Z",
  "updatedAt": "2023-12-21T10:30:00.000Z"
}
```

### 7. Generate Certificate by Enrollment ID

**POST** `/certificate/generate/:enrollmentId`

Generate a certificate for a specific enrollment.

**Authentication**: User JWT required

**Response**: Same as above

### 8. Verify Certificate

**GET** `/certificate/verify/:certificateNumber`

Verify the authenticity of a certificate by its number.

**Authentication**: Public (no authentication required)

**Response**:

```json
{
  "id": 1,
  "certificateNumber": "CERT-1703123456789-123",
  "studentName": "John Doe",
  "courseName": "Web Development Fundamentals",
  "completionPercentage": 100,
  "issuedDate": "2023-12-21T10:30:00.000Z",
  "isActive": true,
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "course": {
    "id": 1,
    "name": "Web Development Fundamentals",
    "slugName": "web-development-fundamentals"
  }
}
```

### 9. Get Certificate by ID

**GET** `/certificate/:id`

Retrieve a specific certificate by its ID.

**Authentication**: User JWT required

**Response**: Same as certificate generation response

### 10. Get Course Certificates

**GET** `/certificate/course/:courseId`

Get all certificates issued for a specific course.

**Authentication**: Admin JWT required

**Response**: Array of certificates

### 11. Get Certificate Statistics (Admin)

**GET** `/certificate/stats`

Get certificate statistics for admin dashboard.

**Authentication**: Admin JWT required

**Response**:

```json
{
  "totalCertificates": 150,
  "activeCertificates": 145,
  "expiredCertificates": 5
}
```

### 12. Get All Certificates (Admin)

**GET** `/certificate`

Get all certificates in the system.

**Authentication**: Admin JWT required

**Response**: Array of all certificates

### 13. Create Certificate (Admin)

**POST** `/certificate`

Create a certificate manually (admin only).

**Authentication**: Admin JWT required

**Request Body**:

```json
{
  "studentId": 1,
  "courseId": 1,
  "enrollmentId": 123,
  "studentName": "John Doe",
  "courseName": "Web Development Fundamentals",
  "completionPercentage": 100,
  "expiryDate": "2024-12-21T10:30:00.000Z",
  "certificateUrl": "https://example.com/certificate.pdf",
  "certificatePdfUrl": "https://example.com/certificate.pdf"
}
```

### 14. Update Certificate

**PATCH** `/certificate/:id`

Update certificate information.

**Authentication**: Admin JWT required

**Request Body**: Partial certificate data

### 15. Delete Certificate

**DELETE** `/certificate/:id`

Delete a certificate.

**Authentication**: Admin JWT required

## Query Parameters for User Certificate Routes

### Filtering Options

- **`isActive`**: Filter by certificate status
  - `true`: Only active certificates
  - `false`: Only inactive certificates
  - Not provided: All certificates

### Sorting Options

- **`sortBy`**: Field to sort by
  - `issuedDate`: Sort by certificate issue date
  - `courseName`: Sort by course name
  - `completionPercentage`: Sort by completion percentage

- **`sortOrder`**: Sort direction
  - `ASC`: Ascending order
  - `DESC`: Descending order (default)

### Pagination Options

- **`limit`**: Number of records to return
- **`offset`**: Number of records to skip

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Course must be 100% completed to generate certificate",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Certificate with ID 123 not found",
  "error": "Not Found"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## Business Rules

1. **Certificate Generation**:
   - Only generated when course progress is 100%
   - One certificate per enrollment
   - Automatic certificate number generation

2. **Certificate Verification**:
   - Public endpoint for verification
   - Checks certificate validity and expiry
   - Returns certificate details if valid

3. **Access Control**:
   - Students can only access their own certificates
   - Admins can access all certificates
   - Certificate verification is public

4. **User Certificate Access**:
   - Users can access their own certificates via `/my-certificates`
   - Users can access specific user certificates via `/user/:userId/certificates`
   - All user routes support filtering, sorting, and pagination

## Integration with Course Completion

The certificate system integrates with the enrollment system:

1. When a student completes a course (progress = 100%)
2. The system can automatically generate a certificate
3. Certificate is linked to the enrollment record
4. Certificate includes student and course information

## Testing Examples

### Get My Certificates

```bash
curl -X GET "http://localhost:3000/certificate/my-certificates?sortBy=issuedDate&sortOrder=DESC&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get My Certificate Statistics

```bash
curl -X GET http://localhost:3000/certificate/my-certificates/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User Certificates with Filtering

```bash
curl -X GET "http://localhost:3000/certificate/user/123/certificates?isActive=true&sortBy=courseName&sortOrder=ASC" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Generate Certificate

```bash
curl -X POST http://localhost:3000/certificate/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enrollmentId": 123
  }'
```

### Verify Certificate

```bash
curl -X GET http://localhost:3000/certificate/verify/CERT-1703123456789-123
```
