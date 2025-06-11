
interface ProgressChipProps {
  value: number;
  className?: string;
}

export const ProgressChip = ({ value, className = '' }: ProgressChipProps) => {
  const getProgressColor = (val: number) => {
    if (val >= 80) return '#5DDC82'; // success
    if (val >= 50) return '#ECFF8C'; // warning
    return '#F23D3D'; // error
  };

  return (
    <div className={`glass-card h-[34px] px-3 flex items-center text-[14px] text-[#444] rounded-full ${className}`}>
      <div 
        className="w-2 h-2 rounded-full ml-2"
        style={{ backgroundColor: getProgressColor(value) }}
      />
      <span>{value}%</span>
    </div>
  );
};
