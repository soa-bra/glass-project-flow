
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
    <div
      className="flex items-center justify-between py-0 mx-0 px-[28px] my-[24px] w-full"
      style={{
        direction: "rtl",
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        textAlign: "right"
      }}
    >
      {/* دائرة حالة المشروع - على أقصى اليمين */}
      <div
        style={{
          backgroundColor: statusColors[status],
          boxShadow: `0 2px 6px ${statusColors[status]}20, 0 0 12px ${statusColors[status]}15`
        }}
        className="w-[20px] h-[20px] rounded-full my-0 py-0 px-0 mx-0 flex-shrink-0"
      />

      {/* التاريخ + المالك + القيمة - محاذاة إلى اليمين */}
      <div className="flex items-center gap-[3px] flex-1 justify-end mx-0 px-0 flex-row-reverse">
        {/* التاريخ */}
        <div
          style={{
            backgroundColor: '#E3E3E3'
          }}
          className="rounded-full py-[2px] flex items-center px-[15px] ml-1"
        >
          <span className="text-sm font-arabic text-gray-700">
            {date}
          </span>
        </div>

        {/* المالك */}
        <div
          style={{
            backgroundColor: '#E3E3E3'
          }}
          className="rounded-full flex items-center py-[2px] px-[8px] mx-[5px]"
        >
          <span className="text-sm font-arabic text-gray-700 px-[3px]">
            {owner}
          </span>
        </div>

        {/* القيمة */}
        <div
          className="rounded-full py-[2px] px-[21px] flex items-center mr-[14px]"
          style={{
            backgroundColor: '#E3E3E3'
          }}
        >
          <span className="text-sm font-arabic text-gray-700">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardStatusIndicators;
