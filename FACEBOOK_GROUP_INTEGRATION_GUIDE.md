# Facebook Group Integration Guide

## Overview

This guide explains the new Facebook group integration feature that allows course instructors to provide Facebook group links for their courses. When students enroll in a course, they automatically receive a welcome email containing the Facebook group link and other important instructions.

## Features Added

### 1. Course Entity Enhancement

- Added `facebookGroupLink` field to the Course entity
- Field is optional and can store Facebook group URLs
- Maximum length: 500 characters
- Validation: Must be a valid URL format

### 2. Welcome Email System

- Automatic welcome email sent when students enroll successfully
- Email includes:
  - Course details (name, instructor, duration, price)
  - Facebook group link (if provided)
  - Getting started instructions
  - Direct link to course dashboard

### 3. Email Template Features

- Professional HTML email template
- Responsive design for mobile devices
- Facebook group section with prominent call-to-action button
- Step-by-step instructions for new students
- Course-specific information

## Database Changes

### Migration Required

Run the following SQL migration to add the Facebook group link column:

```sql
-- Add facebookGroupLink column to courses table
ALTER TABLE courses ADD COLUMN facebookGroupLink VARCHAR(500) NULL;

-- Add comment to document the column purpose
COMMENT ON COLUMN courses.facebookGroupLink IS 'Facebook group link for course community and student support';
```

## API Endpoints

### Course Management

- **POST** `/courses` - Create course with Facebook group link
- **PUT** `/courses/:id` - Update course including Facebook group link
- **GET** `/courses/:id` - Retrieve course details including Facebook group link

### Request/Response Examples

#### Create Course with Facebook Group Link

```json
{
  "name": "Complete Web Development Course",
  "slugName": "web-development-2024",
  "duration": "6 months",
  "price": 15000,
  "facebookGroupLink": "https://www.facebook.com/groups/webdev2024",
  "whatYouWillLearn": ["HTML", "CSS", "JavaScript"],
  "technologies": [
    {
      "name": "React",
      "image": "react-logo.png"
    }
  ],
  "requirements": ["Basic computer knowledge"],
  "categoryId": 1,
  "instructorId": 1
}
```

#### Course Response with Facebook Group Link

```json
{
  "id": 1,
  "name": "Complete Web Development Course",
  "facebookGroupLink": "https://www.facebook.com/groups/webdev2024",
  "instructor": {
    "id": 1,
    "name": "John Doe"
  },
  "duration": "6 months",
  "price": 15000
}
```

## Email Template Details

### Welcome Email Content

The welcome email includes:

1. **Header Section**
   - NextByte logo and branding
   - Welcome message

2. **Course Information**
   - Course name and instructor
   - Duration and price
   - Enrollment date

3. **Facebook Group Section** (if link provided)
   - Prominent call-to-action button
   - Explanation of group benefits
   - Direct link to join

4. **Getting Started Instructions**
   - Access course dashboard
   - Watch video lessons
   - Complete assignments
   - Join discussions
   - Track progress
   - Get support

5. **Action Buttons**
   - "Start Learning Now" button
   - "Join Facebook Group" button (if applicable)

## Implementation Details

### Files Modified

1. **`src/course/entities/course.entity.ts`**
   - Added `facebookGroupLink` field

2. **`src/course/dto/create-course.dto.ts`**
   - Added validation for Facebook group link

3. **`src/course/dto/update-course.dto.ts`**
   - Added validation for Facebook group link updates

4. **`src/admin/email.service.ts`**
   - Added `sendEnrollmentWelcomeEmail` method

5. **`src/enrollment/enrollment.service.ts`**
   - Integrated welcome email sending
   - Added EmailService dependency

6. **`src/enrollment/enrollment.module.ts`**
   - Added EmailService to providers

### Error Handling

- Email sending failures don't affect enrollment process
- Graceful fallback if Facebook group link is not provided
- Proper null checks and validation

## Usage Instructions

### For Instructors

1. When creating or updating a course, include the Facebook group link
2. Ensure the Facebook group is set up and accessible
3. The link will automatically be included in student welcome emails

### For Students

1. Upon successful enrollment, students receive a welcome email
2. Email contains the Facebook group link and joining instructions
3. Students can click the link to join the course community

### For Administrators

1. Monitor Facebook group links in course management
2. Ensure links are valid and accessible
3. Review email templates and customize if needed

## Testing

### Test Scenarios

1. **Course Creation with Facebook Link**
   - Create course with valid Facebook group URL
   - Verify link is saved correctly

2. **Course Creation without Facebook Link**
   - Create course without Facebook group URL
   - Verify enrollment still works

3. **Welcome Email Testing**
   - Enroll a student in a course with Facebook link
   - Verify welcome email is sent with correct information
   - Test email template rendering

4. **Invalid Facebook Link**
   - Test with invalid URL format
   - Verify validation errors

## Security Considerations

1. **URL Validation**
   - Facebook group links are validated as URLs
   - Maximum length prevents overly long URLs

2. **Email Security**
   - Links open in new tabs (`target="_blank"`)
   - No sensitive information in email content

3. **Access Control**
   - Only enrolled students receive Facebook group links
   - Links are course-specific

## Future Enhancements

1. **Analytics**
   - Track Facebook group link clicks
   - Monitor student engagement

2. **Multiple Social Platforms**
   - Support for Discord, Telegram, etc.
   - Platform-specific templates

3. **Automated Group Management**
   - Auto-invite students to Facebook groups
   - Group moderation tools

## Support

For technical support or questions about this feature:

- Check the API documentation
- Review email templates in the codebase
- Contact the development team

## Changelog

### Version 1.0.0 (2024-12-19)

- Initial implementation of Facebook group integration
- Added welcome email system
- Database migration for Facebook group link column
- Complete API support for course management
