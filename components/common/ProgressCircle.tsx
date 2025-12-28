import React from 'react';
import { motion } from 'framer-motion';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ percentage, size = 180, strokeWidth = 15 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color = percentage < 40 ? '#ef4444' // red-500
              : percentage < 70 ? '#f59e0b' // amber-500
              : '#22c55e'; // green-500

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke="#374151" // gray-700
        fill="transparent"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        stroke={color}
        fill="transparent"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="font-roboto-mono text-4xl font-bold fill-white"
      >
        {`${Math.round(percentage)}%`}
      </text>
    </svg>
  );
};

export default ProgressCircle;
