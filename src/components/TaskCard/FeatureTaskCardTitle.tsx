interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}

const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  return (
    <div className="w-full min-w-0 overflow-hidden px-[clamp(0.125rem,0.4vw,0.25rem)] text-right">
      <h4
        style={{
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="my-0 min-w-0 max-w-full overflow-hidden text-[13px] leading-tight sm:text-sm lg:text-base line-clamp-2 [overflow-wrap:anywhere] [word-break:break-word]"
        title={title}
        dir="auto"
        lang="ar"
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
        className="mt-1 min-w-0 max-w-full overflow-hidden text-[10px] font-normal leading-tight text-gray-600 sm:text-[11px] lg:text-xs line-clamp-2 [overflow-wrap:anywhere] [word-break:break-word]"
        title={description}
        dir="auto"
        lang="ar"
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureTaskCardTitle;
