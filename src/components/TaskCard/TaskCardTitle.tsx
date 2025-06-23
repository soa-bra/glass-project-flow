
interface TaskCardTitleProps {
  title: string;
  description: string;
}

const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h4 style={{ 
        fontSize: '16px', 
        fontWeight: 700, 
        color: '#000000', 
        marginBottom: '2px',
        lineHeight: 1.3
      }}>
        {title}
      </h4>
      
      <p style={{ 
        fontSize: '12px', 
        fontWeight: 400, 
        color: '#858789',
        marginBottom: '8px',
        lineHeight: 1.3
      }}>
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;
