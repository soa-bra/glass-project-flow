
interface KPICardProps {
  icon: string;
  value: string;
  label: string;
}

const KPICard = ({ icon, value, label }: KPICardProps) => {
  return (
    <div className="glass rounded-lg p-4 text-center hover:scale-105 transition-transform">
      {/* Icon */}
      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      
      {/* Value */}
      <div className="text-2xl font-medium text-soabra-text-primary mb-1">
        {value}
      </div>
      
      {/* Label */}
      <div className="text-xs text-soabra-text-secondary">
        {label}
      </div>
    </div>
  );
};

export default KPICard;
