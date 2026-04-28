interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}

const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  return (
    <div className="w-full min-w-0 px-0.5 sm:px-1 text-right overflow-hidden">
      <h4
        style={{
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="text-[13px] sm:text-sm lg:text-base my-0 mx-[2px] sm:mx-1 min-w-0 overflow-hidden [overflow-wrap:anywhere] break-words line-clamp-2"
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
        className="mt-1 text-[10px] sm:text-[11px] lg:text-xs font-normal text-gray-600 mx-[2px] sm:mx-1 min-w-0 overflow-hidden [overflow-wrap:anywhere] break-words line-clamp-2"
        title={description}
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureTaskCardTitle;
