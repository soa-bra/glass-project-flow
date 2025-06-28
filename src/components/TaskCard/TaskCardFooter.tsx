
import TaskCardStatusIndicators from './TaskCardStatusIndicators';
import type { TaskData } from '@/types';

interface TaskCardFooterProps {
  status: string;
  statusColor: string;
  date: string;
  assignee: string;
  members: string;
  taskId: string;
  taskData?: TaskData;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect?: (taskId: string) => void;
  onEdit?: (taskId: string, taskData?: TaskData) => void;
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
  taskData,
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
      taskData={taskData}
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
