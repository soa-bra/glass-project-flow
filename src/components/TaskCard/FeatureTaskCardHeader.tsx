import FeatureTaskCardDaysCircle from './FeatureTaskCardDaysCircle';
import FeatureTaskCardTitle from './FeatureTaskCardTitle';
import FeatureTaskCardPriorityCircle from './FeatureTaskCardPriorityCircle';

interface FeatureTaskCardHeaderProps {
  daysLeft: number;
  title: string;
  description: string;
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important';
}

const FeatureTaskCardHeader = ({
  daysLeft,
  title,
  description,
  priority
}: FeatureTaskCardHeaderProps) => {
  return (
    <div className="h-full min-h-0 w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-2 sm:gap-x-3">
      <div className="flex items-start justify-start min-w-0">
        <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
      </div>

      <div className="min-w-0 h-full flex items-center justify-center overflow-hidden">
        <FeatureTaskCardTitle title={title} description={description} />
      </div>

      <div className="flex items-start justify-end min-w-0">
        <FeatureTaskCardPriorityCircle priority={priority} />
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
