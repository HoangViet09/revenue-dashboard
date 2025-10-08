# Revenue Dashboard API Specification

## Overview

This document outlines the API requirements for the Revenue Dashboard backend integration. The frontend expects specific endpoints and data structures to display revenue trends, comparisons, and analytics.

## Base URL

```
http://localhost:3001/api
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
