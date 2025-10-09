/**
 * Admin API hooks using React Query
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios";
import { queryKeys, queryUtils, queryClient } from "@/lib/react-query";

// Types
export interface AdminDashboardData {
    revenue: {
        summary: {
            totalRevenue: number;
            averagePerDay: number;
            totalCovers: number;
            totalDays: number;
            highestDay: {
                date: string;
                revenue: number;
            };
            lowestDay: {
                date: string;
                revenue: number;
            };
        };
        dailyAverages: {
            posRevenue: number;
            eatclubRevenue: number;
            labourCosts: number;
            covers: number;
            totalRevenue: number;
            netRevenue: number;
        };
        performanceMetrics: {
            bestDay: {
                date: string;
                revenue: number;
                covers: number;
            };
            worstDay: {
                date: string;
                revenue: number;
                covers: number;
            };
            totalDays: number;
            daysWithData: number;
        };
        trends: Array<{
            date: string;
            dayOfWeek: string;
            currentRevenue: number;
            previousRevenue: number;
            change: number;
            changePercent: number;
            isPositive: boolean;
            isNegative: boolean;
        }>;
    };
    events: {
        summary: {
            totalEvents: number;
            positiveEvents: number;
            negativeEvents: number;
            averageImpact: number;
            positivePercentage: number;
            negativePercentage: number;
        };
        impactDistribution: {
            high: number;
            medium: number;
            low: number;
        };
        dailyEventCount: Record<string, number>;
        mostActiveDay: {
            date: string;
            count: number;
        };
    };
    trends: Array<{
        date: string;
        dayOfWeek: string;
        currentRevenue: number;
        previousRevenue: number;
        change: number;
        changePercent: number;
        isPositive: boolean;
        isNegative: boolean;
    }>;
    period: {
        startDate: string;
        endDate: string;
        days: number;
    };
}

export interface AdminRevenueData {
    _id: string;
    date: string;
    posRevenue: number;
    eatclubRevenue: number;
    labourCosts: number;
    covers: number;
    totalRevenue: number;
    netRevenue: number;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedRevenueData {
    data: AdminRevenueData[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface CreateRevenueData {
    date: string;
    posRevenue: number;
    eatclubRevenue: number;
    labourCosts: number;
    covers: number;
}

export interface BulkRevenueOperation {
    records: CreateRevenueData[];
}

export interface BulkDeleteOperation {
    dates: string[];
}

// Admin API functions
const adminApi = {
    // Admin Dashboard
    getDashboard: (): Promise<AdminDashboardData> =>
        httpClient.get("/admin/dashboard"),

    getAnalytics: (params?: {
        startDate?: string;
        endDate?: string;
    }): Promise<AdminDashboardData> =>
        httpClient.get("/admin/analytics", { params }),

    // Revenue Data Management
    getAllRevenueData: (params?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedRevenueData> =>
        httpClient.get("/admin/revenue", { params }),

    saveRevenueData: (data: CreateRevenueData): Promise<AdminRevenueData> =>
        httpClient.post("/admin/revenue/bulk", data),

    updateRevenueData: (
        date: string,
        data: Partial<CreateRevenueData>
    ): Promise<AdminRevenueData> =>
        httpClient.put(`/admin/revenue/${date}`, data),

    deleteRevenueData: (date: string): Promise<{ success: boolean }> =>
        httpClient.delete(`/admin/revenue/${date}`),

    bulkSaveRevenueData: (
        data: BulkRevenueOperation
    ): Promise<{
        success: boolean;
        created: number;
        updated: number;
    }> => httpClient.post("/admin/revenue/bulk", data),

    bulkDeleteRevenueData: (
        data: BulkDeleteOperation
    ): Promise<{
        success: boolean;
        deleted: number;
    }> => httpClient.delete("/admin/revenue/bulk", { data }),

    // Event Management (Admin)
    createEvent: (data: {
        date: string;
        type: "positive" | "negative";
        impact: number;
        description: string;
    }): Promise<{
        _id: string;
        date: string;
        type: "positive" | "negative";
        impact: number;
        description: string;
        createdAt: string;
    }> => httpClient.post("/admin/events", data),

    updateEvent: (
        eventId: string,
        data: {
            date?: string;
            type?: "positive" | "negative";
            impact?: number;
            description?: string;
        }
    ): Promise<{
        _id: string;
        date: string;
        type: "positive" | "negative";
        impact: number;
        description: string;
        createdAt: string;
    }> => httpClient.put(`/admin/events/${eventId}`, data),

    deleteEvent: (eventId: string): Promise<{ success: boolean }> =>
        httpClient.delete(`/admin/events/${eventId}`),

    bulkCreateEvents: (data: {
        events: Array<{
            date: string;
            type: "positive" | "negative";
            impact: number;
            description: string;
        }>;
    }): Promise<{
        success: boolean;
        created: number;
    }> => httpClient.post("/admin/events/bulk", data),
};

// Query hooks
export const useAdminDashboard = () => {
    return useQuery({
        queryKey: ["admin", "dashboard"],
        queryFn: adminApi.getDashboard,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useAdminAnalytics = (params?: {
    startDate?: string;
    endDate?: string;
}) => {
    return useQuery({
        queryKey: ["admin", "analytics", params],
        queryFn: () => adminApi.getAnalytics(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useAdminRevenueData = (params?: {
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ["admin", "revenue", params],
        queryFn: () => adminApi.getAllRevenueData(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

// Mutation hooks
export const useSaveRevenueData = () => {
    return useMutation({
        mutationFn: adminApi.saveRevenueData,
        onSuccess: () => {
            queryUtils.invalidateRevenue();
            queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
        },
    });
};

export const useUpdateRevenueData = () => {
    return useMutation({
        mutationFn: ({
            date,
            data,
        }: {
            date: string;
            data: Partial<CreateRevenueData>;
        }) => adminApi.updateRevenueData(date, data),
        onSuccess: () => {
            queryUtils.invalidateRevenue();
            queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
        },
    });
};

export const useDeleteRevenueData = () => {
    return useMutation({
        mutationFn: adminApi.deleteRevenueData,
        onSuccess: () => {
            queryUtils.invalidateRevenue();
            queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
        },
    });
};

export const useBulkSaveRevenueData = () => {
    return useMutation({
        mutationFn: adminApi.bulkSaveRevenueData,
        onSuccess: () => {
            queryUtils.invalidateRevenue();
            queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
        },
    });
};

export const useBulkDeleteRevenueData = () => {
    return useMutation({
        mutationFn: adminApi.bulkDeleteRevenueData,
        onSuccess: () => {
            queryUtils.invalidateRevenue();
            queryClient.invalidateQueries({ queryKey: ["admin", "revenue"] });
        },
    });
};

export const useCreateEvent = () => {
    return useMutation({
        mutationFn: adminApi.createEvent,
        onSuccess: () => {
            queryUtils.invalidateEvents();
        },
    });
};

export const useUpdateEvent = () => {
    return useMutation({
        mutationFn: ({ eventId, data }: { eventId: string; data: any }) =>
            adminApi.updateEvent(eventId, data),
        onSuccess: () => {
            queryUtils.invalidateEvents();
        },
    });
};

export const useDeleteEvent = () => {
    return useMutation({
        mutationFn: adminApi.deleteEvent,
        onSuccess: () => {
            queryUtils.invalidateEvents();
        },
    });
};

export const useBulkCreateEvents = () => {
    return useMutation({
        mutationFn: adminApi.bulkCreateEvents,
        onSuccess: () => {
            queryUtils.invalidateEvents();
        },
    });
};

// Export API functions for direct use if needed
export { adminApi };
