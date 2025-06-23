
import TaskCardDaysCircle from './TaskCardDaysCircle';
import TaskCardTitle from './TaskCardTitle';
import TaskCardPriorityCircle from './TaskCardPriorityCircle';

interface TaskCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

const TaskCardHeader = ({
  daysLeft,
  title,
  description,
  priority
}: TaskCardHeaderProps) => {
  return (
    <div className="relative mb-3">
      <TaskCardDaysCircle daysLeft={daysLeft} />
      <TaskCardPriorityCircle priority={priority} />
      <div style={{ marginTop: '8px', marginLeft: '90px', marginRight: '90px' }}>
        <TaskCardTitle title={title} description={description} />
      </div>
    </div>
  );
};

export default TaskCardHeader;
