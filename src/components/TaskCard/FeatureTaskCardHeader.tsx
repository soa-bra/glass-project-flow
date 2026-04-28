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
    <div
      className="grid h-full min-h-[84px] grid-cols-[minmax(44px,auto)_minmax(0,1fr)_minmax(44px,auto)] items-start gap-2 px-1.5 pt-2 sm:min-h-[92px] sm:gap-3 sm:px-2 sm:pt-2.5 lg:min-h-[96px]"
      style={{
        paddingInline: 'clamp(6px, 2.2vw, 14px)',
      }}
    >
      <div className="flex min-w-0 items-start justify-start">
        <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
      </div>

      <div className="flex h-full min-w-0 items-start justify-center overflow-hidden pt-1">
        <FeatureTaskCardTitle title={title} description={description} />
      </div>

      <div className="flex min-w-0 items-start justify-end">
        <FeatureTaskCardPriorityCircle priority={priority} />
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
