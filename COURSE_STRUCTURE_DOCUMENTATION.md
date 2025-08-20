# NextByte Learning Management System - Course Structure Documentation

## Overview

This document outlines the comprehensive course structure and entities for the NextByte Learning Management Platform, including assignment management, payment integration, and notification system.

## Entity Structure

### 1. Category Entity

**File:** `src/categoris/entities/categoris.entity.ts`

**Fields:**

- `id` (Primary Key)
- `name` (Unique)
- `description` (Optional)
- `imageUrl` (Optional)
- `isActive` (Boolean, default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- One-to-Many with Course

### 2. Course Entity

**File:** `src/course/entities/course.entity.ts`

**Fields:**

- `id` (Primary Key)
- `name` (String)
- `slugName` (Unique String)
- `duration` (String)
- `price` (Decimal)
- `discountPrice` (Decimal, Optional)
- `totalJoin` (Integer, default: 0)
- `totalSeat` (Integer, default: 0)
- `whatYouWillLearn` (Array of Strings)
- `technologies` (JSON Array: `{name, image}`)
- `requirements` (Array of Strings)
- `promoVideoUrl` (String, Optional)
- `courseVideosUrl` (Array of Strings, Optional)
- `thumbnail` (String, Optional)
- `assignments` (JSON Array: `{moduleName, githubLink, liveLink}`)
- `isActive` (Boolean, default: true)
- `isPublished` (Boolean, default: false)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with Category
- Many-to-One with Admin (Instructor)
- Many-to-Many with User (Students)
- One-to-Many with Review
- One-to-Many with Module
- One-to-Many with Enrollment

### 3. Module Entity

**File:** `src/module/entities/module.entity.ts`

**Fields:**

- `id` (Primary Key)
- `title` (String)
- `description` (Text, Optional)
- `order` (Integer, default: 1)
- `duration` (String, Optional)
- `isActive` (Boolean, default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with Course
- One-to-Many with Lesson
- One-to-Many with Assignment

### 4. Lesson Entity

**File:** `src/lessons/entities/lesson.entity.ts`

**Fields:**

- `id` (Primary Key)
- `title` (String)
- `description` (Text, Optional)
- `order` (Integer, default: 1)
- `duration` (String, Optional)
- `videoUrl` (String, Optional)
- `thumbnail` (String, Optional)
- `isPreview` (Boolean, default: false)
- `isActive` (Boolean, default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with Module

### 5. Assignment Entity

**File:** `src/assignment/entities/assignment.entity.ts`

**Fields:**

- `id` (Primary Key)
- `title` (String)
- `description` (Text, Optional)
- `githubLink` (String, Optional)
- `liveLink` (String, Optional)
- `totalMarks` (Integer, default: 100)
- `dueDate` (Timestamp, Optional)
- `isActive` (Boolean, default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with Module
- One-to-Many with AssignmentSubmission

### 6. AssignmentSubmission Entity

**File:** `src/assignment-submissions/entities/assignment-submission.entity.ts`

**Fields:**

- `id` (Primary Key)
- `description` (Text, Optional)
- `githubLink` (String, Optional)
- `liveLink` (String, Optional)
- `fileUrl` (String, Optional)
- `marks` (Integer, Optional)
- `feedback` (Text, Optional)
- `status` (Enum: PENDING, REVIEWED, APPROVED, REJECTED)
- `reviewedAt` (Timestamp, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with User (Student)
- Many-to-One with Assignment

### 7. Review Entity

**File:** `src/review/entities/review.entity.ts`

**Fields:**

- `id` (Primary Key)
- `rating` (Integer)
- `comment` (Text, Optional)
- `isActive` (Boolean, default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with User
- Many-to-One with Course

### 8. Enrollment Entity

**File:** `src/enrollment/entities/enrollment.entity.ts`

**Fields:**

- `id` (Primary Key)
- `amountPaid` (Decimal)
- `transactionId` (String, Optional)
- `status` (Enum: PENDING, ACTIVE, COMPLETED, CANCELLED)
- `enrolledAt` (Timestamp, Optional)
- `completedAt` (Timestamp, Optional)
- `progress` (Integer, default: 0) - Percentage of course completion
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with User (Student)
- Many-to-One with Course
- One-to-One with Payment

### 9. Payment Entity

**File:** `src/payment/entities/payment.entity.ts`

**Fields:**

- `id` (Primary Key)
- `amount` (Decimal)
- `transactionId` (Unique String)
- `status` (Enum: PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED)
- `paymentMethod` (Enum: SSLCOMMERZ, BANK_TRANSFER, CASH)
- `sslcommerzSessionKey` (String, Optional)
- `sslcommerzTranId` (String, Optional)
- `sslcommerzValId` (String, Optional)
- `sslcommerzBankTranId` (String, Optional)
- `sslcommerzCardType` (String, Optional)
- `sslcommerzCardIssuer` (String, Optional)
- `sslcommerzCardBrand` (String, Optional)
- `sslcommerzError` (String, Optional)
- `sslcommerzResponse` (JSON, Optional)
- `paidAt` (Timestamp, Optional)
- `failedAt` (Timestamp, Optional)
- `failureReason` (Text, Optional)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with User
- Many-to-One with Course

### 10. Notification Entity

**File:** `src/notification/entities/notification.entity.ts`

**Fields:**

- `id` (Primary Key)
- `title` (String)
- `message` (Text)
- `type` (Enum: ASSIGNMENT_FEEDBACK, ASSIGNMENT_SUBMITTED, COURSE_ENROLLMENT, COURSE_COMPLETED, PAYMENT_SUCCESS, PAYMENT_FAILED, GENERAL)
- `status` (Enum: UNREAD, READ, ARCHIVED)
- `metadata` (JSON, Optional)
- `isEmailSent` (Boolean, default: false)
- `emailSentAt` (Timestamp, Optional)
- `isActive` (Boolean, default: true)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

**Relationships:**

- Many-to-One with User (Recipient)

## API Endpoints

### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create a category
- `GET /categories/:id` - Get category by ID
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Courses

- `GET /courses` - Get all courses
- `POST /courses` - Create a course
- `GET /courses/:id` - Get course by ID
- `PATCH /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `GET /courses/category/:categoryId` - Get courses by category
- `GET /courses/instructor/:instructorId` - Get courses by instructor
- `POST /courses/:id/enroll` - Enroll student in course
- `GET /courses/statistics` - Get course statistics

### Modules

- `GET /modules` - Get all modules
- `POST /modules` - Create a module
- `GET /modules/:id` - Get module by ID
- `PATCH /modules/:id` - Update module
- `DELETE /modules/:id` - Delete module
- `GET /modules/course/:courseId` - Get modules by course

### Lessons

- `GET /lessons` - Get all lessons
- `POST /lessons` - Create a lesson
- `GET /lessons/:id` - Get lesson by ID
- `PATCH /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Delete lesson
- `GET /lessons/module/:moduleId` - Get lessons by module

### Assignments

- `GET /assignments` - Get all assignments
- `POST /assignments` - Create an assignment
- `GET /assignments/:id` - Get assignment by ID
- `PATCH /assignments/:id` - Update assignment
- `DELETE /assignments/:id` - Delete assignment
- `GET /assignments/module/:moduleId` - Get assignments by module

### Assignment Submissions

- `GET /assignment-submissions` - Get all submissions
- `POST /assignment-submissions` - Submit an assignment
- `GET /assignment-submissions/my` - Get my submissions
- `GET /assignment-submissions/:id` - Get submission by ID
- `PATCH /assignment-submissions/:id` - Update submission
- `DELETE /assignment-submissions/:id` - Delete submission
- `GET /assignment-submissions/assignment/:assignmentId` - Get submissions by assignment
- `POST /assignment-submissions/:id/review` - Review submission (Instructor)
- `GET /assignment-submissions/my-performance` - Get my performance statistics

### Reviews

- `GET /reviews` - Get all reviews
- `POST /reviews` - Create a review
- `GET /reviews/:id` - Get review by ID
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review
- `GET /reviews/course/:courseId` - Get reviews by course

### Enrollments

- `GET /enrollments` - Get all enrollments
- `POST /enrollments` - Create an enrollment
- `GET /enrollments/:id` - Get enrollment by ID
- `PATCH /enrollments/:id` - Update enrollment
- `DELETE /enrollments/:id` - Delete enrollment
- `GET /enrollments/student/:studentId` - Get enrollments by student
- `GET /enrollments/course/:courseId` - Get enrollments by course

### Payments

- `GET /payments` - Get all payments
- `POST /payments` - Create a payment
- `GET /payments/my` - Get my payments
- `GET /payments/:id` - Get payment by ID
- `PATCH /payments/:id` - Update payment
- `DELETE /payments/:id` - Delete payment
- `GET /payments/course/:courseId` - Get payments by course
- `GET /payments/statistics` - Get payment statistics
- `GET /payments/my-history` - Get my payment history

#### SSLCommerz Integration

- `POST /payments/initiate/:courseId` - Initiate payment
- `POST /payments/success` - Handle payment success
- `POST /payments/fail` - Handle payment failure
- `POST /payments/ipn` - Handle IPN (Instant Payment Notification)

### Notifications

- `GET /notifications` - Get all notifications
- `POST /notifications` - Create a notification
- `GET /notifications/my` - Get my notifications
- `GET /notifications/:id` - Get notification by ID
- `PATCH /notifications/:id` - Update notification
- `DELETE /notifications/:id` - Delete notification
- `GET /notifications/unread-count` - Get unread count
- `GET /notifications/type/:type` - Get notifications by type
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/mark-all-read` - Mark all as read

#### Specific Notification Endpoints

- `POST /notifications/assignment-feedback` - Create assignment feedback notification
- `POST /notifications/assignment-submitted` - Create assignment submitted notification
- `POST /notifications/course-enrollment` - Create course enrollment notification
- `POST /notifications/course-completed` - Create course completed notification
- `POST /notifications/payment-success` - Create payment success notification
- `POST /notifications/payment-failed` - Create payment failed notification
- `POST /notifications/new-module-upload` - Create new module upload notification
- `POST /notifications/general` - Create general notification

## Key Features

### 1. Course Structure

- **Hierarchical Organization:** Course → Module → Lesson
- **Assignment System:** Each module has one assignment
- **Student Progress Tracking:** Percentage-based completion tracking
- **Instructor Management:** Admin users can create and manage courses

### 2. Assignment System

- **Submission Management:** Students can submit assignments with GitHub links, live links, and files
- **Review Process:** Instructors can review submissions and provide feedback
- **Status Tracking:** PENDING → REVIEWED → APPROVED/REJECTED
- **Performance Analytics:** Track student performance with statistics

### 3. Payment Integration

- **SSLCommerz Gateway:** Full integration with SSLCommerz payment gateway
- **Payment Tracking:** Complete payment history and status tracking
- **Transaction Management:** Unique transaction IDs and detailed payment records
- **Success/Failure Handling:** Automatic notification system for payment events

### 4. Notification System

- **Email Integration:** Automatic email notifications for all events
- **Multiple Types:** Assignment feedback, payment status, course updates, etc.
- **Status Management:** Read/Unread status tracking
- **Rich Content:** HTML email templates with action buttons

### 5. Student Features

- **Progress Tracking:** Real-time course completion percentage
- **Assignment Performance:** Detailed performance analytics and graphs
- **Payment History:** Complete payment records and statistics
- **Notification Center:** Centralized notification management

### 6. Instructor Features

- **Course Management:** Create, update, and manage courses
- **Assignment Review:** Review and grade student submissions
- **Student Analytics:** Track student performance and progress
- **Content Management:** Upload videos, lessons, and assignments

## Data Flow

### 1. Course Enrollment Flow

1. Student browses courses
2. Student initiates payment via SSLCommerz
3. Payment success triggers enrollment creation
4. Notification sent to student
5. Student gains access to course content

### 2. Assignment Submission Flow

1. Student submits assignment
2. System creates submission record
3. Notification sent to instructor
4. Instructor reviews submission
5. Feedback and marks provided
6. Notification sent to student with results

### 3. Payment Processing Flow

1. Student initiates payment
2. SSLCommerz payment gateway processes
3. Success/Failure callback received
4. Payment record updated
5. Notification sent to student
6. Enrollment status updated (if successful)

## Security Features

### 1. Authentication

- JWT-based authentication for all protected endpoints
- Role-based access control (Student, Instructor, Admin)

### 2. Authorization

- Students can only access their own submissions and payments
- Instructors can only manage their own courses
- Admins have full system access

### 3. Data Validation

- Comprehensive DTO validation using class-validator
- Input sanitization and type checking
- SQL injection prevention via TypeORM

## Performance Features

### 1. Database Optimization

- Proper indexing on frequently queried fields
- Relationship loading optimization
- Query optimization with TypeORM

### 2. Caching Strategy

- Entity relationship caching
- Query result caching for static data
- Session-based caching for user data

### 3. Scalability

- Modular architecture for easy scaling
- Separate services for different functionalities
- Database connection pooling

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# SSLCommerz Configuration
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_GATEWAY_URL=https://sandbox.sslcommerz.com/gwprocess/v4/api.php

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Getting Started

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create a `.env` file with the required variables

3. **Run Database Migrations:**

   ```bash
   npm run migration:run
   ```

4. **Start the Application:**

   ```bash
   npm run start:dev
   ```

5. **Access API Documentation:**
   Visit `http://localhost:3001/api` for Swagger documentation

## Testing

The system includes comprehensive test coverage for:

- Entity relationships and constraints
- Service business logic
- Controller endpoint functionality
- Payment gateway integration
- Notification system

Run tests with:

```bash
npm run test
npm run test:e2e
```

## Deployment

The application is designed for deployment on:

- **Cloud Platforms:** AWS, Azure, Google Cloud
- **Container Platforms:** Docker, Kubernetes
- **Serverless:** AWS Lambda, Vercel

## Support

For technical support or questions about the course structure, please refer to:

- API Documentation: `/api` endpoint
- Database Schema: Entity files in `src/*/entities/`
- Service Logic: Service files in `src/*/services/`
- Controller Endpoints: Controller files in `src/*/controllers/`
