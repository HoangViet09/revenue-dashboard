/**
 * WavyArrow Component
 * Custom wavy arrow icons for event impact indicators
 */

import React from "react";

interface WavyArrowProps {
  direction: "up" | "down";
  className?: string;
}

export const WavyArrow: React.FC<WavyArrowProps> = ({
  direction,
  className = "w-5 h-5",
}) => {
  const color = direction === "up" ? "#10b981" : "#ef4444"; // green-500 or red-500

  if (direction === "up") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={className}
        style={{ color }}
      >
        <path
          d="M3 21L7 17L11 19L15 15L19 17L21 15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M19 17L21 15L21 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ color }}
    >
      <path
        d="M3 3L7 7L11 5L15 9L19 7L21 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M19 7L21 9L21 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};
