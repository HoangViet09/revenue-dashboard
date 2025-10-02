/**
 * KPICards Component
 * Displays summary metrics in card format with comparison data
 */

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { KPICardProps } from "@/lib/types";

// Individual KPI Card component
const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  previousValue,
  changePercent,
  format = "currency",
}) => {
  // Format value based on type
  const formatValue = (val: number): string => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Determine if change is positive or negative
  const isPositive = changePercent && changePercent > 0;
  const isNegative = changePercent && changePercent < 0;

  return (
    <Card className="flex-1 bg-gray-50 border-gray-200">
      <CardContent className="p-6">
        <div className="text-center">
          {/* Title */}
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>

          {/* Current Value */}
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {formatValue(value)}
          </p>

          {/* Comparison */}
          {previousValue && changePercent !== undefined && (
            <div className="flex items-center justify-center gap-1 text-sm">
              <span className="text-gray-500">
                vs {formatValue(previousValue)}
              </span>
              <span
                className={`font-medium ${
                  isPositive
                    ? "text-green-600"
                    : isNegative
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                ({isPositive ? "+" : ""}
                {changePercent.toFixed(1)}%)
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main KPICards component props
interface KPICardsProps {
  totalRevenue: number;
  averagePerDay: number;
  totalCovers: number;
  previousWeekData?: {
    totalRevenue: number;
    averagePerDay: number;
    totalCovers: number;
    revenueChangePercent: number;
    averageChangePercent: number;
    coversChangePercent: number;
  };
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalRevenue,
  averagePerDay,
  totalCovers,
  previousWeekData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <KPICard
        title="Total Revenue"
        value={totalRevenue}
        previousValue={previousWeekData?.totalRevenue}
        changePercent={previousWeekData?.revenueChangePercent}
        format="currency"
      />

      <KPICard
        title="Average per Day"
        value={averagePerDay}
        previousValue={previousWeekData?.averagePerDay}
        changePercent={previousWeekData?.averageChangePercent}
        format="currency"
      />

      <KPICard
        title="Total Covers"
        value={totalCovers}
        previousValue={previousWeekData?.totalCovers}
        changePercent={previousWeekData?.coversChangePercent}
        format="number"
      />
    </div>
  );
};

