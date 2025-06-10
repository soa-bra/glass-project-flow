const statusColors = {
  success: '#5DDC82',
  warning: '#ECFF8C',
  error: '#F23D3D',
  info: '#9DCBFF'
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
  return <div className="flex items-center justify-between px-0 mx-0 my-[5px] py-[5px]">
      {/* حالة المشروع - دائرة ملونة */}
      <div style={{
      backgroundColor: statusColors[status],
      boxShadow: `0 4px 8px ${statusColors[status]}30`
    }} className="w-[15px] h-[15px] rounded-full px-0 mx-[75px]" />

      {/* التاريخ */}
      <div className="bg-white/60 backdrop-blur-sm rounded-full py-0 mx-[2px] px-[21px]">
        <span className="text-sm font-arabic text-gray-700">
          {date}
        </span>
      </div>

      {/* المكلف */}
      <div className="bg-white/60 backdrop-blur-sm rounded-full py-0 px-0 mx-[2px]">
        <span className="text-sm font-arabic mx-[20px] px-px text-gray-700">
          {owner}
        </span>
      </div>

      {/* القيمة */}
      <div className="bg-white/60 backdrop-blur-sm rounded-full my-0 py-0 mx-[2px] px-[21px]">
        <span className="text-sm font-arabic text-gray-700">
          {value}
        </span>
      </div>
    </div>;
};
export default ProjectCardStatusIndicators;