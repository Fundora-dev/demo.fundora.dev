import React from 'react';

interface ProgressBarProps {
  current: number;
  goal: number;
  height?: string; // e.g., 'h-2', 'h-4'
  showPercentageText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, goal, height = 'h-3', showPercentageText = true }) => {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

  return (
    <div>
      <div className={`w-full bg-[#0A6CFF]/20 rounded-full ${height} overflow-hidden`}>
        <div
          className="bg-[#0A6CFF] h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showPercentageText && (
         <div className="flex justify-between text-xs text-[#1E1E1E]/70 mt-1">
            <span>達成率 {Math.floor(percentage)}%</span>
            <span>目標: {goal.toLocaleString()}円</span>
        </div>
      )}
    </div>
  );
};