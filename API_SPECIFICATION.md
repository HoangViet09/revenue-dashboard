# Revenue Dashboard API Specification

## Overview

This document outlines the API requirements for the Revenue Dashboard backend integration. The frontend expects specific endpoints and data structures to display revenue trends, comparisons, and analytics.

## Base URL

```
http://localhost:3001/api
```

## Authentication

All API endpoints require authentication. Include the following header:

```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Get Current Week Data

**Endpoint:** `GET /api/revenue/current-week`

**Description:** Retrieves revenue data for the current week (Monday to Sunday).

**Response:**

```json
{
  "success": true,
  "data": {
    "weekStart": "2024-01-15",
    "weekEnd": "2024-01-21",
    "dailyData": [
      {
        "date": "2024-01-15",
        "dayOfWeek": "Mon",
        "posRevenue": 1700,
        "eatclubRevenue": 300,
        "labourCosts": 600,
        "covers": 120,
        "events": [
          {
            "type": "negative",
            "impact": -15,
            "description": "Weather impact"
          }
        ]
      }
      // ... 6 more days
    ],
    "summary": {
      "totalRevenue": 16177,
      "averagePerDay": 2311,
      "totalCovers": 904
    }
  },
  "message": "Current week data retrieved successfully"
}
```

### 2. Get Previous Week Data

**Endpoint:** `GET /api/revenue/previous-week`

**Description:** Retrieves revenue data for the previous week (Monday to Sunday).

**Response:** Same structure as current week endpoint.

### 3. Get Combined Dashboard Data

**Endpoint:** `GET /api/revenue/dashboard`

**Description:** Retrieves both current and previous week data in a single request.

**Response:**

```json
{
  "success": true,
  "data": {
    "currentWeek": {
      // Current week data structure
    },
    "previousWeek": {
      // Previous week data structure
    }
  },
  "message": "Dashboard data retrieved successfully"
}
```

### 4. Get Revenue Data by Date Range

**Endpoint:** `GET /api/revenue/range`

**Description:** Retrieves revenue data for a custom date range.

**Query Parameters:**

- `startDate` (required): Start date in YYYY-MM-DD format
- `endDate` (required): End date in YYYY-MM-DD format

**Response:** Same structure as current week endpoint.

## Data Models

### DailyRevenueData

```typescript
interface DailyRevenueData {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: string; // Mon, Tue, Wed, etc.
  posRevenue: number; // Point of Sale revenue
  eatclubRevenue: number; // Eatclub platform revenue
  labourCosts: number; // Labor costs
  covers: number; // Number of customers served
  events?: EventImpact[]; // Optional event impacts
}
```

### EventImpact

```typescript
interface EventImpact {
  type: "positive" | "negative";
  impact: number; // Impact percentage or amount
  description?: string; // Optional description
}
```

### WeeklySummary

```typescript
interface WeeklySummary {
  totalRevenue: number; // Sum of all revenue
  averagePerDay: number; // Average daily revenue
  totalCovers: number; // Sum of all covers
}
```

### WeekData

```typescript
interface WeekData {
  weekStart: string; // ISO date string for Monday
  weekEnd: string; // ISO date string for Sunday
  dailyData: DailyRevenueData[];
  summary: WeeklySummary;
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid date format",
  "message": "Date must be in YYYY-MM-DD format"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Not Found",
  "message": "No data found for the specified period"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Database Schema Requirements

### Revenue Table

```sql
CREATE TABLE revenue_data (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  pos_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  eatclub_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  labour_costs DECIMAL(10,2) NOT NULL DEFAULT 0,
  covers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Events Table

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('positive', 'negative')),
  impact DECIMAL(5,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Notes

### 1. Date Handling

- All dates should be in UTC
- Week starts on Monday and ends on Sunday
- Use ISO 8601 format (YYYY-MM-DD) for date strings

### 2. Currency Formatting

- All monetary values should be in cents (integer) or with 2 decimal places
- Frontend will handle currency formatting and display

### 3. Performance Considerations

- Implement caching for frequently accessed data
- Use database indexes on date columns
- Consider pagination for large date ranges

### 4. Data Validation

- Validate date ranges (start date must be before end date)
- Ensure revenue values are non-negative
- Validate event impact types

### 5. Security

- Implement rate limiting
- Validate and sanitize all input parameters
- Use prepared statements to prevent SQL injection

## Example Backend Implementation (Node.js/Express)

```javascript
// routes/revenue.js
const express = require("express");
const router = express.Router();

// Get current week data
router.get("/current-week", async (req, res) => {
  try {
    const currentWeek = getCurrentWeekDates();
    const data = await getRevenueDataByDateRange(
      currentWeek.start,
      currentWeek.end
    );

    res.json({
      success: true,
      data: formatWeekData(data),
      message: "Current week data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// Get previous week data
router.get("/previous-week", async (req, res) => {
  try {
    const previousWeek = getPreviousWeekDates();
    const data = await getRevenueDataByDateRange(
      previousWeek.start,
      previousWeek.end
    );

    res.json({
      success: true,
      data: formatWeekData(data),
      message: "Previous week data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// Get combined dashboard data
router.get("/dashboard", async (req, res) => {
  try {
    const [currentWeek, previousWeek] = await Promise.all([
      getCurrentWeekData(),
      getPreviousWeekData(),
    ]);

    res.json({
      success: true,
      data: {
        currentWeek,
        previousWeek,
      },
      message: "Dashboard data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

module.exports = router;
```

## Testing

### Test Cases

1. **Valid current week request** - Should return 200 with current week data
2. **Valid previous week request** - Should return 200 with previous week data
3. **Invalid date range** - Should return 400 with error message
4. **Unauthorized request** - Should return 401
5. **Server error** - Should return 500 with error message

### Sample Test Data

```json
{
  "currentWeek": {
    "weekStart": "2024-01-15",
    "weekEnd": "2024-01-21",
    "dailyData": [
      {
        "date": "2024-01-15",
        "dayOfWeek": "Mon",
        "posRevenue": 1700,
        "eatclubRevenue": 300,
        "labourCosts": 600,
        "covers": 120
      }
      // ... more days
    ],
    "summary": {
      "totalRevenue": 16177,
      "averagePerDay": 2311,
      "totalCovers": 904
    }
  }
}
```

## Deployment Considerations

1. **Environment Variables**

   - Database connection strings
   - JWT secret keys
   - API rate limiting configuration

2. **Monitoring**

   - API response times
   - Error rates
   - Database query performance

3. **Scaling**
   - Database connection pooling
   - Redis caching for frequently accessed data
   - Load balancing for multiple instances
