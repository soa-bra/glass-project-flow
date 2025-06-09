
const AnalyticsCard = () => {
  // Sample data for progress analytics with enhanced styling
  const progressData = [
    { day: 'السبت', progress: 20, color: '#3B82F6' },
    { day: 'الأحد', progress: 35, color: '#8B5CF6' },
    { day: 'الاثنين', progress: 45, color: '#06B6D4' },
    { day: 'الثلاثاء', progress: 60, color: '#10B981' },
    { day: 'الأربعاء', progress: 75, color: '#F59E0B' },
    { day: 'الخميس', progress: 85, color: '#EF4444' },
    { day: 'الجمعة', progress: 90, color: '#8B5CF6' },
  ];

  const maxProgress = Math.max(...progressData.map(d => d.progress));
  const avgProgress = Math.round(progressData.reduce((a, b) => a + b.progress, 0) / progressData.length);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          معدل الإنجاز الأسبوعي
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          <span className="text-sm text-gray-600">تقدم المشاريع</span>
        </div>
      </div>
      
      {/* Enhanced Bar Chart */}
      <div className="flex items-end justify-between h-48 mb-6 px-2">
        {progressData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-3 group">
            <div className="relative">
              <div 
                className="w-10 rounded-t-xl transition-all duration-700 ease-out hover:scale-110 shadow-lg border-b-4 border-white"
                style={{ 
                  height: `${(data.progress / maxProgress) * 140}px`,
                  minHeight: '12px',
                  background: `linear-gradient(to top, ${data.color}20, ${data.color})`
                }}
              />
              {/* Enhanced Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
                <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{data.progress}%</div>
                  <div className="text-gray-300">{data.day}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
              {data.day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Enhanced Progress Overview */}
      <div className="mb-6 bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">المتوسط الأسبوعي</span>
          <span className="text-lg font-bold text-gray-800">{avgProgress}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>
      
      {/* Enhanced Summary Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border border-blue-200">
          <div className="text-xs text-gray-600 mb-1">المتوسط</div>
          <div className="text-xl font-bold text-blue-600">
            {avgProgress}%
          </div>
          <div className="text-xs text-blue-500 mt-1">↗ +5%</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border border-green-200">
          <div className="text-xs text-gray-600 mb-1">أعلى إنجاز</div>
          <div className="text-xl font-bold text-green-600">
            {maxProgress}%
          </div>
          <div className="text-xs text-green-500 mt-1">الجمعة</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border border-purple-200">
          <div className="text-xs text-gray-600 mb-1">الاتجاه</div>
          <div className="text-xl font-bold text-purple-600">
            تصاعدي
          </div>
          <div className="text-xs text-purple-500 mt-1">↗ إيجابي</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
