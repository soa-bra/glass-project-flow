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
  const capsuleTextClass = 'text-[12px] leading-[18px] font-normal font-arabic whitespace-nowrap overflow-hidden text-ellipsis';
  const capsuleTextStyle = { color: 'var(--project-card-elements-secondary-text)' };

  return (
    <div className="flex items-center justify-between py-0 mx-0 px-[28px] my-[24px] gap-[12px]" dir="ltr">
      <div 
        style={{
          backgroundColor: statusColor,
          boxShadow: `0 2px 6px ${statusColor}20, 0 0 12px ${statusColor}15`
        }} 
        className="w-[20px] h-[20px] rounded-full my-0 py-0 px-0 mx-0 flex-none" 
      />

      <div className="flex items-center gap-[3px] flex-1 justify-end mx-0 px-0 min-w-0 overflow-hidden" dir="rtl">
        <div className="bg-white border border-[#DADCE0] rounded-full py-[2px] flex items-center px-[15px] flex-none min-w-0 max-w-[92px]">
          <span className={capsuleTextClass} style={capsuleTextStyle}>
            {date}
          </span>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-full py-[2px] flex items-center px-[15px] flex-none min-w-0 max-w-[82px]">
          <span className={capsuleTextClass} style={capsuleTextStyle}>
            {members}
          </span>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-full justify-between flex items-center py-[2px] px-[8px] mx-[5px] flex-none min-w-0 max-w-[92px]">
          <span className={`${capsuleTextClass} px-[3px]`} style={capsuleTextStyle}>
            {assignee}
          </span>
        </div>

        <div className="bg-white border border-[#DADCE0] rounded-full py-[2px] px-[21px] flex items-center mr-[14px] flex-none min-w-0 max-w-[96px]">
          <span className={capsuleTextClass} style={capsuleTextStyle}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCardFooterSimple;
