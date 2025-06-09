
const AnalyticsCard = () => {
  // Sample data for progress analytics
  const progressData = [
    { day: 'السبت', progress: 20 },
    { day: 'الأحد', progress: 35 },
    { day: 'الاثنين', progress: 45 },
    { day: 'الثلاثاء', progress: 60 },
    { day: 'الأربعاء', progress: 75 },
    { day: 'الخميس', progress: 85 },
    { day: 'الجمعة', progress: 90 },
  ];

  const maxProgress = Math.max(...progressData.map(d => d.progress));

  return (
    <div className="glass rounded-lg p-6">
      <h3 className="text-xl font-medium text-soabra-text-primary mb-4">
        معدل الإنجاز الأسبوعي
      </h3>
      
      {/* Simple Bar Chart */}
      <div className="flex items-end justify-between h-32 mb-4">
        {progressData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="relative">
              <div 
                className="w-6 bg-soabra-primary-blue rounded-t-sm transition-all duration-500"
                style={{ 
                  height: `${(data.progress / maxProgress) * 100}px`,
                  minHeight: '4px'
                }}
              />
            </div>
            <span className="text-xs text-soabra-text-secondary transform -rotate-45 origin-center">
              {data.day.slice(0, 2)}
            </span>
          </div>
        ))}
      </div>
      
      {/* Summary Values */}
      <div className="grid grid-cols-3 gap-4 text-sm text-center">
        <div>
          <div className="text-soabra-text-secondary">المتوسط</div>
          <div className="font-semibold text-soabra-text-primary">
            {Math.round(progressData.reduce((a, b) => a + b.progress, 0) / progressData.length)}%
          </div>
        </div>
        <div>
          <div className="text-soabra-text-secondary">أعلى إنجاز</div>
          <div className="font-semibold text-soabra-text-primary">
            {maxProgress}%
          </div>
        </div>
        <div>
          <div className="text-soabra-text-secondary">الاتجاه</div>
          <div className="font-semibold text-green-600">
            ↗ تصاعدي
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCard;
