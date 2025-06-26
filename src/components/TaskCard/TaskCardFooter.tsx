
import TaskCardStatusIndicators from './TaskCardStatusIndicators';

interface TaskCardFooterProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  taskId: string;
  isSelected?: boolean;
  isSelectionMode?: boolean;
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
  isSelected = false,
  isSelectionMode = false,
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
      isSelected={isSelected}
      isSelectionMode={isSelectionMode}
      onSelect={onSelect}
      onEdit={onEdit}
      onArchive={onArchive}
      onDelete={onDelete}
    />
  );
};

export default TaskCardFooter;
