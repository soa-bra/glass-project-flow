

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
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'flex-end',
      gap: '8px',
      flexWrap: 'wrap'
    }}>
      {/* كبسولة التاريخ */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#858789'
      }}>
        {date}
      </div>

      {/* كبسولة المسؤول */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#858789'
      }}>
        {assignee}
      </div>

      {/* كبسولة الأعضاء */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#858789'
      }}>
        {members}
      </div>

      {/* كبسولة الحالة مع النقطة */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '20px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#858789',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: statusColor
        }}></div>
        {status}
      </div>
    </div>
  );
};

export default TaskCardStatusIndicators;

