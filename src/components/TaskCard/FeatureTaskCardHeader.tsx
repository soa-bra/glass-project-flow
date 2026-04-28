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
      className="grid h-full min-h-[84px] grid-cols-[minmax(44px,auto)_minmax(0,1fr)_minmax(44px,auto)] items-start gap-[clamp(0.375rem,1.2vw,0.75rem)] pt-[clamp(0.5rem,1.7vw,0.75rem)] sm:min-h-[92px] lg:min-h-[96px]"
      style={{
        paddingInline: 'clamp(0.4rem, 2.2vw, 0.9rem)',
      }}
    >
      <div className="flex min-w-0 items-start justify-start">
        <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
      </div>

      <div className="flex h-full min-w-0 items-start justify-center overflow-hidden pt-[clamp(0.125rem,0.5vw,0.25rem)]">
        <FeatureTaskCardTitle title={title} description={description} />
      </div>

      <div className="flex min-w-0 items-start justify-end">
        <FeatureTaskCardPriorityCircle priority={priority} />
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
