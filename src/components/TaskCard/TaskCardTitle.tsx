
interface TaskCardTitleProps {
  title: string;
  description: string;
}

const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return (
    <div>
      <h4 style={{ 
        fontSize: '14px', 
        fontWeight: 700, 
        color: '#000000', 
        marginBottom: '2px',
        lineHeight: 1.2,
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {title}
      </h4>
      
      <p style={{ 
        fontSize: '10px', 
        fontWeight: 400, 
        color: '#858789',
        marginBottom: '0px',
        lineHeight: 1.2,
        fontFamily: 'IBM Plex Sans Arabic'
      }}>
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;
