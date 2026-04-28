interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}

const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  return (
    <div className="w-full min-w-0 overflow-hidden text-right" dir="rtl">
      <h4
        style={{
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="my-0 min-w-0 overflow-hidden text-[13px] sm:text-sm lg:text-base line-clamp-2 [overflow-wrap:anywhere]"
        title={title}
      >
        {title}
      </h4>

      <p
        style={{
          fontWeight: 400,
          color: '#858789',
          marginBottom: '0px',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="mt-1 min-w-0 overflow-hidden text-[10px] sm:text-[11px] lg:text-xs font-normal text-gray-600 line-clamp-2 [overflow-wrap:anywhere]"
        title={description}
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureTaskCardTitle;
