import { useTaskCardSizeTokens } from './taskCardSizeTokens';

interface FeatureTaskCardPriorityCircleProps {
  priority: string;
}

const FeatureTaskCardPriorityCircle = ({
  priority
}: FeatureTaskCardPriorityCircleProps) => {
  const tokens = useTaskCardSizeTokens();

  const getPriorityConfig = (priority: string) => {
    const configs = {
      'urgent-important': {
        bg: '#f1b5b9',
        line1: 'عاجل',
        line2: 'مهم'
      },
      'urgent-not-important': {
        bg: '#A4E2F6',
        line1: 'عاجل',
        line2: 'غير مهم'
      },
      'not-urgent-important': {
        bg: '#FBE2AA',
        line1: 'غير عاجل',
        line2: 'مهم'
      },
      'not-urgent-not-important': {
        bg: '#D9D2FD',
        line1: 'غير عاجل',
        line2: 'غير مهم'
      }
    };

    return configs[priority as keyof typeof configs] || configs['urgent-important'];
  };

  const config = getPriorityConfig(priority);

        {config.line2}
      </span>
    </div>
  );
};

export default FeatureTaskCardPriorityCircle;
