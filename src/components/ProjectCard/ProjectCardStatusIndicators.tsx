
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
      {/* دائرة حالة المشروع - على الجانب الأيسر الآن */}
      <div 
        style={{
          backgroundColor: statusColors[status],
          boxShadow: `0 4px 8px ${statusColors[status]}30`
        }} 
        className="w-[32px] h-[32px] rounded-full"
      />

      {/* القيمة + المالك + التاريخ - على الجانب الأيمن الآن */}
      <div className="flex items-center gap-[1px] flex-1 justify-end">
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
    </div>
  );
};

export default ProjectCardStatusIndicators;
