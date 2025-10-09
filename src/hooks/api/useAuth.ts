/**
 * Authentication API hooks using React Query
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios";
import { queryKeys, queryUtils } from "@/lib/react-query";

// Types
export interface User {
    _id: string;
    email: string;
    name: string;
    role: "admin" | "user";
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role?: "admin" | "user";
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface PaginatedUsers {
    users: User[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export interface UpdateUserData {
    name?: string;
    email?: string;
}

export interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

// Auth API functions
const authApi = {
    login: (data: LoginRequest): Promise<LoginResponse> =>
        httpClient.post("/auth/login", data),

    register: (data: RegisterRequest): Promise<LoginResponse> =>
        httpClient.post("/auth/register", data),

    refreshToken: (userId: string): Promise<{ token: string }> =>
        httpClient.post("/auth/refresh", { userId }),

    getUserById: (userId: string): Promise<User> =>
        httpClient.get(`/admin/users/${userId}`),

    getAllUsers: (params?: {
        page?: number;
        limit?: number;
    }): Promise<PaginatedUsers> => httpClient.get("/admin/users", { params }),

    updateUser: (userId: string, data: UpdateUserData): Promise<User> =>
        httpClient.put(`/admin/users/${userId}`, data),

    changePassword: (
        userId: string,
        data: ChangePasswordData
    ): Promise<{ success: boolean }> =>
        httpClient.put(`/admin/users/${userId}/password`, data),

    deleteUser: (userId: string): Promise<{ success: boolean }> =>
        httpClient.delete(`/admin/users/${userId}`),
};

// Query hooks
export const useUser = (userId: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: queryKeys.auth.user(),
        queryFn: () => authApi.getUserById(userId),
        enabled: enabled && !!userId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUsers = (params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: queryKeys.auth.users(params?.page, params?.limit),
        queryFn: () => authApi.getAllUsers(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Mutation hooks
export const useLogin = () => {
    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // Store token in localStorage only if in browser
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            // Invalidate auth queries
            queryUtils.invalidateAuth();
        },
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: authApi.register,
        onSuccess: (data) => {
            // Store token in localStorage only if in browser
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            // Invalidate auth queries
            queryUtils.invalidateAuth();
        },
    });
};

export const useRefreshToken = () => {
    return useMutation({
        mutationFn: authApi.refreshToken,
        onSuccess: (data) => {
            // Update token in localStorage only if in browser
            if (typeof window !== "undefined") {
                localStorage.setItem("auth_token", data.token);
            }
        },
    });
};

export const useUpdateUser = () => {
    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string;
            data: UpdateUserData;
        }) => authApi.updateUser(userId, data),
        onSuccess: (data) => {
            // Update user in localStorage only if in browser
            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(data));
            }

            // Invalidate auth queries
            queryUtils.invalidateAuth();
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string;
            data: ChangePasswordData;
        }) => authApi.changePassword(userId, data),
    });
};

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: authApi.deleteUser,
        onSuccess: () => {
            // Invalidate auth queries
            queryUtils.invalidateAuth();
        },
    });
};

// Utility hooks
export const useLogout = () => {
    return () => {
        // Clear localStorage only if in browser
        if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
        }

        // Clear all queries
        queryUtils.clearAll();
    };
};

export const useCurrentUser = () => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") {
        return {
            user: null,
            isAuthenticated: false,
        };
    }

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    return {
        user,
        isAuthenticated: !!user && !!localStorage.getItem("auth_token"),
    };
};

// Export API functions for direct use if needed
export { authApi };
