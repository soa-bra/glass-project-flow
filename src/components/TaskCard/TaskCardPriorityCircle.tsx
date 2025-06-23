
interface TaskCardPriorityCircleProps {
  priority: string;
}

const TaskCardPriorityCircle = ({
  priority
}: TaskCardPriorityCircleProps) => {
  const getPriorityBubbleStyle = (priority: string) => {
    switch (priority) {
      case 'urgent-important':
        return { backgroundColor: '#F2F9FB' };
      case 'urgent-not-important':
        return { backgroundColor: '#A4E2F6' };
      case 'not-urgent-important':
        return { backgroundColor: '#FBE2AA' };
      case 'not-urgent-not-important':
        return { backgroundColor: '#D9D2FD' };
      default:
        return { backgroundColor: '#F2F9FB' };
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent-important':
        return { line1: 'عاجل', line2: 'مهم' };
      case 'urgent-not-important':
        return { line1: 'عاجل', line2: 'غير مهم' };
      case 'not-urgent-important':
        return { line1: 'غير عاجل', line2: 'مهم' };
      case 'not-urgent-not-important':
        return { line1: 'غير عاجل', line2: 'غير مهم' };
      default:
        return { line1: 'عاجل', line2: 'مهم' };
    }
  };

  return (
    <div 
      style={{
        position: 'absolute',
        top: '24px',
        right: '24px',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        ...getPriorityBubbleStyle(priority),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 600, color: '#000000', lineHeight: 1 }}>
        {getPriorityText(priority).line1}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 400, color: '#000000', marginTop: '2px' }}>
        {getPriorityText(priority).line2}
      </span>
    </div>
  );
};

export default TaskCardPriorityCircle;
