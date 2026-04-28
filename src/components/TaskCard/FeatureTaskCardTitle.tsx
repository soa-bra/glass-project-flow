interface FeatureTaskCardTitleProps {
  title: string;
  description: string;
}

const FeatureTaskCardTitle = ({
  title,
  description
}: FeatureTaskCardTitleProps) => {
  return (
    <div className="w-full min-w-0 text-right overflow-hidden" dir="rtl">
      <h4
        style={{
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1.2,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="text-[13px] sm:text-sm lg:text-base my-0 min-w-0 overflow-hidden text-ellipsis line-clamp-2 [overflow-wrap:anywhere] [word-break:break-word] [unicode-bidi:plaintext]"
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
        className="mt-1 text-[10px] sm:text-[11px] lg:text-xs font-normal text-gray-600 min-w-0 overflow-hidden text-ellipsis line-clamp-2 [overflow-wrap:anywhere] [word-break:break-word] [unicode-bidi:plaintext]"
        title={description}
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureTaskCardTitle;
