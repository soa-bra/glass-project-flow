
/add-size-tokens-for-card-elements

import

 { useTaskCardSizeTokens } from './taskCa

rdSizeTokens';

interface FeatureTaskCardDaysCircleProps {
  daysLeft: number;
}

const FeatureTaskCardDaysCircle = ({ daysLeft }: FeatureTaskCardDaysCircleProps) => {
  const tokens = useTaskCardSizeTokens();

  return (

-size-tokens-for-card-elements
    <div style=

        يوم
      </span>
    </div>
  );
};

export default FeatureTaskCardDaysCircle;
