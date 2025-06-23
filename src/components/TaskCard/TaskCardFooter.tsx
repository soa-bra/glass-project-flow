
import TaskCardStatusIndicators from './TaskCardStatusIndicators';

interface TaskCardFooterProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
}

const TaskCardFooter = ({
  status,
  statusColor,
  date,
  assignee,
  members
}: TaskCardFooterProps) => {
  return (
    <TaskCardStatusIndicators 
      status={status}
      statusColor={statusColor}
      date={date}
      assignee={assignee}
      members={members}
    />
  );
};

export default TaskCardFooter;
