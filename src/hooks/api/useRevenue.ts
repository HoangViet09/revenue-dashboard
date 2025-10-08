/**
 * Revenue API hooks using React Query
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios";
import { queryKeys, queryUtils } from "@/lib/react-query";
import { WeekData, DailyRevenueData } from "@/lib/types";

// Types for API requests
export interface DateRangeQuery {
  startDate: string;
  endDate: string;
}

export interface RevenueStatistics {
  totalRevenue: number;
  averagePerDay: number;
  totalCovers: number;
  totalDays: number;
  highestDay: {
    date: string;
    revenue: number;
  } | null;
  lowestDay: {
    date: string;
    revenue: number;
  } | null;
}

export interface RevenueTrend {
  date: string;
  dayOfWeek: string;
  currentRevenue: number;
  previousRevenue: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  isNegative: boolean;
}

// Revenue API functions
const revenueApi = {
  getCurrentWeek: (): Promise<WeekData> =>
    httpClient.get("/revenue/current-week"),

  getPreviousWeek: (): Promise<WeekData> =>
    httpClient.get("/revenue/previous-week"),

  getDashboard: (): Promise<{
    currentWeek: WeekData;
    previousWeek: WeekData;
  }> => httpClient.get("/revenue/dashboard"),

  getByDateRange: (query: DateRangeQuery): Promise<WeekData> =>
    httpClient.get("/revenue/range", { params: query }),

  getByDate: (date: string): Promise<DailyRevenueData | null> =>
    httpClient.get(`/revenue/date/${date}`),

  createOrUpdate: (
    data: { date: string } & Partial<DailyRevenueData>
  ): Promise<DailyRevenueData> => httpClient.post("/revenue", data),

  update: (
    date: string,
    data: Partial<DailyRevenueData>
  ): Promise<DailyRevenueData> => httpClient.put(`/revenue/${date}`, data),

  delete: (date: string): Promise<void> =>
    httpClient.delete(`/revenue/${date}`),

  getStatistics: (query: DateRangeQuery): Promise<RevenueStatistics> =>
    httpClient.get("/revenue/statistics", { params: query }),

  getTrends: (query: DateRangeQuery): Promise<RevenueTrend[]> =>
    httpClient.get("/revenue/trends", { params: query }),
};

// Hooks
export const useCurrentWeekRevenue = () => {
  return useQuery({
    queryKey: queryKeys.revenue.currentWeek(),
    queryFn: revenueApi.getCurrentWeek,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const usePreviousWeekRevenue = () => {
  return useQuery({
    queryKey: queryKeys.revenue.previousWeek(),
    queryFn: revenueApi.getPreviousWeek,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDashboardRevenue = () => {
  return useQuery({
    queryKey: queryKeys.revenue.dashboard(),
    queryFn: revenueApi.getDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRevenueByDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.revenue.byDateRange(startDate, endDate),
    queryFn: () => revenueApi.getByDateRange({ startDate, endDate }),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRevenueByDate = (date: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.revenue.byDate(date),
    queryFn: () => revenueApi.getByDate(date),
    enabled: enabled && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRevenueStatistics = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.revenue.statistics(startDate, endDate),
    queryFn: () => revenueApi.getStatistics({ startDate, endDate }),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRevenueTrends = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.revenue.trends(startDate, endDate),
    queryFn: () => revenueApi.getTrends({ startDate, endDate }),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutation hooks
export const useCreateOrUpdateRevenue = () => {
  return useMutation({
    mutationFn: revenueApi.createOrUpdate,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryUtils.invalidateRevenue();
      queryUtils.invalidateRevenueByDate(data.date);
    },
  });
};

export const useUpdateRevenue = () => {
  return useMutation({
    mutationFn: ({
      date,
      data,
    }: {
      date: string;
      data: Partial<DailyRevenueData>;
    }) => revenueApi.update(date, data),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryUtils.invalidateRevenue();
      queryUtils.invalidateRevenueByDate(variables.date);
    },
  });
};

export const useDeleteRevenue = () => {
  return useMutation({
    mutationFn: revenueApi.delete,
    onSuccess: (_, date) => {
      // Invalidate relevant queries
      queryUtils.invalidateRevenue();
      queryUtils.invalidateRevenueByDate(date);
    },
  });
};

// Combined hooks for common use cases
export const useRevenueComparison = () => {
  const currentWeek = useCurrentWeekRevenue();
  const previousWeek = usePreviousWeekRevenue();

  return {
    currentWeek,
    previousWeek,
    isLoading: currentWeek.isLoading || previousWeek.isLoading,
    isError: currentWeek.isError || previousWeek.isError,
    error: currentWeek.error || previousWeek.error,
  };
};

// Export API functions for direct use if needed
export { revenueApi };
