
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface EnhancedBudgetCardProps {
  totalBudget: number;
  spentBudget: number;
  onDetailsClick?: () => void;
}

export const EnhancedBudgetCard: React.FC<EnhancedBudgetCardProps> = ({
  totalBudget,
  spentBudget,
  onDetailsClick
}) => {
  const remainingBudget = totalBudget - spentBudget;
  const spentPercentage = (spentBudget / totalBudget) * 100;
  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (spentPercentage / 100) * circumference;

  return (
    <motion.div
      className="bg-white/40 backdrop-blur-[20px] border border-white/30 rounded-[20px] p-6 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      style={{ gridColumn: 1, gridRow: '1 / 2' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 font-arabic">الميزانية</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-arabic">
            <DropdownMenuItem>تعديل الميزانية</DropdownMenuItem>
            <DropdownMenuItem>تصدير CSV</DropdownMenuItem>
            <DropdownMenuItem>سجل المعاملات</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Budget Circle */}
      <div className="relative flex items-center justify-center mb-6">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#EEEEEE"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="url(#spentGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="spentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9C27B0" />
              <stop offset="100%" stopColor="#D500F9" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-gray-800 font-arabic" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
            {Math.round(spentPercentage)}%
          </span>
          <span className="text-sm text-gray-600 font-arabic">من الميزانية</span>
        </div>
      </div>

      {/* Budget details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المُنفق</span>
          <span className="text-lg font-semibold text-gray-800 font-arabic">
            ${spentBudget.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 font-arabic">المتبقي</span>
          <span className="text-lg font-semibold text-green-600 font-arabic">
            ${remainingBudget.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Details button */}
      <Button
        onClick={onDetailsClick}
        variant="ghost"
        size="sm"
        className="w-full mt-4 text-sky-600 hover:text-sky-700 hover:bg-sky-50 font-arabic"
      >
        <TrendingUp size={16} className="ml-2" />
        عرض التفاصيل المالية
      </Button>
    </motion.div>
  );
};
