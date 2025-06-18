
const statusColors = {
  success: '#10b981', // أخضر
  warning: '#f59e0b', // برتقالي  
  error: '#ef4444',   // أحمر
  info: '#3b82f6'     // أزرق
};

const statusLabels = {
  success: 'وفق الخطة',
  warning: 'متوقف', 
  error: 'متأخر',
  info: 'تحت الإعداد'
};

interface ProjectCardStatusIndicatorsProps {
  status: 'success' | 'warning' | 'error' | 'info';
  date: string;
  owner: string;
  value: string;
}

const ProjectCardStatusIndicators = ({
  status,
  date,
  owner,
  value
}: ProjectCardStatusIndicatorsProps) => {
  return (
    <div className="flex items-center justify-between">
      {/* مؤشر الحالة على اليسار */}
      <div className="flex items-center gap-2">
        <div 
          className="w-4 h-4 rounded-full"
          style={{
            backgroundColor: statusColors[status],
            boxShadow: `0 2px 8px ${statusColors[status]}40`
          }}
        />
        <span className="text-sm font-arabic text-gray-700">
          {statusLabels[status]}
        </span>
      </div>

      {/* معلومات المشروع على اليمين */}
      <div className="flex items-center gap-4 text-sm text-gray-600 font-arabic">
        <span className="bg-gray-100 px-3 py-1 rounded-full">{owner}</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">{value}</span>
        <span className="bg-gray-100 px-3 py-1 rounded-full">{date}</span>
      </div>
    </div>
  );
};

export default ProjectCardStatusIndicators;
