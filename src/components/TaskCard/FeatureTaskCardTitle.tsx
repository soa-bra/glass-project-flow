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

  return (
    <div className="min-w-0 overflow-hidden">
      <h3
        title={title}
        className="min-w-0 overflow-hidden text-ellipsis break-words leading-snug line-clamp-2"
        style={{
          fontSize: tokens.titleFontSizePx,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word'
        }}
      >
        {title}
      </h3>
      <p
        className="mt-1 min-w-0 overflow-hidden text-[rgba(11,15,18,0.55)] break-words leading-snug line-clamp-2"
        style={{
          fontSize: tokens.descriptionFontSizePx,
          overflowWrap: 'anywhere',
          wordBreak: 'break-word'
        }}
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureTaskCardTitle;
