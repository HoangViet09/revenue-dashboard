/**
 * TypeScript interfaces for Revenue Dashboard
 * Defines data structures for API responses and component props
 */

// Event impact types for chart indicators
export type EventImpactType = "positive" | "negative";

// Event data structure
export interface EventImpact {
  type: EventImpactType;
  impact: number; // Impact percentage or amount
  description?: string;
}

// Daily revenue data structure
export interface DailyRevenueData {
  date: string; // ISO date string (YYYY-MM-DD)
  dayOfWeek: string; // Mon, Tue, Wed, etc.
  posRevenue: number; // Point of Sale revenue
  eatclubRevenue: number; // Eatclub platform revenue
  labourCosts: number; // Labor costs
  covers: number; // Number of customers served
  events?: EventImpact[]; // Optional event impacts for the day
}

// Weekly summary data for KPI cards
export interface WeeklySummary {
  totalRevenue: number;
  averagePerDay: number;
  totalCovers: number;
  previousWeekComparison?: {
    totalRevenue: number;
    averagePerDay: number;
    totalCovers: number;
    revenueChangePercent: number;
    averageChangePercent: number;
    coversChangePercent: number;
  };
}

// Complete week data structure
export interface WeekData {
  weekStart: string; // ISO date string for Monday
  weekEnd: string; // ISO date string for Sunday
  dailyData: DailyRevenueData[];
  summary: WeeklySummary;
}

// Filter options for chart display
export interface ChartFilters {
  showPosRevenue: boolean;
  showEatclubRevenue: boolean;
  showLabourCosts: boolean;
}

// Chart configuration options
export interface ChartConfig {
  showComparison: boolean; // Toggle for previous week comparison
  filters: ChartFilters;
}

// API response structure for current week
export interface CurrentWeekResponse {
  success: boolean;
  data: WeekData;
  message?: string;
}

// API response structure for previous week
export interface PreviousWeekResponse {
  success: boolean;
  data: WeekData;
  message?: string;
}

// Combined API response for dashboard
export interface DashboardDataResponse {
  success: boolean;
  data: {
    currentWeek: WeekData;
    previousWeek: WeekData;
  };
  message?: string;
}

// Component props interfaces
export interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
  format?: "currency" | "number";
}

export interface ChartLegendItem {
  label: string;
  color: string;
  icon?: string;
}

// Chart data structure for Recharts
export interface ChartDataPoint {
  day: string;
  posRevenue: number;
  eatclubRevenue: number;
  labourCosts: number;
  posRevenuePrevious?: number;
  eatclubRevenuePrevious?: number;
  labourCostsPrevious?: number;
  events?: EventImpact[];
}

