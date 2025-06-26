
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
    borderRadius: '15px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: 500,
    color: '#858789',
    fontFamily: 'IBM Plex Sans Arabic'
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '6px',
      flexWrap: 'wrap',
      marginTop: '8px'
    }}>
      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: statusColor
        }}></div>
        {status}
      </div>

      <div style={pillStyle}>{date}</div>
      <div style={pillStyle}>{assignee}</div>
      <div style={pillStyle}>{members}</div>
      
      {/* الكبسولة الجديدة بثلاث نقاط */}
      <div style={{
        ...pillStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        padding: '0'
      }}>
        <div style={{
          display: 'flex',
          gap: '2px',
          alignItems: 'center'
        }}>
          <div style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: '#858789'
          }}></div>
          <div style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: '#858789'
          }}></div>
          <div style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: '#858789'
          }}></div>
        </div>
      </div>
    </div>
  );
};

export default TaskCardStatusIndicators;
