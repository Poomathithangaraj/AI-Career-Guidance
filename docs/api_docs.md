# REST API Documentation

Detailed parameters for the endpoints exposed by the AI Career Guidance Agent Backend.

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates user login and empty profile.
- **Request Body:**
  ```json
  {
    "email": "candidate@email.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "email": "candidate@email.com",
    "is_admin": false,
    "created_at": "2026-07-04T14:35:00"
  }
  ```

### `POST /api/auth/login`
Validates credentials and responds with JWT token.
- **Request Body:**
  ```json
  {
    "email": "candidate@email.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer"
  }
  ```

---

## 2. Profile Endpoints

### `GET /api/profile`
Fetch current logged-in user profile.
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "id": 1,
    "user_id": 1,
    "full_name": "Candidate Name",
    "phone": "9876543210",
    "age": 21,
    "gender": "Female",
    "college": "Stanford University",
    "department": "Computer Science",
    "qualification": "B.Tech",
    "cgpa": 9.20,
    "current_skills": "Python, React, SQL",
    "interests": "Machine Learning, Analytics",
    "strengths": "Problem Solving",
    "weaknesses": "Public Speaking",
    "preferred_career": "AI Engineer",
    "preferred_location": "California",
    "updated_at": "2026-07-04T14:40:00"
  }
  ```

---

## 3. Assessment & Recommendations Endpoints

### `GET /api/assessment/questions`
Fetch all 50 MCQ questions.
- **Headers:** `Authorization: Bearer <token>`

### `POST /api/assessment/submit`
Saves answers and triggers career evaluation recommendations.
- **Request Body:**
  ```json
  [
    { "question_id": 1, "selected_option": "B" },
    { "question_id": 2, "selected_option": "C" }
  ]
  ```

### `GET /api/recommendations`
Fetch top 5 recommendations.
- **Headers:** `Authorization: Bearer <token>`

---

## 4. Resume & Reporting Endpoints

### `POST /api/resume`
Analyze uploaded PDF resume template.
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Request Parameters:** `file: UploadFile`

### `GET /api/report`
Downloads generated Report PDF.
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Binary Stream (application/pdf)
