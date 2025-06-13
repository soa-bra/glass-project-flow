
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { ProjectCardProps } from '@/components/ProjectCard/types';

interface FinanceDetailsTabProps {
  project: ProjectCardProps;
  tint: string;
}

const mockFinanceData = {
  budget: 15000,
  spent: 8500,
  remaining: 6500,
  monthlyFlow: [
    { month: 'يناير', income: 5000, expense: 3000 },
    { month: 'فبراير', income: 4500, expense: 2800 },
    { month: 'مارس', income: 5500, expense: 2700 },
  ]
};

export const FinanceDetailsTab: React.FC<FinanceDetailsTabProps> = ({ project, tint }) => {
  const budgetProgress = (mockFinanceData.spent / mockFinanceData.budget) * 100;

  return (
    <motion.div 
      className="h-full p-6 overflow-y-auto"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
    >
      {/* Budget Overview Card */}
      <motion.div 
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20"
        style={{ height: '180px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold font-arabic text-gray-800">الميزانية</h3>
          <DollarSign size={24} className="text-gray-600" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{mockFinanceData.budget.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-arabic">المجموع</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{mockFinanceData.spent.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-arabic">المُنفق</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{mockFinanceData.remaining.toLocaleString()}</div>
            <div className="text-sm text-gray-600 font-arabic">المتبقي</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 rounded-full transition-all duration-500"
            style={{ 
              width: `${budgetProgress}%`,
              backgroundColor: tint
            }}
          />
        </div>
        <div className="text-sm text-gray-600 font-arabic mt-2">
          {budgetProgress.toFixed(1)}% من الميزanية مُستخدمة
        </div>
      </motion.div>

      {/* Monthly Cash Flow */}
      <motion.div 
        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-bold font-arabic text-gray-800 mb-4">التدفق النقدي الشهري</h3>
        
        <div className="space-y-4">
          {mockFinanceData.monthlyFlow.map((month, index) => (
            <motion.div 
              key={month.month}
              className="flex items-center justify-between p-4 bg-white/20 rounded-xl border border-white/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-600" />
                <span className="font-arabic font-semibold text-gray-800">{month.month}</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-green-600 font-semibold">+{month.income.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown size={16} className="text-red-600" />
                  <span className="text-red-600 font-semibold">-{month.expense.toLocaleString()}</span>
                </div>
                <div className="text-gray-800 font-bold">
                  {(month.income - month.expense).toLocaleString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
