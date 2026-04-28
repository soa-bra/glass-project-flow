import { useTaskCardSizeTokens } from './taskCardSizeTokens';

interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}
const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  const tokens = useTaskCardSizeTokens();

  return <div className="px-0" style={{
    margin: `${tokens.titleOuterMarginBlockPx} ${tokens.titleOuterMarginInlinePx}`,
    minWidth: 0
  }}>
      <h4 style={{
      fontSize: tokens.titleFontSizePx,
      fontWeight: 700,
      color: '#000000',
      marginBottom: '2px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic',
      marginInline: tokens.titleInnerMarginInlinePx,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }} className="text-right font-bold my-0">
        {title}
      </h4>
      
      <p style={{
      fontSize: tokens.descriptionFontSizePx,
      fontWeight: 400,
      color: '#858789',
      marginBottom: '0px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic',
      marginInline: tokens.titleInnerMarginInlinePx,
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
