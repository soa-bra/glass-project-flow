interface TaskCardFooterSimpleProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  isSelected?: boolean;
}

const TaskCardFooterSimple = ({
  status,
  statusColor,
  date,
  assignee,
  members,
  isSelected: _isSelected,
}: TaskCardFooterSimpleProps) => {
  return (
    <div className="flex items-center justify-between py-0 mx-0 px-[28px] my-[24px]">
      <div 
        style={{
          backgroundColor: statusColor,
          boxShadow: `0 2px 6px ${statusColor}20, 0 0 12px ${statusColor}15`
        }} 
        className="w-[20px] h-[20px] rounded-full my-0 py-0 px-0 mx-0" 
      />

      <div className="flex items-center gap-[3px] flex-1 justify-end mx-0 px-0">
        <div className="bg-white border border-[#DADCE0] rounded-full py-[2px] flex items-center px-[15px]">
          <span className="text-sm font-arabic" style={{ color: 'var(--project-card-elements-secondary-text)' }}>
            {date}
          </span>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-full py-[2px] flex items-center px-[15px]">
          <span className="text-sm font-arabic" style={{ color: 'var(--project-card-elements-secondary-text)' }}>
            {members}
          </span>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-full justify-between flex items-center py-[2px] px-[8px] mx-[5px]">
          <span className="text-sm font-arabic px-[3px]" style={{ color: 'var(--project-card-elements-secondary-text)' }}>
            {assignee}
          </span>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-full py-[2px] px-[21px] flex items-center mr-[14px]">
          <span className="text-sm font-arabic" style={{ color: 'var(--project-card-elements-secondary-text)' }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCardFooterSimple;
