"use client";

/**
 * React Query configuration and setup
 */

import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

// Create a client
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Time in milliseconds that data remains fresh
        staleTime: 0, // Always consider data stale to force refetch
        // Time in milliseconds that unused/inactive cache data remains in memory
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        // Retry failed requests
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error && typeof error === "object" && "status" in error) {
            const status = (error as { status: number }).status;
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry delay
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus
        refetchOnWindowFocus: false,
        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry failed mutations
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error && typeof error === "object" && "status" in error) {
            const status = (error as { status: number }).status;
            if (status >= 400 && status < 500) {
              return false;
            }
          }
          // Retry up to 2 times for other errors
          return failureCount < 2;
        },
      },
    },
  });

export const queryClient = createQueryClient();

// Query keys factory for better organization
export const queryKeys = {
  // Revenue queries
  revenue: {
    all: ["revenue"] as const,
    currentWeek: () => [...queryKeys.revenue.all, "currentWeek"] as const,
    previousWeek: () => [...queryKeys.revenue.all, "previousWeek"] as const,
    dashboard: () => [...queryKeys.revenue.all, "dashboard"] as const,
    byDate: (date: string) =>
      [...queryKeys.revenue.all, "byDate", date] as const,
    byDateRange: (startDate: string, endDate: string) =>
      [...queryKeys.revenue.all, "byDateRange", startDate, endDate] as const,
    statistics: (startDate: string, endDate: string) =>
      [...queryKeys.revenue.all, "statistics", startDate, endDate] as const,
    trends: (startDate: string, endDate: string) =>
      [...queryKeys.revenue.all, "trends", startDate, endDate] as const,
  },

  // Events queries
  events: {
    all: ["events"] as const,
    list: (
      page?: number,
      limit?: number,
      sortBy?: string,
      sortOrder?: string
    ) =>
      [
        ...queryKeys.events.all,
        "list",
        { page, limit, sortBy, sortOrder },
      ] as const,
    byDate: (date: string) =>
      [...queryKeys.events.all, "byDate", date] as const,
    byDateRange: (startDate: string, endDate: string) =>
      [...queryKeys.events.all, "byDateRange", startDate, endDate] as const,
    byType: (type: string) =>
      [...queryKeys.events.all, "byType", type] as const,
    byId: (id: string) => [...queryKeys.events.all, "byId", id] as const,
    statistics: (startDate?: string, endDate?: string) =>
      [...queryKeys.events.all, "statistics", { startDate, endDate }] as const,
    monthly: (year: number) =>
      [...queryKeys.events.all, "monthly", year] as const,
  },

  // Auth queries
  auth: {
    all: ["auth"] as const,
    user: () => [...queryKeys.auth.all, "user"] as const,
    users: (page?: number, limit?: number) =>
      [...queryKeys.auth.all, "users", { page, limit }] as const,
  },

  // Health check
  health: ["health"] as const,
};

// React Query Provider component
interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [client] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// Utility functions for query invalidation
export const queryUtils = {
  // Invalidate all revenue queries
  invalidateRevenue: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.revenue.all });
  },

  // Invalidate specific revenue query
  invalidateRevenueByDate: (date: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.revenue.byDate(date) });
  },

  // Invalidate all events queries
  invalidateEvents: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.events.all });
  },

  // Invalidate specific event query
  invalidateEventById: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.events.byId(id) });
  },

  // Invalidate auth queries
  invalidateAuth: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
  },

  // Clear all queries (useful for logout)
  clearAll: () => {
    queryClient.clear();
  },
};

// Export query client for direct access if needed
// Note: queryClient is already exported above
