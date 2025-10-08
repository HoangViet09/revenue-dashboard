/**
 * Health check API hooks using React Query
 */

import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/lib/axios";
import { queryKeys } from "@/lib/react-query";

// Types
export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  version: string;
}

// Health API functions
const healthApi = {
  check: (): Promise<HealthResponse> => httpClient.get("/health"),
};

// Query hooks
export const useHealthCheck = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: healthApi.check,
    enabled,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 3,
  });
};

// Export API functions for direct use if needed
export { healthApi };
