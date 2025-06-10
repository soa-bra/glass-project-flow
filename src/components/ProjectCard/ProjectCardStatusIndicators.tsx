
const statusColors = {
  success: '#00bb88',
  warning: '#ffb500',
  error: '#f4767f',
  info: '#2f6ead'
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
    <div className="flex items-center justify-between px-0 mx-0 my-[5px] py-[5px]">
      {/* القيمة + المالك + التاريخ - بمحاذاة دائرة المهام */}
      <div className="flex items-center gap-[1px] flex-1">
        {/* القيمة */}
        <div className="rounded-full py-0 px-[21px]" style={{ backgroundColor: '#E3E3E3' }}>
          <span className="text-sm font-arabic text-gray-700">
            {value}
          </span>
        </div>

        {/* المالك */}
        <div className="rounded-full py-0 px-[20px]" style={{ backgroundColor: '#E3E3E3' }}>
          <span className="text-sm font-arabic text-gray-700">
            {owner}
          </span>
        </div>

        {/* التاريخ */}
        <div className="rounded-full py-0 px-[21px]" style={{ backgroundColor: '#E3E3E3' }}>
          <span className="text-sm font-arabic text-gray-700">
            {date}
          </span>
        </div>
      </div>

      {/* دائرة حالة المشروع - على الطرف الآخر */}
      <div 
        style={{
          backgroundColor: statusColors[status],
          boxShadow: `0 4px 8px ${statusColors[status]}30`
        }} 
        className="w-[15px] h-[15px] rounded-full"
      />
    </div>
  );
};

export default ProjectCardStatusIndicators;
