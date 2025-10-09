/**
 * Axios configuration and HTTP client setup
 */

import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    AxiosError,
} from "axios";
import { API_CONFIG } from "../config/api";

// API Response interface
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Custom error class
export class ApiError extends Error {
    public status?: number;
    public data?: unknown;
    public isAxiosError: boolean;

    constructor(
        message: string,
        status?: number,
        data?: unknown,
        isAxiosError: boolean = false
    ) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
        this.isAxiosError = isAxiosError;
    }
}

// Create axios instance
const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_CONFIG.BASE_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Request interceptor
    instance.interceptors.request.use(
        (config) => {
            // Add authentication token if available (only in browser)
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("auth_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            // Add timestamp to prevent caching
            if (config.method === "get") {
                config.params = {
                    ...config.params,
                    _t: Date.now(),
                };
            }

            // Log request in development
            if (process.env.NODE_ENV === "development") {
                console.log(
                    `🚀 API Request: ${config.method?.toUpperCase()} ${
                        config.url
                    }`,
                    {
                        params: config.params,
                        data: config.data,
                    }
                );
            }

            return config;
        },
        (error) => {
            console.error("❌ Request Error:", error);
            return Promise.reject(error);
        }
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse<ApiResponse>) => {
            // Log response in development
            if (process.env.NODE_ENV === "development") {
                console.log(
                    `✅ API Response: ${response.config.method?.toUpperCase()} ${
                        response.config.url
                    }`,
                    {
                        status: response.status,
                        data: response.data,
                    }
                );
            }

            // Check if the response indicates success
            if (response.data && !response.data.success) {
                throw new ApiError(
                    response.data.message ||
                        response.data.error ||
                        "Request failed",
                    response.status,
                    response.data
                );
            }

            return response;
        },
        (error: AxiosError<ApiResponse>) => {
            // Log error in development
            if (process.env.NODE_ENV === "development") {
                console.error(
                    `❌ API Error: ${error.config?.method?.toUpperCase()} ${
                        error.config?.url
                    }`,
                    {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message,
                    }
                );
            }

            // Handle different types of errors
            if (error.response) {
                // Server responded with error status
                const { status, data } = error.response;
                const message =
                    data?.message ||
                    data?.error ||
                    error.message ||
                    "An error occurred";

                // Handle specific status codes
                if (status === 401) {
                    // Unauthorized - clear auth data and redirect to login
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("auth_token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                    }
                }

                throw new ApiError(message, status, data, true);
            } else if (error.request) {
                // Network error
                throw new ApiError(
                    "Network error. Please check your connection.",
                    undefined,
                    undefined,
                    true
                );
            } else {
                // Other error
                throw new ApiError(
                    error.message || "An unexpected error occurred",
                    undefined,
                    undefined,
                    true
                );
            }
        }
    );

    return instance;
};

// Create and export axios instance
export const apiClient = createAxiosInstance();

// HTTP methods with proper typing
export const httpClient = {
    get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
        apiClient
            .get<ApiResponse<T>>(url, config)
            .then((response) => response.data.data as T),

    post: <T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient
            .post<ApiResponse<T>>(url, data, config)
            .then((response) => response.data.data as T),

    put: <T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient
            .put<ApiResponse<T>>(url, data, config)
            .then((response) => response.data.data as T),

    patch: <T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient
            .patch<ApiResponse<T>>(url, data, config)
            .then((response) => response.data.data as T),

    delete: <T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> =>
        apiClient
            .delete<ApiResponse<T>>(url, config)
            .then((response) => response.data.data as T),
};

// Export types
export type { AxiosRequestConfig, AxiosResponse, AxiosError };
