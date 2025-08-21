# Enrollment Payment System Guide

## Overview

The enrollment system integrates SSL Commerz payment gateway for secure online payments. Users can enroll in courses through a complete payment flow.

## Payment Flow

### 1. Initiate Payment

**Endpoint:** `POST /enrollments/payment/initiate`

**Request:**

```json
{
  "amount": 5000,
  "transactionId": "TXN_20240115_001",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "01712345678",
  "customerAddress": "Dhaka, Bangladesh",
  "courseId": 1,
  "studentId": 1
}
```

**Response:**

```json
{
  "enrollmentId": 1,
  "sessionKey": "SSL123456789",
  "gatewayUrl": "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
  "status": "initiated"
}
```

### 2. Payment Success Callback

**Endpoint:** `POST /enrollments/payment/success`

**Query Parameters:**

- `tran_id`: Transaction ID
- `val_id`: Validation ID
- `bank_tran_id`: Bank Transaction ID

**Response:** Redirects to success page

### 3. Payment Failure Callback

**Endpoint:** `POST /enrollments/payment/fail`

**Query Parameters:**

- `tran_id`: Transaction ID
- `error`: Error message

**Response:** Redirects to failure page

### 4. Payment Cancellation Callback

**Endpoint:** `POST /enrollments/payment/cancel`

**Query Parameters:**

- `tran_id`: Transaction ID

**Response:** Redirects to cancellation page

### 5. IPN (Instant Payment Notification)

**Endpoint:** `POST /enrollments/payment/ipn`

**Request Body:**

```json
{
  "tran_id": "TXN_20240115_001",
  "val_id": "240115123456789",
  "bank_tran_id": "240115123456789",
  "status": "VALID",
  "card_type": "VISA",
  "card_issuer": "BRAC Bank",
  "card_brand": "VISA",
  "amount": 5000,
  "currency": "BDT"
}
```

**Response:**

```json
{
  "status": "success"
}
```

## Enrollment Management

### Create Direct Enrollment

**Endpoint:** `POST /enrollments`

**Request:**

```json
{
  "amountPaid": 5000,
  "transactionId": "TXN_20240115_001",
  "paymentMethod": "sslcommerz",
  "studentId": 1,
  "courseId": 1
}
```

**Response:**

```json
{
  "id": 1,
  "amountPaid": 5000,
  "transactionId": "TXN_20240115_001",
  "status": "active",
  "paymentStatus": "success",
  "paymentMethod": "sslcommerz",
  "enrolledAt": "2024-01-15T10:30:00Z",
  "paidAt": "2024-01-15T10:30:00Z",
  "student": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "studentId": "NEXTBYTE-000001"
  },
  "course": {
    "id": 1,
    "name": "Web Development",
    "instructor": {
      "name": "Jane Smith"
    }
  }
}
```

### Get My Enrollments

**Endpoint:** `GET /enrollments/my`

**Response:**

```json
[
  {
    "id": 1,
    "amountPaid": 5000,
    "status": "active",
    "progress": 75,
    "paymentStatus": "success",
    "paymentMethod": "sslcommerz",
    "enrolledAt": "2024-01-15T10:30:00Z",
    "paidAt": "2024-01-15T10:30:00Z",
    "course": {
      "id": 1,
      "name": "Web Development",
      "instructor": {
        "name": "Jane Smith"
      }
    }
  }
]
```

### Get Payment History

**Endpoint:** `GET /enrollments/my-payment-history`

**Response:**

```json
[
  {
    "id": 1,
    "amountPaid": 5000,
    "paymentStatus": "success",
    "paymentMethod": "sslcommerz",
    "paidAt": "2024-01-15T10:30:00Z",
    "sslcommerzTranId": "TXN_20240115_001",
    "sslcommerzValId": "240115123456789",
    "sslcommerzBankTranId": "240115123456789",
    "sslcommerzCardType": "VISA",
    "sslcommerzCardIssuer": "BRAC Bank",
    "sslcommerzCardBrand": "VISA",
    "course": {
      "name": "Web Development"
    }
  }
]
```

## Complete Payment Flow Example

### Step 1: User initiates payment

```javascript
// Frontend code
const paymentData = {
  amount: 5000,
  transactionId: `TXN_${Date.now()}`,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '01712345678',
  customerAddress: 'Dhaka, Bangladesh',
  courseId: 1,
  studentId: 1,
};

const response = await fetch('/api/enrollments/payment/initiate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(paymentData),
});

const result = await response.json();
// Redirect to SSL Commerz gateway
window.location.href = result.gatewayUrl;
```

### Step 2: SSL Commerz processes payment

- User completes payment on SSL Commerz gateway
- SSL Commerz redirects to success/fail/cancel URL
- IPN is sent to server for verification

### Step 3: Payment success

```javascript
// Backend processes success callback
// Updates enrollment status to ACTIVE
// Sends welcome email
// Creates notifications
```

## Error Handling

### Payment Initiation Errors

```json
{
  "statusCode": 400,
  "message": "Bad request - validation failed",
  "error": "Bad Request"
}
```

### Enrollment Already Exists

```json
{
  "statusCode": 403,
  "message": "Student is already enrolled in this course",
  "error": "Forbidden"
}
```

### Course Not Found

```json
{
  "statusCode": 404,
  "message": "Course with ID 999 not found",
  "error": "Not Found"
}
```

## Environment Variables

```env
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

## Payment Status Flow

1. **PENDING** - Payment initiated, waiting for completion
2. **SUCCESS** - Payment completed successfully
3. **FAILED** - Payment failed or cancelled
4. **CANCELLED** - Payment cancelled by user

## Enrollment Status Flow

1. **PENDING** - Enrollment created, payment pending
2. **ACTIVE** - Payment successful, enrollment active
3. **COMPLETED** - Course completed
4. **CANCELLED** - Enrollment cancelled

## Security Features

- JWT authentication required for all endpoints
- SSL Commerz IPN verification
- Unique transaction IDs
- Payment status tracking
- Audit trail for all transactions

## Important Notes

1. **JWT Guard is commented out** in the controller - authentication may not be enforced
2. **Payment flow creates pending enrollment** first, then updates on success
3. **Welcome emails are sent** automatically on successful enrollment
4. **Notifications are created** for enrollment events
5. **SSL Commerz sandbox URL** is used for testing
