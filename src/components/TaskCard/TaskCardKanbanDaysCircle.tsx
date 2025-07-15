interface TaskCardKanbanDaysCircleProps {
  daysLeft: number;
}

const TaskCardKanbanDaysCircle = ({ daysLeft }: TaskCardKanbanDaysCircleProps) => {
  return (
    <div style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      border: '1px solid #000000',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span style={{
        fontSize: '8px',
        fontWeight: 700,
        color: '#000000',
        lineHeight: 1,
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span style={{
        fontSize: '5px',
        fontWeight: 400,
        color: '#000000',
        marginTop: '1px',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        يوم
      </span>
    </div>
  );
};

export default TaskCardKanbanDaysCircle;