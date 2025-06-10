
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
      {/* التاريخ */}
      <div className="rounded-full py-0 mx-[2px] px-[21px]" style={{ backgroundColor: '#E3E3E3' }}>
        <span className="text-sm font-arabic text-gray-700">
          {date}
        </span>
      </div>

      {/* المكلف */}
      <div className="rounded-full py-0 px-0 mx-[2px]" style={{ backgroundColor: '#E3E3E3' }}>
        <span className="text-sm font-arabic mx-[20px] px-px text-gray-700">
          {owner}
        </span>
      </div>

      {/* القيمة */}
      <div className="rounded-full my-0 py-0 mx-[2px] px-[21px]" style={{ backgroundColor: '#E3E3E3' }}>
        <span className="text-sm font-arabic text-gray-700">
          {value}
        </span>
      </div>
    </div>
  );
};

export default ProjectCardStatusIndicators;
