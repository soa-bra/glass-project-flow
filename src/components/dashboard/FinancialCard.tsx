
const FinancialCard = () => {
  const budgetAllocated = 100000;
  const currentExpenses = 45000;
  const remaining = budgetAllocated - currentExpenses;
  
  // Calculate percentages for the bar chart
  const expensePercentage = (currentExpenses / budgetAllocated) * 100;
  const remainingPercentage = (remaining / budgetAllocated) * 100;

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-xl font-medium text-soabra-text-primary mb-4">
        البيانات المالية
      </h3>
      
      {/* Double Bar Chart */}
      <div className="mb-4">
        <div className="flex h-5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="bg-soabra-primary-blue transition-all duration-500"
            style={{ width: `${expensePercentage}%` }}
          />
          <div 
            className="bg-soabra-success transition-all duration-500"
            style={{ width: `${remainingPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Financial Values */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="text-soabra-text-secondary">الميزانية</div>
          <div className="font-semibold text-soabra-text-primary">
            {budgetAllocated.toLocaleString()} ر.س.
          </div>
        </div>
        <div className="text-center">
          <div className="text-soabra-text-secondary">المصروفات</div>
          <div className="font-semibold text-soabra-text-primary">
            {currentExpenses.toLocaleString()} ر.س.
          </div>
        </div>
        <div className="text-center">
          <div className="text-soabra-text-secondary">المتبقي</div>
          <div className="font-semibold text-soabra-text-primary">
            {remaining.toLocaleString()} ر.س.
          </div>
        </div>
      </div>
      
      {/* Details Button */}
      <div className="mt-4 text-center">
        <button className="btn-primary px-4 py-2 rounded-md text-sm hover:scale-105 transition-transform">
          التفاصيل
        </button>
      </div>
    </div>
  );
};

export default FinancialCard;
