
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';

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
  const circumference = 2 * Math.PI * 85;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (spentPercentage / 100) * circumference;

  return (
    <div className="h-full bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          الميزانية
        </h3>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <DollarSign size={20} className="text-white" />
        </div>
      </div>

      {/* Progress Circle */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div className="relative">
          <svg width="180" height="180" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="90"
              cy="90"
              r="85"
              fill="none"
              stroke="url(#budgetGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="budgetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9C27B0" />
                <stop offset="100%" stopColor="#7B1FA2" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800 font-arabic mb-1" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
              {Math.round(spentPercentage)}%
            </span>
            <span className="text-sm text-gray-600 font-arabic">مُنفق</span>
          </div>
        </div>
      </div>

      {/* Budget Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المُنفق</span>
          <span className="text-lg font-semibold text-purple-600 font-arabic">
            ${spentBudget.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المتبقي</span>
          <span className="text-lg font-semibold text-green-600 font-arabic">
            ${remainingBudget.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-px bg-white/30 my-2"></div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">الإجمالي</span>
          <span className="text-lg font-bold text-gray-800 font-arabic">
            ${totalBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center justify-center mt-4 p-2 bg-green-100/50 rounded-[10px]">
        <TrendingUp size={16} className="text-green-600 ml-2" />
        <span className="text-sm font-arabic text-green-700">+12% عن الشهر الماضي</span>
      </div>
    </div>
  );
};
