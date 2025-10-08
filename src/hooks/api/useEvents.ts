/**
 * Events API hooks using React Query
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios";
import { queryKeys, queryUtils } from "@/lib/react-query";

// Types
export interface EventImpact {
  type: "positive" | "negative";
  impact: number;
  description?: string;
}

export interface Event {
  _id: string;
  date: string;
  type: "positive" | "negative";
  impact: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventStatistics {
  totalEvents: number;
  positiveEvents: number;
  negativeEvents: number;
  averageImpact: number;
  positivePercentage: number;
  negativePercentage: number;
}

export interface MonthlyEvent {
  month: string;
  monthNumber: number;
  count: number;
  positiveCount: number;
  negativeCount: number;
  averageImpact: number;
}

export interface PaginatedEvents {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface CreateEventData {
  date: string;
  type: "positive" | "negative";
  impact: number;
  description?: string;
}

export interface UpdateEventData {
  date?: string;
  type?: "positive" | "negative";
  impact?: number;
  description?: string;
}

// Events API functions
const eventsApi = {
  getList: (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<PaginatedEvents> => httpClient.get("/events", { params }),

  getByDate: (date: string): Promise<Event[]> =>
    httpClient.get(`/events/date/${date}`),

  getByDateRange: (startDate: string, endDate: string): Promise<Event[]> =>
    httpClient.get("/events/range", { params: { startDate, endDate } }),

  getByType: (type: "positive" | "negative"): Promise<Event[]> =>
    httpClient.get(`/events/type/${type}`),

  getById: (id: string): Promise<Event> => httpClient.get(`/events/${id}`),

  getStatistics: (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<EventStatistics> =>
    httpClient.get("/events/statistics", { params }),

  getMonthly: (year: number): Promise<MonthlyEvent[]> =>
    httpClient.get(`/events/monthly/${year}`),

  create: (data: CreateEventData): Promise<Event> =>
    httpClient.post("/events", data),

  update: (id: string, data: UpdateEventData): Promise<Event> =>
    httpClient.put(`/events/${id}`, data),

  delete: (id: string): Promise<void> => httpClient.delete(`/events/${id}`),
};

// Query hooks
export const useEventsList = (params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.events.list(
      params?.page,
      params?.limit,
      params?.sortBy,
      params?.sortOrder
    ),
    queryFn: () => eventsApi.getList(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEventsByDate = (date: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.events.byDate(date),
    queryFn: () => eventsApi.getByDate(date),
    enabled: enabled && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEventsByDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.events.byDateRange(startDate, endDate),
    queryFn: () => eventsApi.getByDateRange(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEventsByType = (
  type: "positive" | "negative",
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.events.byType(type),
    queryFn: () => eventsApi.getByType(type),
    enabled: enabled && !!type,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEventById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.events.byId(id),
    queryFn: () => eventsApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useEventStatistics = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: queryKeys.events.statistics(params?.startDate, params?.endDate),
    queryFn: () => eventsApi.getStatistics(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEventsMonthly = (year: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.events.monthly(year),
    queryFn: () => eventsApi.getMonthly(year),
    enabled: enabled && !!year,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hooks
export const useCreateEvent = () => {
  return useMutation({
    mutationFn: eventsApi.create,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryUtils.invalidateEvents();
      queryUtils.invalidateEventById(data._id);
    },
  });
};

export const useUpdateEvent = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventData }) =>
      eventsApi.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryUtils.invalidateEvents();
      queryUtils.invalidateEventById(variables.id);
    },
  });
};

export const useDeleteEvent = () => {
  return useMutation({
    mutationFn: eventsApi.delete,
    onSuccess: (_, id) => {
      // Invalidate relevant queries
      queryUtils.invalidateEvents();
      queryUtils.invalidateEventById(id);
    },
  });
};

// Combined hooks for common use cases
export const useEventsForDateRange = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  const events = useEventsByDateRange(startDate, endDate, enabled);
  const statistics = useEventStatistics({ startDate, endDate });

  return {
    events,
    statistics,
    isLoading: events.isLoading || statistics.isLoading,
    isError: events.isError || statistics.isError,
    error: events.error || statistics.error,
  };
};

// Export API functions for direct use if needed
export { eventsApi };
