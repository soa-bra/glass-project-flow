

interface TaskCardTitleProps {
  title: string;
  description: string;
}

const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return (
    <div style={{ marginTop: '12px', textAlign: 'right' }}>
      <h4 style={{ 
        fontSize: '18px', 
        fontWeight: 700, 
        color: '#000000', 
        marginBottom: '4px',
        lineHeight: 1.2
      }}>
        {title}
      </h4>
      
      <p style={{ 
        fontSize: '14px', 
        fontWeight: 400, 
        color: '#858789',
        marginBottom: '16px',
        lineHeight: 1.2
      }}>
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;

