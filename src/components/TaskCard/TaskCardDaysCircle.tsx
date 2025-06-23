
interface TaskCardDaysCircleProps {
  daysLeft: number;
}

const TaskCardDaysCircle = ({
  daysLeft
}: TaskCardDaysCircleProps) => {
  return (
    <div 
      style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        width: '75px',
        height: '75px',
        borderRadius: '50%',
        border: '2px solid #000000',
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span style={{ fontSize: '20px', fontWeight: 700, color: '#000000', lineHeight: 1 }}>
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 400, color: '#000000', marginTop: '4px' }}>
        يوم
      </span>
    </div>
  );
};

export default TaskCardDaysCircle;
