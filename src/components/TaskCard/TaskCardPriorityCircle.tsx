interface TaskCardPriorityCircleProps {
  priority: string;
}
const TaskCardPriorityCircle = ({
  priority
}: TaskCardPriorityCircleProps) => {
  const getPriorityConfig = (priority: string) => {
    const configs = {
      'urgent-important': {
        bg: '#f1b5b9',
        line1: 'عاجل',
        line2: 'مهم'
      },
      'urgent-not-important': {
        bg: '#A4E2F6',
        line1: 'عاجل',
        line2: 'غير مهم'
      },
      'not-urgent-important': {
        bg: '#FBE2AA',
        line1: 'غير عاجل',
        line2: 'مهم'
      },
      'not-urgent-not-important': {
        bg: '#D9D2FD',
        line1: 'غير عاجل',
        line2: 'غير مهم'
      }
    };
    return configs[priority as keyof typeof configs] || configs['urgent-important'];
  };
  const config = getPriorityConfig(priority);
  return <div style={{
    position: 'absolute',
    top: '0px',
    right: '0px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: config.bg,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
      <span style={{
      fontSize: '10px',
      fontWeight: 600,
      color: '#000000',
      lineHeight: 1,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-xs font-bold">
        {config.line1}
      </span>
      <span style={{
      fontSize: '8px',
      fontWeight: 400,
      color: '#000000',
      marginTop: '1px',
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-xs">
        {config.line2}
      </span>
    </div>;
};
export default TaskCardPriorityCircle;