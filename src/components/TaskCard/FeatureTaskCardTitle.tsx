import { taskCardSizeTokens } from './taskCardSizeTokens';

interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}
const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  return <div className="px-0" style={{
    margin: `${taskCardSizeTokens.titleOuterMarginBlock} ${taskCardSizeTokens.titleOuterMarginInline}`,
    minWidth: 0
  }}>
      <h4 style={{
      fontSize: taskCardSizeTokens.titleFontSize,
      fontWeight: 700,
      color: '#000000',
      marginBottom: '2px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic',
      marginInline: taskCardSizeTokens.titleInnerMarginInline,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }} className="text-right font-bold my-0">
        {title}
      </h4>
      
      <p style={{
      fontSize: taskCardSizeTokens.descriptionFontSize,
      fontWeight: 400,
      color: '#858789',
      marginBottom: '0px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic',
      marginInline: taskCardSizeTokens.titleInnerMarginInline,
      marginTop: '3px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }} className="text-right font-normal text-gray-600">
        {description}
      </p>
    </div>;
};
export default FeatureTaskCardTitle;
