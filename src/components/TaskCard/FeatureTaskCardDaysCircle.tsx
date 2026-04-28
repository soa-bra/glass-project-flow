interface FeatureTaskCardDaysCircleProps {
  daysLeft: number;
}

const FeatureTaskCardDaysCircle = ({ daysLeft }: FeatureTaskCardDaysCircleProps) => {
  return (
    <div
      className="w-11 h-11 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] rounded-full border border-black bg-transparent flex flex-col items-center justify-center shrink-0"
    >
      <span
        style={{
          fontWeight: 700,
          color: '#000000',
          lineHeight: 1,
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="text-sm sm:text-[15px]"
      >
        {daysLeft.toString().padStart(2, '0')}
      </span>
      <span
        style={{
          fontWeight: 400,
          color: '#000000',
          fontFamily: 'IBM Plex Sans Arabic'
        }}
        className="text-[9px] sm:text-[10px] mt-0.5"
      >
        يوم
      </span>
    </div>
  );
};

export default FeatureTaskCardDaysCircle;
