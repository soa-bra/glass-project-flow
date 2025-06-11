
interface StatusDotProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusDot = ({ color, size = 'md' }: StatusDotProps) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} rounded-full`}
      style={{ backgroundColor: color }}
    />
  );
};
