"use client";
/**
 * RevenueTrendDashboard Component
 * Main dashboard component that orchestrates all sub-components
 */

import React, { useState, useMemo } from "react";
import { HeaderSection } from "./HeaderSection";
import { KPICards } from "./KPICards";
import { RevenueChart } from "./RevenueChart";
import { ChartLegend } from "./ChartLegend";
import { ChartFilters, ChartDataPoint } from "@/lib/types";
import { useDashboardRevenue, useRevenueComparison } from "@/hooks/api";
import { getComparisonData } from "@/data/mockData";

interface RevenueTrendDashboardProps {
  title?: string;
}

export const RevenueTrendDashboard: React.FC<RevenueTrendDashboardProps> = ({
  title = "This Week's Revenue Trend",
}) => {
  // Use React Query hooks for data fetching
  const dashboardQuery = useDashboardRevenue();
  const comparisonQuery = useRevenueComparison();

  // Chart configuration state
  const [showComparison, setShowComparison] = useState(true);
  const [filters, setFilters] = useState<ChartFilters>({
    showPosRevenue: true,
    showEatclubRevenue: true,
    showLabourCosts: true,
  });

  // Extract data from queries
  const currentWeekData = dashboardQuery.data?.currentWeek;
  const previousWeekData = dashboardQuery.data?.previousWeek;
  const loading = dashboardQuery.isLoading || comparisonQuery.isLoading;
  const error = dashboardQuery.error || comparisonQuery.error;

  // Transform data for chart
  const chartData: ChartDataPoint[] = useMemo(() => {
    if (!currentWeekData || !previousWeekData) return [];

    return currentWeekData.dailyData.map((currentDay, index) => {
      const previousDay = previousWeekData.dailyData[index];

      return {
        day: currentDay.dayOfWeek,
        posRevenue: currentDay.posRevenue,
        eatclubRevenue: currentDay.eatclubRevenue,
        labourCosts: currentDay.labourCosts,
        posRevenuePrevious: previousDay?.posRevenue,
        eatclubRevenuePrevious: previousDay?.eatclubRevenue,
        labourCostsPrevious: previousDay?.labourCosts,
        events: currentDay.events,
      };
    });
  }, [currentWeekData, previousWeekData]);

  // Get comparison data for KPI cards
  const comparisonData = useMemo(() => {
    if (!currentWeekData || !previousWeekData) return null;

    const comparison = getComparisonData();
    return {
      totalRevenue: comparison.totalRevenue.previous,
      averagePerDay: comparison.averagePerDay.previous,
      totalCovers: comparison.totalCovers.previous,
      revenueChangePercent: comparison.totalRevenue.changePercent,
      averageChangePercent: comparison.averagePerDay.changePercent,
      coversChangePercent: comparison.totalCovers.changePercent,
    };
  }, [currentWeekData, previousWeekData]);

  // Event handlers
  const handleComparisonToggle = () => {
    setShowComparison(!showComparison);
  };

  const handleFilterChange = (newFilters: ChartFilters) => {
    setFilters(newFilters);
  };

  const handleExport = () => {
    // Placeholder for export functionality
    console.log("Export functionality would be implemented here");
    alert("Export functionality would be implemented here");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentWeekData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || "No data available"}
          </p>
          <button
            onClick={() => {
              dashboardQuery.refetch();
              comparisonQuery.currentWeek.refetch();
              comparisonQuery.previousWeek.refetch();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <HeaderSection
          title={showComparison ? `${title} vs Previous Period` : title}
          filters={filters}
          showComparison={showComparison}
          onFilterChange={handleFilterChange}
          onComparisonToggle={handleComparisonToggle}
          onExport={handleExport}
        />

        {/* KPI Cards */}
        <KPICards
          totalRevenue={currentWeekData.summary.totalRevenue}
          averagePerDay={currentWeekData.summary.averagePerDay}
          totalCovers={currentWeekData.summary.totalCovers}
          previousWeekData={
            showComparison ? comparisonData || undefined : undefined
          }
        />

        {/* Chart Section */}
        <div className="relative">
          <RevenueChart
            data={chartData}
            filters={filters}
            showComparison={showComparison}
            height={400}
          />

          {/* Chart Legend */}
          <ChartLegend filters={filters} showComparison={showComparison} />
        </div>

        {/* Bottom Navigation Tabs (Placeholder) */}
        <div className="mt-8 flex justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-2 bg-white text-gray-900 rounded-md shadow-sm text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              Period Comparison
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
              Year-over-Year
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
              Budget Performance
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">
              Performance Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
