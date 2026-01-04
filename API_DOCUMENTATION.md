# ECWA Divine Path - Complete API Documentation

**Base URL:** `https://your-api-domain.com/api`  
**Authentication:** All protected endpoints require `apiToken` header

---

## Table of Contents
1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [User Profile](#user-profile)
4. [Hymns](#hymns)
5. [Sunday School Manuals](#sunday-school-manuals)
6. [Quiz](#quiz)
7. [Bible](#bible)
8. [Payments](#payments)

---

## Authentication

### 1. Login with Email & Password
**POST** `/user/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "api_token": "abc123xyz...",
  "created_at": "2025-01-01T00:00:00Z",
  "appUser": {
    "id": 1,
    "user_id": 1,
    "dcc": "Lagos DCC",
    "lcb": "Ikeja LCB",
    "language": "English",
    "mobile": "+2341234567890",
    "has_latest_updates": 1
  }
}
```

**Errors:**
- `401`: Invalid credentials
- `404`: User not found

---

### 2. Send Login Code (Email Only)
**POST** `/user/login/send-code`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification code sent to your email"
}
```

**Errors:**
- `404`: User not found
- `429`: Too many requests

---

### 3. Verify Login Code
**POST** `/user/login/verify`

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "api_token": "abc123xyz...",
  "appUser": { ... }
}
```

**Errors:**
- `400`: Invalid or expired code
- `404`: User not found

---

### 4. Register New User
**POST** `/user/create`

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword123",
  "dcc": "Lagos DCC",
  "lcb": "Ikeja LCB",
  "language": "English"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "api_token": "abc123xyz...",
  "appUser": {
    "id": 1,
    "user_id": 1,
    "dcc": "Lagos DCC",
    "lcb": "Ikeja LCB",
    "language": "English"
  }
}
```

**Errors:**
- `400`: Validation error
- `409`: Email already exists

---

### 5. Forgot Password - Send Code
**POST** `/user/send-reset-code`

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset code sent to your email"
}
```

---

### 6. Reset Password
**POST** `/user/reset-password`

**Request:**
```json
{
  "email": "user@example.com",
  "code": "123456",
  "password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

### 7. Get Authenticated User
**GET** `/auth-user/`  
**Auth:** Required

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "api_token": "abc123xyz...",
  "appUser": { ... }
}
```

---

### 8. Logout
**POST** `/user/logout`  
**Auth:** Required

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

## Dashboard

### Get Dashboard Data
**GET** `/user/dashboard`  
**Auth:** Required

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "subscription": {
      "hasAccess": true,
      "plan": "annual",
      "expiresAt": "2025-12-31"
    }
  },
  "verseOfWeek": {
    "id": 1,
    "reference": "1 Timothy 6:10",
    "text": "For the love of money is the root of all evil: which while some coveted after, they have erred from the faith, and pierced themselves through with many sorrows.",
    "weekNumber": 46,
    "year": 2025
  },
  "currentLesson": {
    "id": 123,
    "number": 46,
    "topic": "LOVE OF MONEY: AN END TIME CANKERWORM",
    "texts": "2 Timothy 3:1–5, 1 Timothy 6:6–10",
    "intro": "The love of money is one of the most dangerous spiritual diseases affecting believers today...",
    "weekNumber": 46,
    "year": 2025
  },
  "hymnOfWeek": {
    "id": 234,
    "number": 234,
    "title": "Take My Life and Let It Be",
    "language": "English"
  },
  "nextLesson": {
    "id": 124,
    "number": 47,
    "topic": "THE POWER OF FORGIVENESS",
    "texts": "Matthew 18:21-35"
  }
}
```

**Backend Logic:**
- Auto-rotate `verseOfWeek`, `currentLesson`, `hymnOfWeek` based on current week number
- Check user subscription status from payments table

---

## User Profile

### 1. Get Profile
**GET** `/user/profile`  
**Auth:** Required

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "user@example.com",
  "mobile": "+2341234567890",
  "dcc": "Lagos DCC",
  "lcb": "Ikeja LCB",
  "language": "English",
  "avatar_url": "https://...",
  "created_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. Update Profile
**PUT** `/user/profile`  
**Auth:** Required

**Request:**
```json
{
  "name": "John Doe Updated",
  "mobile": "+2341234567890",
  "dcc": "New DCC",
  "lcb": "New LCB",
  "language": "Yoruba"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### 3. Update Password
**PUT** `/user/profile/password`  
**Auth:** Required

**Request:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

---

### 4. Upload Avatar
**POST** `/user/profile/avatar`  
**Auth:** Required  
**Content-Type:** `multipart/form-data`

**Request:**
```
avatar: [image file]
```

**Response (200):**
```json
{
  "avatar_url": "https://storage.example.com/avatars/user_1.jpg"
}
```

---

## Hymns

### 1. Get All Hymns
**GET** `/hymns`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `language` | string | Filter by language (English, Yoruba) |
| `search` | string | Search by title or number |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 50) |

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "number": 1,
      "title": "All Hail the Power of Jesus' Name",
      "language": "English",
      "first_line": "All hail the power of Jesus' name..."
    },
    {
      "id": 2,
      "number": 2,
      "title": "Amazing Grace",
      "language": "English",
      "first_line": "Amazing grace, how sweet the sound..."
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 50,
    "totalPages": 10
  }
}
```

---

### 2. Get Single Hymn
**GET** `/hymns/:id`

**Response (200):**
```json
{
  "id": 234,
  "number": 234,
  "title": "Take My Life and Let It Be",
  "language": "English",
  "author": "Frances Ridley Havergal",
  "year": 1874,
  "verses": [
    {
      "number": 1,
      "text": "Take my life and let it be\nConsecrated, Lord, to Thee;\nTake my moments and my days,\nLet them flow in ceaseless praise."
    },
    {
      "number": 2,
      "text": "Take my hands and let them move\nAt the impulse of Thy love;\nTake my feet and let them be\nSwift and beautiful for Thee."
    }
  ],
  "chorus": "Take my life and let it be\nConsecrated, Lord, to Thee.",
  "tune": "HENDON",
  "meter": "7.7.7.7"
}
```

---

## Sunday School Manuals

### 1. Get Manual Types
**GET** `/manuals/types`

**Response (200):**
```json
{
  "types": [
    {
      "id": "sunday-school",
      "name": "Sunday School",
      "description": "Weekly Sunday School lessons"
    },
    {
      "id": "bible-study",
      "name": "Bible Study",
      "description": "Mid-week Bible study materials"
    },
    {
      "id": "youth-fellowship",
      "name": "Youth Fellowship",
      "description": "Youth fellowship study guides"
    }
  ]
}
```

---

### 2. Get Available Years
**GET** `/manuals/:type/years`

**Example:** `/manuals/sunday-school/years`

**Response (200):**
```json
{
  "years": [2025, 2024, 2023, 2022, 2021]
}
```

---

### 3. Get Available Languages
**GET** `/manuals/:type/:year/languages`

**Example:** `/manuals/sunday-school/2025/languages`

**Response (200):**
```json
{
  "languages": [
    { "code": "en", "name": "English" },
    { "code": "yo", "name": "Yoruba" },
    { "code": "ha", "name": "Hausa" }
  ]
}
```

---

### 4. Get Lessons List
**GET** `/manuals/:type/:year/:language/lessons`  
**Auth:** Required (checks subscription)

**Example:** `/manuals/sunday-school/2025/en/lessons`

**Response (200):**
```json
{
  "lessons": [
    {
      "id": 1,
      "number": 1,
      "topic": "THE BEGINNING OF ALL THINGS",
      "texts": "Genesis 1:1-31",
      "date": "2025-01-05",
      "quarter": 1
    },
    {
      "id": 2,
      "number": 2,
      "topic": "THE CREATION OF MAN",
      "texts": "Genesis 2:1-25",
      "date": "2025-01-12",
      "quarter": 1
    }
  ],
  "quarters": [
    { "number": 1, "name": "First Quarter", "months": "Jan-Mar" },
    { "number": 2, "name": "Second Quarter", "months": "Apr-Jun" },
    { "number": 3, "name": "Third Quarter", "months": "Jul-Sep" },
    { "number": 4, "name": "Fourth Quarter", "months": "Oct-Dec" }
  ]
}
```

---

### 5. Get Single Lesson
**GET** `/manuals/:type/:year/:language/lessons/:lessonId`  
**Auth:** Required (checks subscription)

**Response (200):**
```json
{
  "id": 46,
  "number": 46,
  "topic": "LOVE OF MONEY: AN END TIME CANKERWORM",
  "texts": "2 Timothy 3:1–5, 1 Timothy 6:6–10",
  "date": "2025-11-16",
  "quarter": 4,
  "memoryVerse": {
    "reference": "1 Timothy 6:10",
    "text": "For the love of money is the root of all evil..."
  },
  "introduction": "The love of money is one of the most dangerous spiritual diseases affecting believers today...",
  "lessonOutline": [
    {
      "title": "1. THE NATURE OF MONEY LOVE",
      "points": [
        "Money itself is not evil",
        "The love of money is the problem",
        "It leads to spiritual destruction"
      ],
      "scriptures": ["1 Timothy 6:6-8"]
    },
    {
      "title": "2. THE DANGERS OF MONEY LOVE",
      "points": [
        "It causes people to err from faith",
        "It brings many sorrows",
        "It leads to spiritual blindness"
      ],
      "scriptures": ["1 Timothy 6:9-10"]
    }
  ],
  "conclusion": "We must guard our hearts against the love of money...",
  "practicalApplication": [
    "Examine your heart's attitude toward money",
    "Practice contentment in all circumstances",
    "Give generously to God's work"
  ],
  "discussionQuestions": [
    "What is the difference between using money and loving money?",
    "How can we recognize the love of money in our lives?",
    "What practical steps can we take to avoid this trap?"
  ]
}
```

---

## Quiz

### 1. Get Quiz Types
**GET** `/quiz/types`

**Response (200):**
```json
{
  "types": [
    { "id": "sunday-school", "name": "Sunday School Quiz" },
    { "id": "bible-study", "name": "Bible Study Quiz" }
  ]
}
```

---

### 2. Get Quiz Years
**GET** `/quiz/:type/years`

**Response (200):**
```json
{
  "years": [2025, 2024, 2023]
}
```

---

### 3. Get Quiz Lessons
**GET** `/quiz/:type/:year/lessons`

**Response (200):**
```json
{
  "lessons": [
    {
      "id": 1,
      "number": 1,
      "topic": "THE BEGINNING OF ALL THINGS",
      "questionCount": 10,
      "completed": true,
      "bestScore": 8
    },
    {
      "id": 2,
      "number": 2,
      "topic": "THE CREATION OF MAN",
      "questionCount": 10,
      "completed": false,
      "bestScore": null
    }
  ]
}
```

---

### 4. Get Quiz Questions
**GET** `/quiz/:type/:year/lessons/:lessonId/questions`  
**Auth:** Required

**Response (200):**
```json
{
  "lesson": {
    "id": 1,
    "number": 1,
    "topic": "THE BEGINNING OF ALL THINGS"
  },
  "questions": [
    {
      "id": 1,
      "number": 1,
      "question": "What was created on the first day?",
      "options": [
        { "id": "a", "text": "Light" },
        { "id": "b", "text": "Animals" },
        { "id": "c", "text": "Man" },
        { "id": "d", "text": "Plants" }
      ]
    },
    {
      "id": 2,
      "number": 2,
      "question": "How many days did God take to create the world?",
      "options": [
        { "id": "a", "text": "5 days" },
        { "id": "b", "text": "6 days" },
        { "id": "c", "text": "7 days" },
        { "id": "d", "text": "10 days" }
      ]
    }
  ],
  "timeLimit": 600
}
```

---

### 5. Submit Quiz Answers
**POST** `/quiz/:type/:year/lessons/:lessonId/submit`  
**Auth:** Required

**Request:**
```json
{
  "answers": [
    { "questionId": 1, "selectedOption": "a" },
    { "questionId": 2, "selectedOption": "b" }
  ],
  "timeTaken": 245
}
```

**Response (200):**
```json
{
  "attemptId": 123,
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "passed": true,
  "passingScore": 70,
  "results": [
    {
      "questionId": 1,
      "correct": true,
      "correctAnswer": "a",
      "selectedAnswer": "a"
    },
    {
      "questionId": 2,
      "correct": true,
      "correctAnswer": "b",
      "selectedAnswer": "b"
    }
  ]
}
```

---

### 6. Get Quiz History
**GET** `/quiz/history`  
**Auth:** Required

**Response (200):**
```json
{
  "history": [
    {
      "attemptId": 123,
      "lessonNumber": 1,
      "lessonTopic": "THE BEGINNING OF ALL THINGS",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "passed": true,
      "completedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### 7. Get Quiz Result Details
**GET** `/quiz/results/:attemptId`  
**Auth:** Required

**Response (200):**
```json
{
  "attemptId": 123,
  "lesson": {
    "number": 1,
    "topic": "THE BEGINNING OF ALL THINGS"
  },
  "score": 8,
  "totalQuestions": 10,
  "percentage": 80,
  "timeTaken": 245,
  "completedAt": "2025-01-15T10:30:00Z",
  "results": [
    {
      "questionId": 1,
      "question": "What was created on the first day?",
      "correct": true,
      "correctAnswer": "Light",
      "selectedAnswer": "Light",
      "explanation": "Genesis 1:3-5 tells us that God created light on the first day."
    }
  ]
}
```

---

## Bible

### 1. Get Bible Books
**GET** `/bible/books`

**Response (200):**
```json
{
  "oldTestament": [
    { "id": "gen", "name": "Genesis", "chapters": 50 },
    { "id": "exo", "name": "Exodus", "chapters": 40 },
    { "id": "lev", "name": "Leviticus", "chapters": 27 }
  ],
  "newTestament": [
    { "id": "mat", "name": "Matthew", "chapters": 28 },
    { "id": "mar", "name": "Mark", "chapters": 16 },
    { "id": "luk", "name": "Luke", "chapters": 24 }
  ]
}
```

---

### 2. Get Book Chapters
**GET** `/bible/:book/chapters`

**Example:** `/bible/gen/chapters`

**Response (200):**
```json
{
  "book": {
    "id": "gen",
    "name": "Genesis"
  },
  "chapters": [1, 2, 3, 4, 5, ..., 50]
}
```

---

### 3. Get Chapter Content
**GET** `/bible/:book/:chapter`

**Example:** `/bible/gen/1`

**Response (200):**
```json
{
  "book": {
    "id": "gen",
    "name": "Genesis"
  },
  "chapter": 1,
  "verses": [
    { "number": 1, "text": "In the beginning God created the heaven and the earth." },
    { "number": 2, "text": "And the earth was without form, and void; and darkness was upon the face of the deep." }
  ],
  "totalVerses": 31
}
```

---

### 4. Search Bible
**GET** `/bible/search`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (required) |
| `book` | string | Filter by book (optional) |
| `testament` | string | "old" or "new" (optional) |

**Response (200):**
```json
{
  "query": "love",
  "results": [
    {
      "book": "John",
      "chapter": 3,
      "verse": 16,
      "text": "For God so loved the world, that he gave his only begotten Son...",
      "reference": "John 3:16"
    }
  ],
  "totalResults": 150
}
```

---

## Payments

### 1. Get Subscription Plans
**GET** `/payments/plans`

**Response (200):**
```json
{
  "plans": [
    {
      "id": "monthly",
      "name": "Monthly Access",
      "price": 500,
      "currency": "NGN",
      "duration": 30,
      "features": [
        "Access to all Sunday School lessons",
        "Quiz participation",
        "Weekly updates"
      ]
    },
    {
      "id": "annual",
      "name": "Annual Access",
      "price": 5000,
      "currency": "NGN",
      "duration": 365,
      "features": [
        "Access to all Sunday School lessons",
        "Quiz participation",
        "Weekly updates",
        "2 months free"
      ],
      "discount": "17% off"
    }
  ]
}
```

---

### 2. Initialize Payment
**POST** `/payments/initialize`  
**Auth:** Required

**Request:**
```json
{
  "planId": "annual",
  "paymentMethod": "paystack"
}
```

**Response (200):**
```json
{
  "reference": "PAY_abc123xyz",
  "authorizationUrl": "https://paystack.com/pay/abc123",
  "accessCode": "abc123xyz"
}
```

---

### 3. Verify Payment
**POST** `/payments/verify`  
**Auth:** Required

**Request:**
```json
{
  "reference": "PAY_abc123xyz"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Payment verified successfully",
  "subscription": {
    "plan": "annual",
    "startDate": "2025-01-15",
    "expiresAt": "2026-01-15",
    "hasAccess": true
  }
}
```

---

### 4. Get Payment History
**GET** `/payments/history`  
**Auth:** Required

**Response (200):**
```json
{
  "payments": [
    {
      "id": 1,
      "reference": "PAY_abc123xyz",
      "plan": "Annual Access",
      "amount": 5000,
      "currency": "NGN",
      "status": "success",
      "paidAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### 5. Get Current Subscription
**GET** `/payments/subscription`  
**Auth:** Required

**Response (200):**
```json
{
  "hasAccess": true,
  "plan": "annual",
  "startDate": "2025-01-15",
  "expiresAt": "2026-01-15",
  "daysRemaining": 365,
  "autoRenew": false
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "error": true,
  "message": "Human readable error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

**Common Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | No permission (subscription required) |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `SUBSCRIPTION_REQUIRED` | 403 | User needs active subscription |

---

## Authentication Header

All authenticated endpoints require:

```
Headers:
  apiToken: <user_api_token>
  Content-Type: application/json
```

---

## Notes for Backend Implementation

1. **Week-based content rotation**: Dashboard content should auto-rotate based on `WEEK_OF_YEAR(current_date)`
2. **Subscription checks**: Lessons and quiz endpoints must verify user has active subscription
3. **Rate limiting**: Implement rate limiting on auth endpoints (5 requests/minute)
4. **Pagination**: Use cursor-based pagination for large lists
5. **Caching**: Cache hymns, bible content, and lesson lists (they change infrequently)
