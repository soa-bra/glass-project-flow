interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}
const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  return <div className="px-0 my-[15px] mx-[15px]">
      <h4 style={{
      fontSize: '16px',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '2px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%'
    }} className="text-right font-bold text-base my-0 mx-[4px] min-w-0" data-overflow-guard="true" title={title}>
        {title}
      </h4>
      
      <p style={{
      fontSize: '12px',
      fontWeight: 400,
      color: '#858789',
      marginBottom: '0px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '100%'
    }} className="text-right my-[3px] text-sm font-normal text-gray-600 mx-[4px] min-w-0" data-overflow-guard="true" title={description}>
        {description}
      </p>
    </div>;
};
export default FeatureTaskCardTitle;
