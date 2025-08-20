# Automatic Certificate Generation Testing Guide

This guide provides step-by-step instructions for testing the automatic certificate generation feature in the NextByte platform.

## Prerequisites

1. **Database Setup**: Ensure the database is running and migrations are applied
2. **User Authentication**: Have valid JWT tokens for testing
3. **Test Data**: Create test users, courses, and enrollments

## Testing Flow

### Step 1: Create Test Data

#### 1.1 Create a Test User

```bash
POST /users/register
Content-Type: application/json

{
  "name": "Test Student",
  "email": "test@example.com",
  "phone": "1234567890",
  "password": "password123"
}
```

#### 1.2 Create a Test Course

```bash
POST /course
Content-Type: application/json
Authorization: Bearer ADMIN_JWT_TOKEN

{
  "name": "Test Course for Certificate",
  "slugName": "test-certificate-course",
  "duration": "4 weeks",
  "price": 1000,
  "whatYouWillLearn": ["Test skill 1", "Test skill 2"],
  "technologies": [{"name": "Test Tech", "image": "test.png"}],
  "requirements": ["Basic knowledge"]
}
```

#### 1.3 Create an Enrollment

```bash
POST /enrollments
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "studentId": 1,
  "courseId": 1,
  "amountPaid": 1000,
  "transactionId": "TEST_TXN_123"
}
```

### Step 2: Test Progress Updates

#### 2.1 Update Progress to 50%

```bash
PATCH /enrollments/1/progress
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "progress": 50
}
```

**Expected Result**:

- Progress updated to 50%
- Status remains "active"
- No certificate generated
- No completion notification

#### 2.2 Update Progress to 100% (Trigger Certificate Generation)

```bash
PATCH /enrollments/1/progress
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "progress": 100
}
```

**Expected Result**:

- Progress updated to 100%
- Status changes to "completed"
- `completedAt` timestamp is set
- Certificate is automatically generated
- Course completion notification is sent
- Certificate generation notification is sent

### Step 3: Verify Certificate Generation

#### 3.1 Check Certificate Creation

```bash
GET /certificate/my-certificates
Authorization: Bearer USER_JWT_TOKEN
```

**Expected Result**:

```json
[
  {
    "id": 1,
    "certificateNumber": "CERT-1703123456789-123",
    "studentName": "Test Student",
    "courseName": "Test Course for Certificate",
    "completionPercentage": 100,
    "issuedDate": "2023-12-21T10:30:00.000Z",
    "isActive": true,
    "student": { ... },
    "course": { ... },
    "enrollment": { ... }
  }
]
```

#### 3.2 Verify Certificate Statistics

```bash
GET /certificate/my-certificates/stats
Authorization: Bearer USER_JWT_TOKEN
```

**Expected Result**:

```json
{
  "totalCertificates": 1,
  "activeCertificates": 1,
  "expiredCertificates": 0,
  "recentCertificates": 1
}
```

#### 3.3 Verify Certificate Verification

```bash
GET /certificate/verify/CERT-1703123456789-123
```

**Expected Result**: Certificate details returned successfully

### Step 4: Test Notifications

#### 4.1 Check User Notifications

```bash
GET /notifications
Authorization: Bearer USER_JWT_TOKEN
```

**Expected Result**: Two new notifications:

1. Course completion notification
2. Certificate generation notification

### Step 5: Test Edge Cases

#### 5.1 Test Duplicate Certificate Prevention

```bash
# Try to update progress to 100% again
PATCH /enrollments/1/progress
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "progress": 100
}
```

**Expected Result**:

- Progress remains 100%
- No duplicate certificate is generated
- No error occurs

#### 5.2 Test Manual Certificate Generation

```bash
POST /certificate/generate
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "enrollmentId": 1
}
```

**Expected Result**: Error message indicating certificate already exists

#### 5.3 Test Incomplete Course

```bash
# Create new enrollment
POST /enrollments
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "studentId": 1,
  "courseId": 1,
  "amountPaid": 1000,
  "transactionId": "TEST_TXN_124"
}

# Try to generate certificate for incomplete course
POST /certificate/generate
Content-Type: application/json
Authorization: Bearer USER_JWT_TOKEN

{
  "enrollmentId": 2
}
```

**Expected Result**: Error message indicating course must be 100% completed

## Testing Checklist

### ✅ Basic Functionality

- [ ] Progress update to 100% triggers certificate generation
- [ ] Certificate is created with unique number
- [ ] Certificate is linked to correct enrollment
- [ ] Certificate data is accurate (student name, course name, etc.)

### ✅ Notifications

- [ ] Course completion notification is sent
- [ ] Certificate generation notification is sent
- [ ] Notifications contain correct information
- [ ] Email notifications are sent (if configured)

### ✅ Error Handling

- [ ] No duplicate certificates are generated
- [ ] Incomplete courses cannot generate certificates
- [ ] System handles certificate generation failures gracefully
- [ ] Progress update succeeds even if certificate generation fails

### ✅ Data Integrity

- [ ] Certificate is properly linked to enrollment
- [ ] Certificate number is unique
- [ ] Certificate includes all required fields
- [ ] Certificate statistics are accurate

### ✅ API Endpoints

- [ ] Certificate can be retrieved via `/my-certificates`
- [ ] Certificate can be verified via `/verify/{number}`
- [ ] Certificate statistics are correct
- [ ] All filtering and sorting options work

## Troubleshooting

### Common Issues

1. **Certificate Not Generated**
   - Check if progress is exactly 100%
   - Verify enrollment status is "completed"
   - Check server logs for errors

2. **Duplicate Certificates**
   - Verify certificate generation logic prevents duplicates
   - Check enrollment ID uniqueness

3. **Notification Issues**
   - Verify notification service is properly configured
   - Check email service configuration
   - Review notification entity relationships

4. **Database Issues**
   - Ensure all required tables exist
   - Check foreign key relationships
   - Verify entity configurations

### Debug Commands

```bash
# Check enrollment status
GET /enrollments/1

# Check all certificates for user
GET /certificate/my-certificates

# Check notifications
GET /notifications

# Verify specific certificate
GET /certificate/verify/CERT-NUMBER
```

## Performance Testing

### Load Testing

- Test with multiple concurrent course completions
- Verify certificate generation performance
- Check notification delivery under load

### Data Volume Testing

- Test with large numbers of enrollments
- Verify certificate retrieval performance
- Check statistics calculation performance

## Security Testing

- Verify only authenticated users can trigger certificate generation
- Test certificate verification security
- Ensure proper access controls on certificate endpoints
