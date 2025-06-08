
interface KPICardProps {
  icon: string;
  value: string;
  label: string;
}

const KPICard = ({ icon, value, label }: KPICardProps) => {
  return (
    <div className="group glass rounded-2xl p-6 text-center hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-soabra-primary-blue/20 border border-white/40">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-soabra-primary-blue/5 to-soabra-success/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Icon */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-soabra-primary-blue/10 to-soabra-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
        <span className="text-3xl filter drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300">{icon}</span>
      </div>
      
      {/* Value */}
      <div className="relative text-3xl font-bold text-soabra-text-primary mb-2 group-hover:text-soabra-primary-blue transition-all duration-300 group-hover:scale-110">
        {value}
      </div>
      
      {/* Label */}
      <div className="relative text-sm text-soabra-text-secondary font-semibold group-hover:text-soabra-text-primary transition-all duration-300">
        {label}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-soabra-primary-blue/0 to-soabra-success/0 group-hover:from-soabra-primary-blue/5 group-hover:to-soabra-success/5 transition-all duration-500 pointer-events-none" />
    </div>
  );
};

export default KPICard;
