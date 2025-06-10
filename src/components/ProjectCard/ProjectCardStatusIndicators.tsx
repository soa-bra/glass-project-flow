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
  return <div className="flex items-center justify-between px-0 mx-0 py-0 my-[10px]">
      {/* دائرة حالة المشروع - على الجانب الأيسر الآن */}
      <div style={{
      backgroundColor: statusColors[status],
      boxShadow: `0 2px 6px ${statusColors[status]}20, 0 0 12px ${statusColors[status]}15`
    }} className="w-[20px] h-[20px] rounded-full my-0 py-0 px-0 mx-[10px]" />

      {/* التاريخ + المالك + القيمة - على الجانب الأيمن الآن */}
      <div className="flex items-center gap-[2px] flex-1 justify-end px-0 mx-0">
        {/* التاريخ */}
        <div className="rounded-full py-0 px-[21px]" style={{
        backgroundColor: '#E3E3E3'
      }}>
          <span className="text-sm font-arabic text-gray-700">
            {date}
          </span>
        </div>

        {/* المالك - بدون هالة */}
        <div style={{
        backgroundColor: '#E3E3E3'
      }} className="rounded-full py-0 mx-[15px] px-[25px]">
          <span className="text-sm font-arabic text-gray-700 px-[3px]">
            {owner}
          </span>
        </div>

        {/* القيمة */}
        <div className="rounded-full py-0 px-[21px]" style={{
        backgroundColor: '#E3E3E3'
      }}>
          <span className="text-sm font-arabic text-gray-700">
            {value}
          </span>
        </div>
      </div>
    </div>;
};
export default ProjectCardStatusIndicators;