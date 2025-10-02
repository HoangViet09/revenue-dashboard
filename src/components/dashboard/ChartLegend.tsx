/**
 * ChartLegend Component
 * Displays color coding and symbols used in the chart
 */

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ChartFilters } from "@/lib/types";

interface ChartLegendProps {
  filters: ChartFilters;
  showComparison: boolean;
}

interface LegendItem {
  label: string;
  color: string;
  icon?: React.ReactNode;
}

export const ChartLegend: React.FC<ChartLegendProps> = ({
  filters,
  showComparison,
}) => {
  // Define legend items based on current filters and comparison mode
  const getLegendItems = (): LegendItem[] => {
    const items: LegendItem[] = [];

    // Current period items
    if (filters.showPosRevenue) {
      items.push({
        label: showComparison ? "POS Revenue (Current)" : "POS Revenue",
        color: "#1f2937",
      });
    }

    if (filters.showEatclubRevenue) {
      items.push({
        label: showComparison ? "Eatclub Revenue (Current)" : "Eatclub Revenue",
        color: "#3b82f6",
      });
    }

    if (filters.showLabourCosts) {
      items.push({
        label: showComparison ? "Labour Costs (Current)" : "Labour Costs",
        color: "#f97316",
      });
    }

    // Previous period items (only shown when comparison is enabled)
    if (showComparison) {
      if (filters.showPosRevenue) {
        items.push({
          label: "POS Revenue (Previous)",
          color: "#9ca3af",
        });
      }

      if (filters.showEatclubRevenue) {
        items.push({
          label: "Eatclub Revenue (Previous)",
          color: "#a78bfa",
        });
      }

      if (filters.showLabourCosts) {
        items.push({
          label: "Labour Costs (Previous)",
          color: "#fed7aa",
        });
      }
    }

    // Event impact indicators (always shown)
    items.push(
      {
        label: "Positive Event Impact",
        color: "#10b981",
        icon: <TrendingUp className="w-4 h-4" />,
      },
      {
        label: "Negative Event Impact",
        color: "#ef4444",
        icon: <TrendingDown className="w-4 h-4" />,
      }
    );

    return items;
  };

  const legendItems = getLegendItems();

  return (
    <div className="flex flex-wrap items-center gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
      {legendItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.icon ? (
            <div className="flex items-center justify-center w-4 h-4">
              {item.icon}
            </div>
          ) : (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
          )}
          <span className="text-sm text-gray-700 font-medium">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

