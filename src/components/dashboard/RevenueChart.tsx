/**
 * RevenueChart Component
 * Interactive stacked column chart with comparison toggle functionality
 */

import React from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { WavyArrow } from "@/components/ui/wavy-arrow";
import { ChartDataPoint, ChartFilters, EventImpact } from "@/lib/types";

interface RevenueChartProps {
  data: ChartDataPoint[];
  filters: ChartFilters;
  showComparison: boolean;
  height?: number;
}

// Custom tooltip component
interface TooltipPayload {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: TooltipPayload, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {entry.name}: ${entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  filters,
  showComparison,
  height = 400,
}) => {
  // Filter data based on current filters
  const filteredData = data.map((item) => {
    const filtered: Record<string, unknown> = { day: item.day };

    if (filters.showPosRevenue) {
      filtered.posRevenue = item.posRevenue;
      if (showComparison) {
        filtered.posRevenuePrevious = item.posRevenuePrevious;
      }
    }

    if (filters.showEatclubRevenue) {
      filtered.eatclubRevenue = item.eatclubRevenue;
      if (showComparison) {
        filtered.eatclubRevenuePrevious = item.eatclubRevenuePrevious;
      }
    }

    if (filters.showLabourCosts) {
      filtered.labourCosts = item.labourCosts;
      if (showComparison) {
        filtered.labourCostsPrevious = item.labourCostsPrevious;
      }
    }

    // Always include events for indicators
    filtered.events = item.events;

    return filtered;
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div style={{ width: "100%", height: height }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                domain={[0, 3000]}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Current Period Bars */}
              {filters.showPosRevenue && (
                <Bar
                  dataKey="posRevenue"
                  name="POS Revenue (Current)"
                  stackId="current"
                  fill="#1f2937"
                  radius={[0, 0, 0, 0]}
                />
              )}

              {filters.showEatclubRevenue && (
                <Bar
                  dataKey="eatclubRevenue"
                  name="Eatclub Revenue (Current)"
                  stackId="current"
                  fill="#3b82f6"
                  radius={[0, 0, 0, 0]}
                />
              )}

              {filters.showLabourCosts && (
                <Bar
                  dataKey="labourCosts"
                  name="Labour Costs (Current)"
                  fill="#f97316"
                  radius={[2, 2, 0, 0]}
                />
              )}

              {/* Previous Period Bars (shown when comparison is enabled) */}
              {showComparison && (
                <>
                  {filters.showPosRevenue && (
                    <Bar
                      dataKey="posRevenuePrevious"
                      name="POS Revenue (Previous)"
                      stackId="previous"
                      fill="#9ca3af"
                      radius={[0, 0, 0, 0]}
                    />
                  )}

                  {filters.showEatclubRevenue && (
                    <Bar
                      dataKey="eatclubRevenuePrevious"
                      name="Eatclub Revenue (Previous)"
                      stackId="previous"
                      fill="#a78bfa"
                      radius={[0, 0, 0, 0]}
                    />
                  )}

                  {filters.showLabourCosts && (
                    <Bar
                      dataKey="labourCostsPrevious"
                      name="Labour Costs (Previous)"
                      fill="#fed7aa"
                      radius={[2, 2, 0, 0]}
                    />
                  )}
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Event Impact Indicators */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {filteredData.map((item, index) => {
            const events = item.events as EventImpact[] | undefined;
            if (!events || events.length === 0) return null;

            return events.map((event: EventImpact, eventIndex: number) => {
              // Calculate position based on chart layout
              const chartWidth = 100; // Percentage
              const barWidth = chartWidth / 7; // 7 days
              const leftPosition = index * barWidth + barWidth / 2 - 1; // Center on bar

              return (
                <div
                  key={`${index}-${eventIndex}`}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: `${leftPosition}%`,
                    top: "10px",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="relative">
                    <WavyArrow
                      direction={event.type === "positive" ? "up" : "down"}
                      className="w-6 h-6 drop-shadow-sm"
                    />
                    {/* Add a subtle background circle for better visibility */}
                    <div
                      className={`absolute inset-0 rounded-full -z-10 ${
                        event.type === "positive"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                      style={{
                        width: "28px",
                        height: "28px",
                        left: "-2px",
                        top: "-2px",
                      }}
                    />
                  </div>
                </div>
              );
            });
          })}
        </div>
      </CardContent>
    </Card>
  );
};
