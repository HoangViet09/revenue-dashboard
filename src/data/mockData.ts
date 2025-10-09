/**
 * Mock data for Revenue Dashboard
 * Simulates API responses for current and previous week data
 */

import { WeekData, EventImpact } from "@/lib/types";

// Helper function to create date strings
const createDateString = (daysFromToday: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0];
};

// Mock event impacts
const mockEvents: EventImpact[] = [
  { type: "negative", impact: -15, description: "Weather impact" },
  { type: "positive", impact: 25, description: "Special promotion" },
];

// Current week data (this week)
export const currentWeekData: WeekData = {
  weekStart: createDateString(-6), // Monday
  weekEnd: createDateString(0), // Sunday
  dailyData: [
    {
      date: createDateString(-6), // Monday
      dayOfWeek: "Mon",
      posRevenue: 1700,
      eatclubRevenue: 300,
      labourCosts: 600,
      covers: 120,
    },
    {
      date: createDateString(-5), // Tuesday
      dayOfWeek: "Tue",
      posRevenue: 1700,
      eatclubRevenue: 300,
      labourCosts: 600,
      covers: 125,
    },
    {
      date: createDateString(-4), // Wednesday
      dayOfWeek: "Wed",
      posRevenue: 1700,
      eatclubRevenue: 300,
      labourCosts: 800,
      covers: 115,
    },
    {
      date: createDateString(-3), // Thursday
      dayOfWeek: "Thu",
      posRevenue: 1800,
      eatclubRevenue: 300,
      labourCosts: 700,
      covers: 130,
    },
    {
      date: createDateString(-2), // Friday
      dayOfWeek: "Fri",
      posRevenue: 1700,
      eatclubRevenue: 300,
      labourCosts: 600,
      covers: 118,
      events: [mockEvents[0]], // Negative event
    },
    {
      date: createDateString(-1), // Saturday
      dayOfWeek: "Sat",
      posRevenue: 2200,
      eatclubRevenue: 400,
      labourCosts: 800,
      covers: 150,
      events: [mockEvents[1]], // Positive event
    },
    {
      date: createDateString(0), // Sunday
      dayOfWeek: "Sun",
      posRevenue: 2300,
      eatclubRevenue: 400,
      labourCosts: 1100,
      covers: 160,
    },
  ],
  summary: {
    totalRevenue: 16177, // Sum of all revenue
    averagePerDay: 2311, // Average daily revenue
    totalCovers: 904, // Sum of all covers
  },
};

// Previous week data (last week)
export const previousWeekData: WeekData = {
  weekStart: createDateString(-13), // Monday of previous week
  weekEnd: createDateString(-7), // Sunday of previous week
  dailyData: [
    {
      date: createDateString(-13), // Monday
      dayOfWeek: "Mon",
      posRevenue: 1600,
      eatclubRevenue: 280,
      labourCosts: 580,
      covers: 110,
    },
    {
      date: createDateString(-12), // Tuesday
      dayOfWeek: "Tue",
      posRevenue: 1650,
      eatclubRevenue: 290,
      labourCosts: 590,
      covers: 115,
    },
    {
      date: createDateString(-11), // Wednesday
      dayOfWeek: "Wed",
      posRevenue: 1550,
      eatclubRevenue: 270,
      labourCosts: 750,
      covers: 105,
    },
    {
      date: createDateString(-10), // Thursday
      dayOfWeek: "Thu",
      posRevenue: 1700,
      eatclubRevenue: 300,
      labourCosts: 680,
      covers: 125,
    },
    {
      date: createDateString(-9), // Friday
      dayOfWeek: "Fri",
      posRevenue: 1600,
      eatclubRevenue: 280,
      labourCosts: 580,
      covers: 112,
    },
    {
      date: createDateString(-8), // Saturday
      dayOfWeek: "Sat",
      posRevenue: 2000,
      eatclubRevenue: 350,
      labourCosts: 750,
      covers: 140,
    },
    {
      date: createDateString(-7), // Sunday
      dayOfWeek: "Sun",
      posRevenue: 2100,
      eatclubRevenue: 360,
      labourCosts: 1000,
      covers: 145,
    },
  ],
  summary: {
    totalRevenue: 15544, // Sum of all revenue
    averagePerDay: 2221, // Average daily revenue
    totalCovers: 852, // Sum of all covers
  },
};

// Calculate comparison percentages
export const getComparisonData = () => {
  const current = currentWeekData.summary;
  const previous = previousWeekData.summary;

  return {
    totalRevenue: {
      current: current.totalRevenue,
      previous: previous.totalRevenue,
      changePercent:
        ((current.totalRevenue - previous.totalRevenue) /
          previous.totalRevenue) *
        100,
    },
    averagePerDay: {
      current: current.averagePerDay,
      previous: previous.averagePerDay,
      changePercent:
        ((current.averagePerDay - previous.averagePerDay) /
          previous.averagePerDay) *
        100,
    },
    totalCovers: {
      current: current.totalCovers,
      previous: previous.totalCovers,
      changePercent:
        ((current.totalCovers - previous.totalCovers) / previous.totalCovers) *
        100,
    },
  };
};

// Mock API delay function
export const mockApiDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock API functions
export const fetchCurrentWeekData = async (): Promise<WeekData> => {
  await mockApiDelay();
  return currentWeekData;
};

export const fetchPreviousWeekData = async (): Promise<WeekData> => {
  await mockApiDelay();
  return previousWeekData;
};

export const fetchDashboardData = async () => {
  await mockApiDelay();
  return {
    currentWeek: currentWeekData,
    previousWeek: previousWeekData,
  };
};
