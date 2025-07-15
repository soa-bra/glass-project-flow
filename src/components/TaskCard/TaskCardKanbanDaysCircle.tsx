interface TaskCardKanbanDaysCircleProps {
  daysLeft: number;
}

const TaskCardKanbanDaysCircle = ({ daysLeft }: TaskCardKanbanDaysCircleProps) => {
  return (
    <div style={{
      position: 'absolute',
      top: '0px',
      left: '0px',
      width: '15px',
      height: '15px',
      borderRadius: '50%',
      border: '0.5px solid #000000',
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <span style={{
        fontSize: '4px',
        fontWeight: 700,
        color: '#000000',
        lineHeight: 1,
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span style={{
        fontSize: '2.5px',
        fontWeight: 400,
        color: '#000000',
        marginTop: '0.5px',
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        يوم
      </span>
    </div>
  );
};

export default TaskCardKanbanDaysCircle;