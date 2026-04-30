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

      }}
    >
      <div
        className="grid h-full min-h-[88px] grid-cols-[minmax(44px,auto)_minmax(0,1fr)_minmax(44px,auto)] items-start gap-2 sm:min-h-[96px] sm:gap-3 lg:min-h-[100px]"
        style={{
          paddingInline: 'clamp(2px, 1.2vw, 10px)',
        }}
      >
        <div className="flex min-w-0 items-start justify-start">
          <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
        </div>

        <div className="flex min-w-0 items-start justify-end">
          <FeatureTaskCardPriorityCircle priority={priority} />
        </div>
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
