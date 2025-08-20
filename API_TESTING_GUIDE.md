# NextByte Learning Management System - API Testing Guide

## Overview

This guide provides comprehensive testing scenarios for all API endpoints in the NextByte Learning Management System.

## Base URL

```
http://localhost:3001
```

## Authentication

All protected endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 1. User Authentication

### 1.1 User Registration

```http
POST /users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01712345678",
  "password": "password123"
}
```

**Expected Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "01712345678",
  "isVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 1.2 User Login

```http
POST /users/login
Content-Type: application/json

{
  "phone": "01712345678",
  "password": "password123"
}
```

**Expected Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## 2. Categories

### 2.1 Create Category

```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Development",
  "description": "Learn modern web development technologies",
  "imageUrl": "https://example.com/web-dev.jpg"
}
```

### 2.2 Get All Categories

```http
GET /categories
Authorization: Bearer <token>
```

### 2.3 Get Category by ID

```http
GET /categories/1
Authorization: Bearer <token>
```

## 3. Courses

### 3.1 Create Course

```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Complete React Development",
  "slugName": "complete-react-development",
  "duration": "20 hours",
  "price": 5000,
  "discountPrice": 4000,
  "totalSeat": 100,
  "whatYouWillLearn": [
    "React fundamentals",
    "Hooks and state management",
    "Advanced patterns"
  ],
  "technologies": [
    {
      "name": "React",
      "image": "react-logo.png"
    }
  ],
  "requirements": [
    "Basic JavaScript knowledge",
    "HTML and CSS fundamentals"
  ],
  "promoVideoUrl": "https://example.com/promo.mp4",
  "thumbnail": "course-thumbnail.jpg",
  "categoryId": 1,
  "instructorId": 1
}
```

### 3.2 Get All Courses

```http
GET /courses
Authorization: Bearer <token>
```

### 3.3 Get Course by ID

```http
GET /courses/1
Authorization: Bearer <token>
```

### 3.4 Get Courses by Category

```http
GET /courses/category/1
Authorization: Bearer <token>
```

### 3.5 Get Course Statistics

```http
GET /courses/statistics
Authorization: Bearer <token>
```

## 4. Modules

### 4.1 Create Module

```http
POST /modules
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Fundamentals",
  "description": "Learn the basics of React",
  "order": 1,
  "duration": "4 hours",
  "courseId": 1
}
```

### 4.2 Get Modules by Course

```http
GET /modules/course/1
Authorization: Bearer <token>
```

### 4.3 Get Module with Content

```http
GET /modules/1/content
Authorization: Bearer <token>
```

### 4.4 Get Module Statistics

```http
GET /modules/statistics
Authorization: Bearer <token>
```

## 5. Lessons

### 5.1 Create Lesson

```http
POST /lessons
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Introduction to React",
  "description": "What is React and why use it?",
  "order": 1,
  "duration": "30 minutes",
  "videoUrl": "https://example.com/lesson1.mp4",
  "thumbnail": "lesson1-thumb.jpg",
  "isPreview": true,
  "moduleId": 1
}
```

### 5.2 Get Lessons by Module

```http
GET /lessons/module/1
Authorization: Bearer <token>
```

## 6. Assignments

### 6.1 Create Assignment

```http
POST /assignments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build a Todo App",
  "description": "Create a simple todo application using React",
  "githubLink": "https://github.com/example/todo-app",
  "liveLink": "https://todo-app-demo.netlify.app",
  "totalMarks": 100,
  "dueDate": "2024-02-01T23:59:59.000Z",
  "moduleId": 1
}
```

### 6.2 Get Assignments by Module

```http
GET /assignments/module/1
Authorization: Bearer <token>
```

## 7. Assignment Submissions

### 7.1 Submit Assignment

```http
POST /assignment-submissions
Authorization: Bearer <token>
Content-Type: application/json

{
  "description": "I have completed the todo app with all required features",
  "githubLink": "https://github.com/student/todo-app",
  "liveLink": "https://my-todo-app.netlify.app",
  "fileUrl": "https://example.com/submission.zip",
  "assignmentId": 1
}
```

### 7.2 Get My Submissions

```http
GET /assignment-submissions/my
Authorization: Bearer <token>
```

### 7.3 Get My Performance

```http
GET /assignment-submissions/my-performance
Authorization: Bearer <token>
```

### 7.4 Review Submission (Instructor)

```http
POST /assignment-submissions/1/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "marks": 85,
  "feedback": "Great work! The app is well-structured and functional. Consider adding more features for extra credit.",
  "status": "approved"
}
```

## 8. Reviews

### 8.1 Create Review

```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "comment": "Excellent course! Very comprehensive and well-structured.",
  "courseId": 1
}
```

### 8.2 Get Reviews by Course

```http
GET /reviews/course/1
Authorization: Bearer <token>
```

### 8.3 Get Course Rating

```http
GET /reviews/course/1/rating
Authorization: Bearer <token>
```

### 8.4 Get Top Rated Courses

```http
GET /reviews/top-rated?limit=10
Authorization: Bearer <token>
```

## 9. Payments

### 9.1 Initiate Payment

```http
POST /payments/initiate/1
Authorization: Bearer <token>
```

**Expected Response:**

```json
{
  "payment": {
    "id": 1,
    "amount": 4000,
    "transactionId": "TXN_1704067200000_1_1",
    "status": "pending"
  },
  "sslcommerzData": {
    "store_id": "your_store_id",
    "total_amount": 4000,
    "currency": "BDT",
    "tran_id": "TXN_1704067200000_1_1"
  },
  "gatewayUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
}
```

### 9.2 Get My Payments

```http
GET /payments/my
Authorization: Bearer <token>
```

### 9.3 Get Payment History

```http
GET /payments/my-history
Authorization: Bearer <token>
```

### 9.4 Get Payment Statistics

```http
GET /payments/statistics
Authorization: Bearer <token>
```

## 10. Enrollments

### 10.1 Create Enrollment

```http
POST /enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "amountPaid": 4000,
  "transactionId": "TXN_1704067200000_1_1",
  "studentId": 1,
  "courseId": 1
}
```

### 10.2 Get My Enrollments

```http
GET /enrollments/my
Authorization: Bearer <token>
```

### 10.3 Get Course Leaderboard

```http
GET /enrollments/course/1/leaderboard
Authorization: Bearer <token>
```

**Expected Response:**

```json
[
  {
    "rank": 1,
    "studentId": 2,
    "studentName": "Jane Smith",
    "progress": 95,
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  },
  {
    "rank": 2,
    "studentId": 1,
    "studentName": "John Doe",
    "progress": 85,
    "enrolledAt": "2024-01-01T00:00:00.000Z",
    "status": "active"
  }
]
```

### 10.4 Get My Performance

```http
GET /enrollments/my-performance
Authorization: Bearer <token>
```

### 10.5 Update Progress

```http
PATCH /enrollments/1/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "progress": 75
}
```

### 10.6 Get Motivational Message

```http
GET /enrollments/motivational-message
Authorization: Bearer <token>
```

**Expected Response:**

```json
{
  "message": "🔥 You're making great progress! You're halfway there. Keep pushing forward, and you'll reach your goals."
}
```

### 10.7 Get Enrollment Statistics

```http
GET /enrollments/statistics
Authorization: Bearer <token>
```

## 11. Notifications

### 11.1 Get My Notifications

```http
GET /notifications/my
Authorization: Bearer <token>
```

### 11.2 Get Unread Count

```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

### 11.3 Mark as Read

```http
PATCH /notifications/1/read
Authorization: Bearer <token>
```

### 11.4 Mark All as Read

```http
PATCH /notifications/mark-all-read
Authorization: Bearer <token>
```

### 11.5 Get Notifications by Type

```http
GET /notifications/type/assignment_feedback
Authorization: Bearer <token>
```

## 12. Testing Scenarios

### 12.1 Complete Course Enrollment Flow

1. **Create User Account**

   ```bash
   curl -X POST http://localhost:3001/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","phone":"01712345678","password":"password123"}'
   ```

2. **Login and Get Token**

   ```bash
   curl -X POST http://localhost:3001/users/login \
     -H "Content-Type: application/json" \
     -d '{"phone":"01712345678","password":"password123"}'
   ```

3. **Browse Courses**

   ```bash
   curl -X GET http://localhost:3001/courses \
     -H "Authorization: Bearer <token>"
   ```

4. **Initiate Payment**

   ```bash
   curl -X POST http://localhost:3001/payments/initiate/1 \
     -H "Authorization: Bearer <token>"
   ```

5. **Check Enrollment**
   ```bash
   curl -X GET http://localhost:3001/enrollments/my \
     -H "Authorization: Bearer <token>"
   ```

### 12.2 Assignment Submission Flow

1. **Submit Assignment**

   ```bash
   curl -X POST http://localhost:3001/assignment-submissions \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"description":"Completed assignment","githubLink":"https://github.com/example","assignmentId":1}'
   ```

2. **Check My Submissions**

   ```bash
   curl -X GET http://localhost:3001/assignment-submissions/my \
     -H "Authorization: Bearer <token>"
   ```

3. **Review Submission (Instructor)**

   ```bash
   curl -X POST http://localhost:3001/assignment-submissions/1/review \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"marks":85,"feedback":"Great work!","status":"approved"}'
   ```

4. **Check Notifications**
   ```bash
   curl -X GET http://localhost:3001/notifications/my \
     -H "Authorization: Bearer <token>"
   ```

### 12.3 Course Progress Tracking

1. **Update Progress**

   ```bash
   curl -X PATCH http://localhost:3001/enrollments/1/progress \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"progress":50}'
   ```

2. **Check Leaderboard**

   ```bash
   curl -X GET http://localhost:3001/enrollments/course/1/leaderboard \
     -H "Authorization: Bearer <token>"
   ```

3. **Get Motivational Message**
   ```bash
   curl -X GET http://localhost:3001/enrollments/motivational-message \
     -H "Authorization: Bearer <token>"
   ```

## 13. Error Handling

### 13.1 Authentication Errors

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 13.2 Validation Errors

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "phone should not be empty"],
  "error": "Bad Request"
}
```

### 13.3 Not Found Errors

```json
{
  "statusCode": 404,
  "message": "Course with ID 999 not found"
}
```

### 13.4 Forbidden Errors

```json
{
  "statusCode": 403,
  "message": "You can only update your own submissions"
}
```

## 14. Performance Testing

### 14.1 Load Testing with Apache Bench

```bash
# Test course listing endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer <token>" http://localhost:3001/courses

# Test enrollment creation
ab -n 100 -c 5 -p enrollment.json -T application/json -H "Authorization: Bearer <token>" http://localhost:3001/enrollments
```

### 14.2 Database Query Testing

```bash
# Test leaderboard query performance
curl -X GET http://localhost:3001/enrollments/course/1/leaderboard \
  -H "Authorization: Bearer <token>" \
  -w "Time: %{time_total}s\n"
```

## 15. Security Testing

### 15.1 JWT Token Validation

```bash
# Test with invalid token
curl -X GET http://localhost:3001/courses \
  -H "Authorization: Bearer invalid-token"
```

### 15.2 Authorization Testing

```bash
# Test accessing other user's data
curl -X GET http://localhost:3001/assignment-submissions/999 \
  -H "Authorization: Bearer <token>"
```

### 15.3 Input Validation Testing

```bash
# Test SQL injection prevention
curl -X POST http://localhost:3001/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"'; DROP TABLE users; --"}'
```

## 16. Email Testing

### 16.1 Test Email Templates

```bash
# Trigger assignment feedback email
curl -X POST http://localhost:3001/notifications/assignment-feedback \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"assignmentTitle":"Todo App","marks":85,"feedback":"Great work!","courseName":"React Development"}'
```

### 16.2 Test Payment Success Email

```bash
# Trigger payment success email
curl -X POST http://localhost:3001/notifications/payment-success \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"courseName":"React Development","amount":4000,"transactionId":"TXN_123"}'
```

## 17. Monitoring and Logging

### 17.1 Check Application Logs

```bash
# Monitor application logs
tail -f logs/application.log

# Check error logs
tail -f logs/error.log
```

### 17.2 Database Performance

```bash
# Check slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

## 18. Deployment Testing

### 18.1 Health Check

```bash
curl -X GET http://localhost:3001/health
```

### 18.2 Database Connection

```bash
curl -X GET http://localhost:3001/health/db
```

### 18.3 Environment Variables

```bash
# Verify environment configuration
curl -X GET http://localhost:3001/config
```

## 19. API Documentation

### 19.1 Swagger Documentation

Visit: `http://localhost:3001/api`

### 19.2 Postman Collection

Import the provided Postman collection for easy testing.

## 20. Troubleshooting

### 20.1 Common Issues

1. **CORS Errors**: Check CORS configuration in main.ts
2. **Database Connection**: Verify DATABASE_URL environment variable
3. **Email Sending**: Check email service configuration
4. **File Upload**: Verify file upload directory permissions

### 20.2 Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run start:dev
```

### 20.3 Database Reset

```bash
# Reset database (development only)
npm run migration:reset
npm run migration:run
npm run seed
```

## 21. Statistics & Reports

### 21.1 Get Dashboard Statistics

```http
GET /statistics/dashboard
Authorization: Bearer <token>
```

**Expected Response:**

```json
{
  "earnings": {
    "totalYear": 150000,
    "totalMonth": 25000,
    "totalToday": 5000,
    "totalWeek": 15000,
    "monthly": [
      { "month": "Jan", "total": 12000 },
      { "month": "Feb", "total": 15000 },
      { "month": "Mar", "total": 18000 }
    ],
    "weekly": [
      { "week": "Week 1", "total": 3000 },
      { "week": "Week 2", "total": 4500 }
    ],
    "daily": [
      { "date": "2024-01-15", "total": 500 },
      { "date": "2024-01-16", "total": 750 }
    ]
  },
  "enrollments": {
    "totalPending": 15,
    "statusStats": {
      "active": 150,
      "completed": 75,
      "pending": 15,
      "cancelled": 5,
      "total": 245
    }
  },
  "payments": {
    "totalCancelled": 8,
    "statusStats": {
      "completed": 200,
      "pending": 10,
      "failed": 5,
      "cancelled": 8,
      "total": 223
    }
  },
  "users": {
    "total": 500,
    "totalStudents": 450,
    "totalInstructors": 50
  },
  "courses": {
    "total": 25,
    "totalActive": 20,
    "averageRating": 4.5,
    "topCourses": [
      {
        "courseId": 1,
        "courseName": "React Development",
        "thumbnail": "react-thumb.jpg",
        "enrollmentCount": 150,
        "averageRating": 4.8,
        "reviewCount": 45
      }
    ]
  },
  "recentActivity": {
    "recentEnrollments": [
      {
        "id": 1,
        "status": "active",
        "progress": 25,
        "enrolledAt": "2024-01-15T10:30:00.000Z",
        "student": { "name": "John Doe", "email": "john@example.com" },
        "course": { "name": "React Development" }
      }
    ]
  }
}
```

### 21.2 Get Earnings Report

```http
GET /statistics/earnings-report?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Expected Response:**

```json
{
  "totalEarnings": 25000,
  "totalPayments": 45,
  "payments": [
    {
      "paymentId": 1,
      "amount": "5000.00",
      "status": "success",
      "paidAt": "2024-01-15T10:30:00.000Z",
      "paymentMethod": "sslcommerz",
      "courseName": "React Development",
      "studentName": "John Doe",
      "studentEmail": "john@example.com"
    }
  ],
  "dateRange": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  }
}
```

### 21.3 Get Enrollment Report

```http
GET /statistics/enrollment-report?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Expected Response:**

```json
{
  "totalEnrollments": 60,
  "completedEnrollments": 25,
  "activeEnrollments": 30,
  "completionRate": 41.67,
  "enrollments": [
    {
      "enrollmentId": 1,
      "status": "active",
      "progress": 75,
      "enrolledAt": "2024-01-15T10:30:00.000Z",
      "completedAt": null,
      "courseName": "React Development",
      "studentName": "John Doe",
      "studentEmail": "john@example.com"
    }
  ],
  "dateRange": {
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-31T23:59:59.000Z"
  }
}
```

## 22. Testing Scenarios

### 22.1 Dashboard Statistics Flow

1. **Get Dashboard Statistics**

   ```bash
   curl -X GET http://localhost:3001/statistics/dashboard \
     -H "Authorization: Bearer <token>"
   ```

2. **Get Earnings Report**

   ```bash
   curl -X GET "http://localhost:3001/statistics/earnings-report?startDate=2024-01-01&endDate=2024-01-31" \
     -H "Authorization: Bearer <token>"
   ```

3. **Get Enrollment Report**
   ```bash
   curl -X GET "http://localhost:3001/statistics/enrollment-report?startDate=2024-01-01&endDate=2024-01-31" \
     -H "Authorization: Bearer <token>"
   ```

## 23. Error Handling

### 23.1 Authentication Errors

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 23.2 Validation Errors

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "phone should not be empty"],
  "error": "Bad Request"
}
```

### 23.3 Not Found Errors

```json
{
  "statusCode": 404,
  "message": "Course with ID 999 not found"
}
```

### 23.4 Forbidden Errors

```json
{
  "statusCode": 403,
  "message": "You can only update your own submissions"
}
```

## 24. Performance Testing

### 24.1 Load Testing with Apache Bench

```bash
# Test course listing endpoint
ab -n 1000 -c 10 -H "Authorization: Bearer <token>" http://localhost:3001/courses

# Test enrollment creation
ab -n 100 -c 5 -p enrollment.json -T application/json -H "Authorization: Bearer <token>" http://localhost:3001/enrollments
```

### 24.2 Database Query Testing

```bash
# Test leaderboard query performance
curl -X GET http://localhost:3001/enrollments/course/1/leaderboard \
  -H "Authorization: Bearer <token>" \
  -w "Time: %{time_total}s\n"
```

## 25. Security Testing

### 25.1 JWT Token Validation

```bash
# Test with invalid token
curl -X GET http://localhost:3001/courses \
  -H "Authorization: Bearer invalid-token"
```

### 25.2 Authorization Testing

```bash
# Test accessing other user's data
curl -X GET http://localhost:3001/assignment-submissions/999 \
  -H "Authorization: Bearer <token>"
```

### 25.3 Input Validation Testing

```bash
# Test SQL injection prevention
curl -X POST http://localhost:3001/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"'; DROP TABLE users; --"}'
```

## 26. Email Testing

### 26.1 Test Email Templates

```bash
# Trigger assignment feedback email
curl -X POST http://localhost:3001/notifications/assignment-feedback \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"assignmentTitle":"Todo App","marks":85,"feedback":"Great work!","courseName":"React Development"}'
```

### 26.2 Test Payment Success Email

```bash
# Trigger payment success email
curl -X POST http://localhost:3001/notifications/payment-success \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":1,"courseName":"React Development","amount":4000,"transactionId":"TXN_123"}'
```

## 27. Monitoring and Logging

### 27.1 Check Application Logs

```bash
# Monitor application logs
tail -f logs/application.log

# Check error logs
tail -f logs/error.log
```

### 27.2 Database Performance

```bash
# Check slow queries
SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
```

## 28. Deployment Testing

### 28.1 Health Check

```bash
curl -X GET http://localhost:3001/health
```

### 28.2 Database Connection

```bash
curl -X GET http://localhost:3001/health/db
```

### 28.3 Environment Variables

```bash
# Verify environment configuration
curl -X GET http://localhost:3001/config
```

## 29. API Documentation

### 29.1 Swagger Documentation

Visit: `http://localhost:3001/api`

### 29.2 Postman Collection

Import the provided Postman collection for easy testing.

## 30. Troubleshooting

### 30.1 Common Issues

1. **CORS Errors**: Check CORS configuration in main.ts
2. **Database Connection**: Verify DATABASE_URL environment variable
3. **Email Sending**: Check email service configuration
4. **File Upload**: Verify file upload directory permissions

### 30.2 Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run start:dev
```

### 30.3 Database Reset

```bash
# Reset database (development only)
npm run migration:reset
npm run migration:run
npm run seed
```

This comprehensive testing guide covers all major functionality of the NextByte Learning Management System. Use these examples to verify that all features are working correctly before deployment.
