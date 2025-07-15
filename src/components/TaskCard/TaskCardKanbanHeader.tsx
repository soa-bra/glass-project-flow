import TaskCardKanbanDaysCircle from './TaskCardKanbanDaysCircle';
import TaskCardKanbanTitle from './TaskCardKanbanTitle';
import TaskCardKanbanPriorityCircle from './TaskCardKanbanPriorityCircle';

interface TaskCardKanbanHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

const TaskCardKanbanHeader = ({
  daysLeft,
  title,
  description,
  priority
}: TaskCardKanbanHeaderProps) => {
  return (
    <div className="relative flex-1">
      <TaskCardKanbanDaysCircle daysLeft={daysLeft} />
      <TaskCardKanbanPriorityCircle priority={priority} />
      <div style={{
        marginTop: '0px',
        marginLeft: '15px',
        marginRight: '15px',
        textAlign: 'center',
        paddingTop: '1px'
      }}>
        <TaskCardKanbanTitle title={title} description={description} />
      </div>
    </div>
  );
};

export default TaskCardKanbanHeader;