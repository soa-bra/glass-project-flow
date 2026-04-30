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

      </div>
    </div>
  );
};

export default FeatureTaskCardHeader;
