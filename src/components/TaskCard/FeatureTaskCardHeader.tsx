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
    <div className="min-h-[96px] w-full overflow-hidden pt-1" dir="rtl">
      <div className="grid w-full min-h-[96px] grid-cols-[minmax(44px,auto)_minmax(0,1fr)_minmax(44px,auto)] items-center gap-2">
        <div className="min-w-0 flex justify-center">
          <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
        </div>

        <div className="min-w-0 overflow-hidden">
          <FeatureTaskCardTitle title={title} description={description} />
        </div>

        <div className="min-w-0 flex justify-center">
          <FeatureTaskCardPriorityCircle priority={priority} />
        </div>
      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
