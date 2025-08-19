<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NextByte API

A comprehensive backend API with OTP-based authentication, JWT tokens, and file upload capabilities.

## Features

- **OTP-based Authentication**: Phone number verification with 4-digit OTP
- **JWT Token Management**: 215-day token validity
- **File Upload**: Support for images and videos (up to 50MB)
- **User Management**: Complete user profile with academic information
- **Protected Routes**: JWT-based route protection

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# SMS Service Configuration (BulkSMS BD)
BULKSMS_API_KEY=your_bulksms_api_key_here

# Server Configuration
PORT=5000
```

## Installation

```bash
npm install
npm run start:dev
```

## API Endpoints

### Authentication

#### 1. Login/Register

```http
POST /auth/login
Content-Type: application/json

{
  "phone": "+8801234567890"
}
```

**Response:**

```json
{
  "message": "OTP sent successfully",
  "phone": "+8801234567890"
}
```

#### 2. Verify OTP

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "phone": "+8801234567890",
  "otp": "1234"
}
```

**Response:**

```json
{
  "message": "OTP verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "phone": "+8801234567890",
    "name": null,
    "email": null,
    "isVerified": true
  }
}
```

#### 3. Resend OTP

```http
POST /auth/resend-otp
Content-Type: application/json

{
  "phone": "+8801234567890"
}
```

**Response:**

```json
{
  "message": "New OTP sent successfully",
  "phone": "+8801234567890"
}
```

#### 4. Update Profile

```http
PUT /auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "address": "Dhaka, Bangladesh",
  "age": 25,
  "instituteName": "University of Dhaka",
  "semester": "8th",
  "subject": "Computer Science"
}
```

### CDN File Upload

#### 1. Upload Any File (Public)

```http
POST /cdn/upload
Content-Type: multipart/form-data

file: [image or video file]
```

#### 2. Upload Image Only (Public)

```http
POST /cdn/upload/image
Content-Type: multipart/form-data

file: [image file]
```

#### 3. Upload Video Only (Public)

```http
POST /cdn/upload/video
Content-Type: multipart/form-data

file: [video file]
```

#### 4. Upload Any File (Protected)

```http
POST /cdn/upload/secure
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: [image or video file]
```

#### 5. Upload Image Only (Protected)

```http
POST /cdn/upload/secure/image
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: [image file]
```

#### 6. Upload Video Only (Protected)

```http
POST /cdn/upload/secure/video
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: [video file]
```

**Response for all CDN endpoints:**

```json
{
  "message": "File uploaded successfully",
  "fileUrl": "/uploads/abc123.jpg",
  "filename": "abc123.jpg",
  "originalName": "photo.jpg",
  "size": 1048576,
  "mimetype": "image/jpeg"
}
```

### Profile Photo Upload

#### Upload Profile Photo

```http
POST /auth/profile-photo
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: [image file]
```

**Response:**

```json
{
  "message": "Profile photo uploaded successfully",
  "fileUrl": "/uploads/abc123.jpg",
  "filename": "abc123.jpg"
}
```

### User Management

#### 1. Get User Profile

```http
GET /users/profile
Authorization: Bearer <jwt_token>
```

#### 2. Get All Users

```http
GET /users
Authorization: Bearer <jwt_token>
```

#### 3. Get User by ID

```http
GET /users/:id
Authorization: Bearer <jwt_token>
```

#### 4. Update User

```http
PATCH /users/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### 5. Delete User

```http
DELETE /users/:id
Authorization: Bearer <jwt_token>
```

## Authentication Flow

1. **User enters phone number** → `POST /auth/login`
2. **System checks if user exists** → Creates new user if not found
3. **Generate 4-digit OTP** → Stored with 5-minute expiry
4. **Send OTP via SMS** → Using BulkSMS BD service
5. **User submits OTP** → `POST /auth/verify-otp`
6. **Verify OTP** → Check validity and expiry
7. **Generate JWT token** → 215-day validity
8. **Return token** → User can access protected routes

## CDN File Upload Specifications

- **Supported Image Types**: JPEG, PNG, GIF, WebP
- **Supported Video Types**: MP4, AVI, MOV, WMV, FLV
- **Maximum File Size**: 50MB
- **Storage Location**: `./uploads/` directory
- **File Naming**: UUID-based unique names
- **Access URL**: `http://localhost:5000/uploads/filename`
- **Public Endpoints**: No authentication required
- **Secure Endpoints**: JWT authentication required
- **Separate Module**: Can be used across all APIs

## Protected Routes

All routes except authentication endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## User Entity Fields

- `id`: Primary key
- `name`: User's full name
- `email`: Email address (unique)
- `phone`: Phone number (unique, required)
- `photoUrl`: Profile photo URL
- `address`: User's address
- `age`: User's age
- `instituteName`: Educational institute name
- `semester`: Current semester
- `subject`: Field of study
- `isVerified`: OTP verification status
- `lastOtp`: Last generated OTP
- `otpExpiry`: OTP expiry timestamp
- `createdAt`: Account creation date
- `updatedAt`: Last update date

## Development Notes

- OTP is logged to console in development mode
- SMS service requires BulkSMS BD API key
- JWT secret should be changed in production
- Database synchronization is enabled for development
