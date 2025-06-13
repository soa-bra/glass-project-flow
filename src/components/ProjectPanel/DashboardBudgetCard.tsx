
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign } from 'lucide-react';

interface DashboardBudgetCardProps {
  totalBudget: number;
  spentBudget: number;
}

export const DashboardBudgetCard: React.FC<DashboardBudgetCardProps> = ({
  totalBudget,
  spentBudget
}) => {
  const remainingBudget = totalBudget - spentBudget;
  const spentPercentage = (spentBudget / totalBudget) * 100;

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          الميزانية
        </h3>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
          <DollarSign size={20} className="text-white" />
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex-1 flex items-center justify-center mb-4">
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="url(#budgetGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 50 - (spentPercentage / 100) * 2 * Math.PI * 50 }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              {Math.round(spentPercentage)}%
            </span>
            <span className="text-xs text-gray-600 font-arabic">مُنفق</span>
          </div>
        </div>
      </div>

      {/* Budget Details */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المُنفق</span>
          <span className="text-base font-semibold text-gray-800 font-arabic">
            ${spentBudget.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المتبقي</span>
          <span className="text-base font-semibold text-green-600 font-arabic">
            ${remainingBudget.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
