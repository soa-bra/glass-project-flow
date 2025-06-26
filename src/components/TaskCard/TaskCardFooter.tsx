
import TaskCardStatusIndicators from './TaskCardStatusIndicators';

interface TaskCardFooterProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  taskId: string;
  onSelect?: (taskId: string) => void;
  onEdit?: (taskId: string) => void;
  onArchive?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCardFooter = ({
  status,
  statusColor,
  date,
  assignee,
  members,
  taskId,
  onSelect,
  onEdit,
  onArchive,
  onDelete
}: TaskCardFooterProps) => {
  return (
    <TaskCardStatusIndicators 
      status={status}
      statusColor={statusColor}
      date={date}
      assignee={assignee}
      members={members}
      taskId={taskId}
      onSelect={onSelect}
      onEdit={onEdit}
      onArchive={onArchive}
      onDelete={onDelete}
    />
  );
};

export default TaskCardFooter;
