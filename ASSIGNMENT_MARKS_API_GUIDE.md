# Assignment Marks API Guide

This guide explains the new assignment marks endpoints that provide data for creating graphs and leaderboards based on student performance.

## Overview

The enrollment leaderboard has been updated to rank students by their average assignment marks instead of course progress. Additionally, new endpoints provide detailed assignment marks data for creating various types of graphs and analytics.

## Updated Leaderboard Ranking

The course leaderboard now ranks students by:

1. **Average Assignment Marks** (descending) - Primary ranking factor
2. **Number of Assignments Completed** (descending) - Secondary ranking factor

## API Endpoints

### 1. Course Leaderboard (Updated)

**GET** `/enrollments/course/:courseId/leaderboard`

Returns students ranked by average assignment marks.

**Response:**

```json
[
  {
    "rank": 1,
    "studentId": 1,
    "studentName": "John Doe",
    "averageMarks": 85.5,
    "assignmentCount": 5,
    "totalMarks": 427,
    "progress": 80,
    "enrolledAt": "2024-01-15T10:00:00Z",
    "completedAt": null,
    "status": "active"
  }
]
```

### 2. Course Assignment Marks Data

**GET** `/enrollments/course/:courseId/assignment-marks`

Returns comprehensive assignment marks data for the entire course, suitable for creating various graphs.

**Response:**

```json
{
  "courseId": 1,
  "assignmentData": [
    {
      "assignmentId": 1,
      "assignmentTitle": "Introduction to JavaScript",
      "totalMarks": 100,
      "submissions": [
        {
          "studentId": 1,
          "studentName": "John Doe",
          "marks": 85,
          "percentage": 85
        }
      ],
      "averageMarks": 82,
      "highestMarks": 95,
      "lowestMarks": 65,
      "submissionCount": 15
    }
  ],
  "studentData": [
    {
      "studentId": 1,
      "studentName": "John Doe",
      "assignments": [
        {
          "assignmentId": 1,
          "assignmentTitle": "Introduction to JavaScript",
          "marks": 85,
          "totalMarks": 100,
          "percentage": 85
        }
      ],
      "totalMarks": 425,
      "averageMarks": 85,
      "assignmentCount": 5
    }
  ],
  "summary": {
    "totalAssignments": 8,
    "totalStudents": 25,
    "totalSubmissions": 150,
    "overallAverageMarks": 78
  }
}
```

### 3. Individual Student Assignment Marks

**GET** `/enrollments/course/:courseId/student/:studentId/assignment-marks`

Returns detailed assignment marks data for a specific student.

**Response:**

```json
{
  "studentId": 1,
  "courseId": 1,
  "assignmentMarks": [
    {
      "assignmentId": 1,
      "assignmentTitle": "Introduction to JavaScript",
      "marks": 85,
      "totalMarks": 100,
      "percentage": 85,
      "submittedAt": "2024-01-20T14:30:00Z"
    }
  ],
  "summary": {
    "totalAssignments": 5,
    "totalMarks": 425,
    "averageMarks": 85,
    "averagePercentage": 85,
    "highestMarks": 95,
    "lowestMarks": 75
  }
}
```

### 4. Current User Assignment Marks

**GET** `/enrollments/course/:courseId/my-assignment-marks`

Returns the current user's assignment marks data for a specific course.

**Response:** Same as individual student endpoint.

## Graph Implementation Examples

### 1. Leaderboard Bar Chart

```javascript
// Using the leaderboard endpoint
const leaderboardData = await fetch('/enrollments/course/1/leaderboard');
const data = await leaderboardData.json();

// Chart.js example
const ctx = document.getElementById('leaderboardChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: data.map((item) => item.studentName),
    datasets: [
      {
        label: 'Average Marks',
        data: data.map((item) => item.averageMarks),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
});
```

### 2. Assignment Performance Line Chart

```javascript
// Using individual student endpoint
const studentData = await fetch(
  '/enrollments/course/1/student/1/assignment-marks',
);
const data = await studentData.json();

// Chart.js example
const ctx = document.getElementById('performanceChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: data.assignmentMarks.map((item) => item.assignmentTitle),
    datasets: [
      {
        label: 'Marks (%)',
        data: data.assignmentMarks.map((item) => item.percentage),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
});
```

### 3. Course-wide Assignment Comparison

```javascript
// Using course assignment marks endpoint
const courseData = await fetch('/enrollments/course/1/assignment-marks');
const data = await courseData.json();

// Chart.js example
const ctx = document
  .getElementById('assignmentComparisonChart')
  .getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: data.assignmentData.map((item) => item.assignmentTitle),
    datasets: [
      {
        label: 'Average Marks',
        data: data.assignmentData.map((item) => item.averageMarks),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
      },
      {
        label: 'Highest Marks',
        data: data.assignmentData.map((item) => item.highestMarks),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
});
```

### 4. Student Performance Radar Chart

```javascript
// Using individual student endpoint
const studentData = await fetch(
  '/enrollments/course/1/student/1/assignment-marks',
);
const data = await studentData.json();

// Chart.js example
const ctx = document.getElementById('radarChart').getContext('2d');
new Chart(ctx, {
  type: 'radar',
  data: {
    labels: data.assignmentMarks.map((item) => item.assignmentTitle),
    datasets: [
      {
        label: 'Performance (%)',
        data: data.assignmentMarks.map((item) => item.percentage),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
      },
    ],
  },
  options: {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  },
});
```

## Data Structure for Different Graph Types

### Bar Charts

- **Leaderboard**: Student names vs Average marks
- **Assignment Comparison**: Assignment titles vs Average/Highest/Lowest marks
- **Student Count**: Assignment titles vs Number of submissions

### Line Charts

- **Progress Over Time**: Assignment submission dates vs Marks
- **Performance Trend**: Assignment sequence vs Marks

### Pie Charts

- **Grade Distribution**: Grade ranges vs Number of students
- **Assignment Completion**: Completed vs Pending assignments

### Radar Charts

- **Student Skills**: Assignment types vs Performance
- **Course Coverage**: Different topics vs Average performance

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `404`: Course or student not found
- `401`: Unauthorized (missing or invalid token)
- `500`: Server error

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

Consider implementing rate limiting for these endpoints as they involve complex database queries.

## Performance Considerations

- The assignment marks data endpoints use optimized queries with proper joins
- Consider caching results for frequently accessed data
- For large datasets, consider implementing pagination
- Use database indexes on frequently queried columns (student_id, course_id, marks)
