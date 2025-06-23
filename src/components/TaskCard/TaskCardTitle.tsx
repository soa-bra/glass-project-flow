
interface TaskCardTitleProps {
  title: string;
  description: string;
}

const TaskCardTitle = ({
  title,
  description
}: TaskCardTitleProps) => {
  return (
    <div style={{ marginTop: '16px', textAlign: 'right' }}>
      <h4 style={{ 
        fontSize: '24px', 
        fontWeight: 700, 
        color: '#000000', 
        marginBottom: '8px',
        lineHeight: 1.2
      }}>
        {title}
      </h4>
      
      <p style={{ 
        fontSize: '16px', 
        fontWeight: 400, 
        color: '#858789',
        marginBottom: '24px',
        lineHeight: 1.2
      }}>
        {description}
      </p>
    </div>
  );
};

export default TaskCardTitle;
