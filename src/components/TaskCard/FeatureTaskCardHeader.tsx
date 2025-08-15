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
  return <div className="relative flex-1">
      <FeatureTaskCardDaysCircle daysLeft={daysLeft} />
      <FeatureTaskCardPriorityCircle priority={priority} />
      <div style={{
      marginTop: '0px',
      marginLeft: '55px',
      marginRight: '55px',
      textAlign: 'center',
      paddingTop: '4px'
    }} className="px-0 mx-[67px] my-[5px] py-0">
        <FeatureTaskCardTitle title={title} description={description} />
      </div>
    </div>;
};
export default FeatureTaskCardHeader;