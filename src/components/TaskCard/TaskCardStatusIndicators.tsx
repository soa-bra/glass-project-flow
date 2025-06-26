
interface TaskCardStatusIndicatorsProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
}

const TaskCardStatusIndicators = ({
  status,
  statusColor,
  date,
  assignee,
  members
}: TaskCardStatusIndicatorsProps) => {
  const pillStyle = {
    backgroundColor: '#F7FFFF',
    borderRadius: '30px',
    padding: '2px 8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic'
  };

  return (
    <div className="flex items-center justify-between py-0 mx-0 px-[28px] my-[24px]">
      {/* دائرة حالة المهمة - على الجانب الأيسر */}
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: statusColor
      }}></div>

      {/* التاريخ + المسؤول + الأعضاء - محاذاة إلى اليمين */}
      <div className="flex items-center gap-[3px] flex-1 justify-end mx-0 px-0">
        {/* التاريخ */}
        <div style={pillStyle}>
          {date}
        </div>

        {/* المسؤول */}
        <div style={{
          ...pillStyle,
          margin: '0 5px'
        }}>
          {assignee}
        </div>

        {/* الأعضاء */}
        <div style={{
          ...pillStyle,
          marginRight: '14px'
        }}>
          {members}
        </div>
      </div>
    </div>
  );
};

export default TaskCardStatusIndicators;
