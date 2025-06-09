
const AnalyticsCard = () => {
  // Sample data for progress analytics with colors
  const progressData = [
    { day: 'السبت', progress: 20, color: '#8B5CF6' },
    { day: 'الأحد', progress: 35, color: '#EC4899' },
    { day: 'الاثنين', progress: 45, color: '#06B6D4' },
    { day: 'الثلاثاء', progress: 60, color: '#10B981' },
    { day: 'الأربعاء', progress: 75, color: '#F59E0B' },
    { day: 'الخميس', progress: 85, color: '#EF4444' },
    { day: 'الجمعة', progress: 90, color: '#8B5CF6' },
  ];

  const maxProgress = Math.max(...progressData.map(d => d.progress));

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/60">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
        معدل الإنجاز الأسبوعي
      </h3>
      
      {/* Colorful Bar Chart */}
      <div className="flex items-end justify-between h-40 mb-6 px-4">
        {progressData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div 
                className="w-8 rounded-t-xl transition-all duration-700 ease-out hover:scale-110 shadow-lg"
                style={{ 
                  height: `${(data.progress / maxProgress) * 120}px`,
                  minHeight: '8px',
                  background: `linear-gradient(to top, ${data.color}, ${data.color}99)`
                }}
              />
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  {data.progress}%
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 font-medium transform -rotate-45 origin-center whitespace-nowrap">
              {data.day}
            </span>
          </div>
        ))}
      </div>
      
      {/* Gradient Progress Line */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.round(progressData.reduce((a, b) => a + b.progress, 0) / progressData.length)}%` }}
          />
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">المتوسط</div>
          <div className="text-lg font-bold text-purple-600">
            {Math.round(progressData.reduce((a, b) => a + b.progress, 0) / progressData.length)}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">أعلى إنجاز</div>
          <div className="text-lg font-bold text-green-600">
            {maxProgress}%
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">الاتجاه</div>
          <div className="text-lg font-bold text-blue-600">
            ↗ تصاعدي
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
