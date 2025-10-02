/**
 * HeaderSection Component
 * Contains the dashboard title, filter controls, and action buttons
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart3, Download } from "lucide-react";
import { ChartFilters } from "@/lib/types";

interface HeaderSectionProps {
  title: string;
  filters: ChartFilters;
  showComparison: boolean;
  onFilterChange: (filters: ChartFilters) => void;
  onComparisonToggle: () => void;
  onExport: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  title,
  filters,
  showComparison,
  onFilterChange,
  onComparisonToggle,
  onExport,
}) => {
  // Handle individual filter checkbox changes
  const handleFilterChange = (
    filterKey: keyof ChartFilters,
    checked: boolean
  ) => {
    onFilterChange({
      ...filters,
      [filterKey]: checked,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Filter Checkboxes */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pos-revenue"
              checked={filters.showPosRevenue}
              onCheckedChange={(checked) =>
                handleFilterChange("showPosRevenue", checked as boolean)
              }
            />
            <label
              htmlFor="pos-revenue"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              POS Revenue
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="eatclub-revenue"
              checked={filters.showEatclubRevenue}
              onCheckedChange={(checked) =>
                handleFilterChange("showEatclubRevenue", checked as boolean)
              }
            />
            <label
              htmlFor="eatclub-revenue"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Eatclub Revenue
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="labour-costs"
              checked={filters.showLabourCosts}
              onCheckedChange={(checked) =>
                handleFilterChange("showLabourCosts", checked as boolean)
              }
            />
            <label
              htmlFor="labour-costs"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Labour Costs
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onComparisonToggle}
            variant={showComparison ? "default" : "outline"}
            size="sm"
            className={`flex items-center gap-2 ${
              showComparison
                ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Compare to Previous
          </Button>

          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
          >
            <Download className="h-4 w-4" />
            Export PNG
          </Button>
        </div>
      </div>
    </div>
  );
};

