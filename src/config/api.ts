/**
 * API Configuration
 */

export const API_CONFIG = {
    // Default API URL - can be overridden by environment variable
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

    // API endpoints
    ENDPOINTS: {
        REVENUE: {
            CURRENT_WEEK: "/revenue/current-week",
            PREVIOUS_WEEK: "/revenue/previous-week",
            DASHBOARD: "/revenue/dashboard",
            RANGE: "/revenue/range",
            DATE: "/revenue/date",
            STATISTICS: "/revenue/statistics",
            TRENDS: "/revenue/trends",
        },
        AUTH: {
            LOGIN: "/auth/login",
            REGISTER: "/auth/register",
            REFRESH: "/auth/refresh",
        },
        EVENTS: {
            LIST: "/events",
            CREATE: "/events",
            UPDATE: "/events",
            DELETE: "/events",
        },
        ADMIN: {
            DASHBOARD: "/admin/dashboard",
            ANALYTICS: "/admin/analytics",
            REVENUE: "/admin/revenue",
            REVENUE_BULK: "/admin/revenue/bulk",
            EVENTS: "/admin/events",
            EVENTS_BULK: "/admin/events/bulk",
            USERS: "/admin/users",
        },
    },

    // Request timeout (in milliseconds)
    TIMEOUT: 10000,

    // Retry configuration
    RETRY: {
        MAX_ATTEMPTS: 3,
        DELAY: 1000,
    },
};

export default API_CONFIG;


