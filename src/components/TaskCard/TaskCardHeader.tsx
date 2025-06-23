
import TaskCardDaysCircle from './TaskCardDaysCircle';
import TaskCardTitle from './TaskCardTitle';
import TaskCardPriorityCircle from './TaskCardPriorityCircle';

interface TaskCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  priority: string;
}

const TaskCardHeader = ({
  daysLeft,
  title,
  description,
  priority
}: TaskCardHeaderProps) => {
  return (
    <>
      <TaskCardDaysCircle daysLeft={daysLeft} />
      <TaskCardPriorityCircle priority={priority} />
      <TaskCardTitle title={title} description={description} />
    </>
  );
};

export default TaskCardHeader;
