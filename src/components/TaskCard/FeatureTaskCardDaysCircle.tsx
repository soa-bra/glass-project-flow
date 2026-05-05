import { useTaskCardSizeTokens } from './taskCardSizeTokens';

interface FeatureTaskCardDaysCircleProps {
  daysLeft: number;
}

const FeatureTaskCardDaysCircle = ({ daysLeft }: FeatureTaskCardDaysCircleProps) => {
  const tokens = useTaskCardSizeTokens();

  return (
    <div
      className="shrink-0 rounded-full bg-[#F5F7FA] border border-[#111111] flex flex-col items-center justify-center text-center"
      style={{ width: tokens.circleSizePx, height: tokens.circleSizePx }}
    >
      <span className="font-semibold text-[#0B0F12] leading-none" style={{ fontSize: tokens.daysNumberFontSizePx }}>
        {daysLeft}
      </span>
      <span className="text-[#0B0F12]/70 leading-none mt-0.5" style={{ fontSize: tokens.daysLabelFontSizePx }}>
        يوم
      </span>
    </div>
  );
};

export default FeatureTaskCardDaysCircle;
