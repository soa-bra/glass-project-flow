interface FeatureTaskCardPriorityCircleProps {
  priority: string;
}

const FeatureTaskCardPriorityCircle = ({
  priority
}: FeatureTaskCardPriorityCircleProps) => {
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

  return (
    <div
      style={{
        backgroundColor: config.bg
      }}
      className="w-11 h-11 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] rounded-full flex flex-col items-center justify-center shrink-0"
    >
      <span
        style={{
          fontWeight: 600,
          color: '#000000',
          lineHeight: 1,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="text-[9px] sm:text-[10px]"
      >
        {config.line1}
      </span>
      <span
        style={{
          fontWeight: 400,
          color: '#000000',
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="text-[8px] sm:text-[9px] mt-0.5"
      >
        {config.line2}
      </span>
    </div>
  );
};

export default FeatureTaskCardPriorityCircle;
