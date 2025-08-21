# Enrollment API Documentation

## Overview

The Enrollment API provides comprehensive functionality for managing course enrollments, payment processing through SSL Commerz, and student performance tracking.

**Base URL:** `http://localhost:3000/api/enrollments`

---

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📚 API Endpoints

### 1. Create Direct Enrollment

**POST** `/enrollments`

Creates a new enrollment when payment is already processed.

#### Request Body

```json
{
  "amountPaid": 5000,
  "transactionId": "TXN_20240115_001",
  "paymentMethod": "SSLCOMMERZ",
  "studentId": 123,
  "courseId": 1
}
```

#### Response (201 Created)

```json
{
  "id": 1,
  "amountPaid": 5000,
  "transactionId": "TXN_20240115_001",
  "status": "ACTIVE",
  "paymentStatus": "SUCCESS",
  "enrolledAt": "2024-01-15T10:30:00Z",
  "student": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "course": {
    "id": 1,
    "name": "Web Development Course",
    "instructor": {
      "name": "Jane Smith"
    }
  }
}
```

---

### 2. Initiate SSL Commerz Payment ⭐ **NEW**

**POST** `/enrollments/payment/initiate`

Initiates payment through SSL Commerz gateway with auto-population features.

#### Request Body (Minimal)

```json
{
  "courseId": 1,
  "studentId": 123
}
```

#### Request Body (With Overrides)

```json
{
  "courseId": 1,
  "studentId": 123,
  "amount": 4500,
  "transactionId": "CUSTOM_TXN_001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com"
}
```

#### Auto-Population Features

- **Transaction ID**: Auto-generated as `TXN_{timestamp}_{random}`
- **Customer Details**: Auto-populated from user profile
- **Amount**: Auto-populated from course price (prioritizes discount price)

#### Response (201 Created)

```json
{
  "enrollmentId": 1,
  "sessionKey": "sslcommerz_session_key",
  "gatewayUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
  "status": "initiated",
  "transactionId": "TXN_1703123456789_1234"
}
```

---

### 3. Payment Success Callback

**POST** `/enrollments/payment/success`

Handles successful payment callback from SSL Commerz.

#### Query Parameters

- `tran_id`: Transaction ID from SSL Commerz
- `val_id`: Validation ID from SSL Commerz

#### Response

Redirects to frontend success page with enrollment ID.

---

### 4. Payment Failure Callback

**POST** `/enrollments/payment/fail`

Handles failed payment callback from SSL Commerz.

#### Query Parameters

- `tran_id`: Transaction ID from SSL Commerz

#### Response

Redirects to frontend failure page with transaction ID.

---

### 5. Payment Cancellation Callback

**POST** `/enrollments/payment/cancel`

Handles cancelled payment callback from SSL Commerz.

#### Query Parameters

- `tran_id`: Transaction ID from SSL Commerz

#### Response

Redirects to frontend cancellation page with transaction ID.

---

### 6. Payment IPN (Instant Payment Notification)

**POST** `/enrollments/payment/ipn`

Server-to-server notification from SSL Commerz.

#### Request Body

SSL Commerz IPN data

#### Response (200 OK)

```json
{
  "status": "processed",
  "message": "IPN processed successfully"
}
```

---

### 7. Get All Enrollments (Admin)

**GET** `/enrollments`

Retrieves all enrollments (admin only).

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "amountPaid": 5000,
    "status": "ACTIVE",
    "enrolledAt": "2024-01-15T10:30:00Z",
    "student": {
      "id": 123,
      "name": "John Doe"
    },
    "course": {
      "id": 1,
      "name": "Web Development Course"
    }
  }
]
```

---

### 8. Get My Enrollments

**GET** `/enrollments/my`

Retrieves enrollments for the authenticated user.

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "amountPaid": 5000,
    "status": "ACTIVE",
    "progress": 75,
    "course": {
      "id": 1,
      "name": "Web Development Course",
      "thumbnail": "course-thumbnail.jpg"
    }
  }
]
```

---

### 9. Get My Payment History

**GET** `/enrollments/my-payment-history`

Retrieves payment history for the authenticated user.

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "amountPaid": 5000,
    "transactionId": "TXN_1703123456789_1234",
    "paymentStatus": "SUCCESS",
    "paidAt": "2024-01-15T10:30:00Z",
    "course": {
      "name": "Web Development Course"
    }
  }
]
```

---

### 10. Get Enrollments by Course

**GET** `/enrollments/course/{courseId}`

Retrieves all enrollments for a specific course.

#### Path Parameters

- `courseId`: Course ID (integer)

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "student": {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "enrolledAt": "2024-01-15T10:30:00Z",
    "progress": 75
  }
]
```

---

### 11. Get Course Leaderboard

**GET** `/enrollments/course/{courseId}/leaderboard`

Retrieves leaderboard data based on assignment performance.

#### Path Parameters

- `courseId`: Course ID (integer)

#### Response (200 OK)

```json
[
  {
    "studentId": 123,
    "studentName": "John Doe",
    "totalMarks": 85,
    "averageMarks": 85,
    "rank": 1,
    "assignmentsCompleted": 5
  }
]
```

---

### 12. Get Assignment Marks Data

**GET** `/enrollments/course/{courseId}/assignment-marks`

Retrieves comprehensive assignment marks data for a course.

#### Path Parameters

- `courseId`: Course ID (integer)

#### Response (200 OK)

```json
{
  "courseId": 1,
  "courseName": "Web Development Course",
  "totalStudents": 25,
  "assignments": [
    {
      "assignmentId": 1,
      "assignmentName": "HTML Basics",
      "averageMarks": 78.5,
      "highestMarks": 95,
      "lowestMarks": 60
    }
  ],
  "studentPerformance": [
    {
      "studentId": 123,
      "studentName": "John Doe",
      "totalMarks": 85,
      "averageMarks": 85
    }
  ]
}
```

---

### 13. Get Student Assignment Marks

**GET** `/enrollments/course/{courseId}/student/{studentId}/assignment-marks`

Retrieves assignment marks for a specific student in a course.

#### Path Parameters

- `courseId`: Course ID (integer)
- `studentId`: Student ID (integer)

#### Response (200 OK)

```json
{
  "studentId": 123,
  "studentName": "John Doe",
  "courseId": 1,
  "courseName": "Web Development Course",
  "assignments": [
    {
      "assignmentId": 1,
      "assignmentName": "HTML Basics",
      "marks": 85,
      "maxMarks": 100,
      "submittedAt": "2024-01-15T10:30:00Z",
      "reviewedAt": "2024-01-16T14:20:00Z"
    }
  ],
  "totalMarks": 85,
  "averageMarks": 85
}
```

---

### 14. Get My Assignment Marks

**GET** `/enrollments/course/{courseId}/my-assignment-marks`

Retrieves assignment marks for the authenticated user in a course.

#### Path Parameters

- `courseId`: Course ID (integer)

#### Response (200 OK)

```json
{
  "studentId": 123,
  "studentName": "John Doe",
  "courseId": 1,
  "courseName": "Web Development Course",
  "assignments": [
    {
      "assignmentId": 1,
      "assignmentName": "HTML Basics",
      "marks": 85,
      "maxMarks": 100,
      "submittedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalMarks": 85,
  "averageMarks": 85
}
```

---

### 15. Get My Performance

**GET** `/enrollments/my-performance`

Retrieves performance statistics for the authenticated user.

#### Response (200 OK)

```json
{
  "totalEnrollments": 5,
  "completedCourses": 3,
  "averageProgress": 78.5,
  "totalSpent": 25000,
  "performanceByCourse": [
    {
      "courseId": 1,
      "courseName": "Web Development Course",
      "progress": 85,
      "averageMarks": 88
    }
  ]
}
```

---

### 16. Get Enrollment Statistics (Admin)

**GET** `/enrollments/statistics`

Retrieves overall enrollment statistics.

#### Response (200 OK)

```json
{
  "totalEnrollments": 150,
  "activeEnrollments": 120,
  "completedEnrollments": 25,
  "totalRevenue": 750000,
  "monthlyEnrollments": [
    {
      "month": "January 2024",
      "enrollments": 25,
      "revenue": 125000
    }
  ],
  "topCourses": [
    {
      "courseId": 1,
      "courseName": "Web Development Course",
      "enrollments": 45,
      "revenue": 225000
    }
  ]
}
```

---

### 17. Get Motivational Message

**GET** `/enrollments/motivational-message`

Gets a personalized motivational message based on user performance.

#### Response (200 OK)

```json
{
  "message": "Great job, John! You're making excellent progress in your courses. Keep up the amazing work!",
  "performanceLevel": "excellent",
  "suggestions": [
    "Try to complete more assignments to improve your ranking",
    "Consider enrolling in advanced courses"
  ]
}
```

---

### 18. Get Enrollment by ID

**GET** `/enrollments/{id}`

Retrieves a specific enrollment by its ID.

#### Path Parameters

- `id`: Enrollment ID (integer)

#### Response (200 OK)

```json
{
  "id": 1,
  "amountPaid": 5000,
  "transactionId": "TXN_1703123456789_1234",
  "status": "ACTIVE",
  "paymentStatus": "SUCCESS",
  "enrolledAt": "2024-01-15T10:30:00Z",
  "student": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "course": {
    "id": 1,
    "name": "Web Development Course",
    "instructor": {
      "name": "Jane Smith"
    }
  }
}
```

---

### 19. Update Enrollment

**PATCH** `/enrollments/{id}`

Updates an enrollment by ID.

#### Path Parameters

- `id`: Enrollment ID (integer)

#### Request Body

```json
{
  "status": "COMPLETED",
  "progress": 100
}
```

#### Response (200 OK)

```json
{
  "id": 1,
  "status": "COMPLETED",
  "progress": 100,
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

---

### 20. Update Enrollment Progress

**PATCH** `/enrollments/{id}/progress`

Updates the progress percentage for an enrollment.

#### Path Parameters

- `id`: Enrollment ID (integer)

#### Request Body

```json
{
  "progress": 75
}
```

#### Response (200 OK)

```json
{
  "id": 1,
  "progress": 75,
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

---

### 21. Delete Enrollment

**DELETE** `/enrollments/{id}`

Deletes an enrollment by ID.

#### Path Parameters

- `id`: Enrollment ID (integer)

#### Response (200 OK)

```json
{
  "message": "Enrollment deleted successfully"
}
```

---

## 🔧 Data Transfer Objects (DTOs)

### CreateEnrollmentDto

```typescript
{
  amountPaid: number;        // Required
  transactionId: string;     // Required
  paymentMethod?: PaymentMethod; // Optional
  studentId: number;         // Required
  courseId: number;          // Required
}
```

### SslCommerzPaymentDto

```typescript
{
  amount?: number;           // Auto-populated from course price
  transactionId?: string;    // Auto-generated if not provided
  customerName?: string;     // Auto-populated from user name
  customerEmail?: string;    // Auto-populated from user email
  customerPhone?: string;    // Auto-populated from user phone
  customerAddress?: string;  // Auto-populated from user address
  courseId: number;          // Required
  studentId: number;         // Required
}
```

### UpdateEnrollmentDto

```typescript
{
  status?: EnrollmentStatus; // Optional
  progress?: number;         // Optional (0-100)
  paymentStatus?: PaymentStatus; // Optional
}
```

---

## 📊 Enums

### EnrollmentStatus

```typescript
enum EnrollmentStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
```

### PaymentStatus

```typescript
enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}
```

### PaymentMethod

```typescript
enum PaymentMethod {
  SSLCOMMERZ = 'SSLCOMMERZ',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
}
```

---

## 🚀 Usage Examples

### 1. Simple Payment Initiation

```bash
curl -X POST http://localhost:3000/api/enrollments/payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "courseId": 1,
    "studentId": 123
  }'
```

### 2. Payment with Custom Amount

```bash
curl -X POST http://localhost:3000/api/enrollments/payment/initiate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "courseId": 1,
    "studentId": 123,
    "amount": 4500
  }'
```

### 3. Get My Enrollments

```bash
curl -X GET http://localhost:3000/api/enrollments/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update Progress

```bash
curl -X PATCH http://localhost:3000/api/enrollments/1/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "progress": 75
  }'
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Amount paid is required"],
  "error": "Bad Request"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Student is already enrolled in this course",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Course with ID 1 not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Payment initiation failed: SSL Commerz API error",
  "error": "Internal Server Error"
}
```

---

## 🔐 Security Considerations

1. **JWT Authentication**: Most endpoints require valid JWT tokens
2. **Input Validation**: All inputs are validated using class-validator
3. **SQL Injection Protection**: Uses TypeORM with parameterized queries
4. **Payment Security**: SSL Commerz handles sensitive payment data
5. **Rate Limiting**: Consider implementing rate limiting for payment endpoints

---

## 📝 Notes

- **Auto-population**: The payment initiation endpoint automatically populates missing fields from user and course data
- **Transaction ID**: Auto-generated in format `TXN_{timestamp}_{random}`
- **Payment Callbacks**: SSL Commerz callbacks are handled automatically
- **Progress Tracking**: Progress is tracked as a percentage (0-100)
- **Performance Analytics**: Comprehensive performance tracking and analytics
- **Motivational System**: Personalized motivational messages based on performance

---

## 🔄 Payment Flow

1. **Initiate Payment** → Creates pending enrollment
2. **User Payment** → SSL Commerz processes payment
3. **Success Callback** → Enrollment activated, notifications sent
4. **Failure/Cancel** → Enrollment marked as failed/cancelled
5. **IPN** → Server-to-server verification

This API provides a complete enrollment management system with integrated payment processing, performance tracking, and analytics.
