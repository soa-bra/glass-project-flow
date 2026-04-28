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
    <div className="h-full min-h-0 w-full flex items-start gap-2 sm:gap-3">
      <div className="basis-11 sm:basis-12 lg:basis-[52px] shrink-0 flex items-start justify-start">
        <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
      </div>

      <div className="flex-1 min-w-0 h-full flex items-center justify-center overflow-hidden">
        <FeatureTaskCardTitle title={title} description={description} />
      </div>

      <div className="basis-11 sm:basis-12 lg:basis-[52px] shrink-0 flex items-start justify-end">
        <FeatureTaskCardPriorityCircle priority={priority} />
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
