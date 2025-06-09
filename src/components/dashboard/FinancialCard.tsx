
const FinancialCard = () => {
  const budgetAllocated = 100000;
  const currentExpenses = 65000;
  const remaining = budgetAllocated - currentExpenses;
  
  // Calculate percentages
  const expensePercentage = (currentExpenses / budgetAllocated) * 100;
  const remainingPercentage = (remaining / budgetAllocated) * 100;
  
  // SVG circle calculations for donut chart
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const expenseOffset = circumference - (expensePercentage / 100) * circumference;
  const remainingOffset = circumference - (remainingPercentage / 100) * circumference;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60">
      <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        البيانات المالية للمشروع
      </h3>
      
      {/* Large Circular Budget Chart */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="12"
            />
            
            {/* Expenses arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#EF4444"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={expenseOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Remaining budget arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#10B981"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={remainingOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                strokeDasharray: `${(remainingPercentage / 100) * circumference} ${circumference}`,
                strokeDashoffset: -((expensePercentage / 100) * circumference),
              }}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-800">
              {Math.round(remainingPercentage)}%
            </div>
            <div className="text-sm text-gray-600 font-medium">
              متبقي
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Breakdown */}
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
          <div className="text-xs text-gray-600 mb-1">الميزانية الكلية</div>
          <div className="text-lg font-bold text-gray-800">
            {budgetAllocated.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">ريال سعودي</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4">
          <div className="text-xs text-gray-600 mb-1">المصروفات</div>
          <div className="text-lg font-bold text-red-600">
            {currentExpenses.toLocaleString()}
          </div>
          <div className="text-xs text-red-500">{Math.round(expensePercentage)}%</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
          <div className="text-xs text-gray-600 mb-1">المتبقي</div>
          <div className="text-lg font-bold text-green-600">
            {remaining.toLocaleString()}
          </div>
          <div className="text-xs text-green-500">{Math.round(remainingPercentage)}%</div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">مصروفات</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">متبقي</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialCard;
