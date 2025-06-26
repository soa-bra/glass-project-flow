
interface DepartmentNotificationBadgeProps {
  count: number;
  color: string;
}

const DepartmentNotificationBadge = ({ count, color }: DepartmentNotificationBadgeProps) => {
  return (
    <div 
      className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white animate-pulse"
      style={{ backgroundColor: color }}
    >
      {count > 9 ? '9+' : count}
    </div>
  );
};

export default DepartmentNotificationBadge;
