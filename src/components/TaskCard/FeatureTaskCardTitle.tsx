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
      color: 'var(--sb-ink)',
      marginBottom: '2px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right font-bold text-base my-0 mx-[4px]">
        {title}
      </h4>
      
      <p style={{
      fontSize: '12px',
      fontWeight: 400,
      color: 'var(--sb-ink-70)',
      marginBottom: '0px',
      lineHeight: 1.1,
      fontFamily: 'IBM Plex Sans Arabic'
    }} className="text-right my-[3px] text-sm font-normal mx-[4px]">
        {description}
      </p>
    </div>;
};
export default FeatureTaskCardTitle;