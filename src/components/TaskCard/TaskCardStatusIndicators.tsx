
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
      justifyContent: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      marginTop: '8px'
    }}>
      {/* كبسولة الحالة مع النقطة */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '15px',
        padding: '3px 8px',
        fontSize: '10px',
        fontWeight: 500,
        color: '#858789',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor
        }}></div>
        {status}
      </div>

      {/* كبسولة التاريخ */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '15px',
        padding: '3px 8px',
        fontSize: '10px',
        fontWeight: 500,
        color: '#858789',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {date}
      </div>

      {/* كبسولة المسؤول */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '15px',
        padding: '3px 8px',
        fontSize: '10px',
        fontWeight: 500,
        color: '#858789',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {assignee}
      </div>

      {/* كبسولة الأعضاء */}
      <div style={{
        backgroundColor: '#F7FFFF',
        borderRadius: '15px',
        padding: '3px 8px',
        fontSize: '10px',
        fontWeight: 500,
        color: '#858789',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {members}
      </div>
    </div>
  );
};

export default TaskCardStatusIndicators;
