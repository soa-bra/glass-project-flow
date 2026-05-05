import { useTaskCardSizeTokens } from './taskCardSizeTokens';

interface FeatureTaskCardPriorityCircleProps {
  priority: string;
}

const FeatureTaskCardPriorityCircle = ({
  priority
}: FeatureTaskCardPriorityCircleProps) => {
  const tokens = useTaskCardSizeTokens();

  const getPriorityConfig = (value: string) => {
    const configs = {
      'urgent-important': { bg: '#f1b5b9', line1: 'عاجل', line2: 'مهم' },
      'urgent-not-important': { bg: '#A4E2F6', line1: 'عاجل', line2: 'غير مهم' },
      'not-urgent-important': { bg: '#FBE2AA', line1: 'غير عاجل', line2: 'مهم' },
      'not-urgent-not-important': { bg: '#D9D2FD', line1: 'غير عاجل', line2: 'غير مهم' }
    };

    return configs[value as keyof typeof configs] ?? configs['urgent-important'];
  };

  const config = getPriorityConfig(priority);

  return (
    <div
      className="shrink-0 rounded-full flex flex-col items-center justify-center text-center px-1"
      style={{ width: tokens.circleSizePx, height: tokens.circleSizePx, backgroundColor: config.bg }}
    >
      <span className="font-medium leading-none" style={{ fontSize: tokens.priorityLine1FontSizePx }}>
        {config.line1}
      </span>
      <span className="leading-none mt-0.5" style={{ fontSize: tokens.priorityLine2FontSizePx }}>
        {config.line2}
      </span>
    </div>
  );
};

export default FeatureTaskCardPriorityCircle;
