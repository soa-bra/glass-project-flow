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
      className="h-full min-h-[96px] sm:min-h-[104px] lg:min-h-[112px]"
      style={{
        paddingTop: 'clamp(8px, 1.8vw, 14px)',
        paddingInline: 'clamp(6px, 2.4vw, 14px)',
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

        <div className="flex h-full min-w-0 items-start justify-center overflow-hidden pt-1">
          <FeatureTaskCardTitle title={title} description={description} />
        </div>

        <div className="flex min-w-0 items-start justify-end">
          <FeatureTaskCardPriorityCircle priority={priority} />
        </div>
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
