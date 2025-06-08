import { Home, FolderOpen, CheckSquare, Building, Users, Archive } from 'lucide-react';
const Sidebar = () => {
  const menuItems = [{
    icon: Home,
    label: 'الرئيسية',
    active: true
  }, {
    icon: FolderOpen,
    label: 'المشاريع',
    active: false
  }, {
    icon: CheckSquare,
    label: 'المهام',
    active: false
  }, {
    icon: Building,
    label: 'الإدارات',
    active: false
  }, {
    icon: Users,
    label: 'التخطيط التشاركي',
    active: false
  }, {
    icon: Archive,
    label: 'الأرشيف',
    active: false
  }];
  return <aside className="w-60 bg-soabra-sidebar-bg border-l border-gray-200/50 z-sidebar h-full glass backdrop-blur-xl rounded-3xl">
      <nav className="flex flex-col py-8 px-6 gap-6">
        {/* Logo/Title Section */}
        <div className="mb-6 px-2 text-center group">
          <h1 className="text-2xl font-bold bg-gradient-to-l from-soabra-primary-blue to-soabra-success bg-clip-text text-transparent leading-tight transition-all duration-300 group-hover:scale-105">
            نظام إدارة المشاريع
          </h1>
          <div className="text-soabra-text-secondary text-sm mt-2 font-medium tracking-wide">
            SoaBra
          </div>
          <div className="mt-4 h-px bg-gradient-to-r from-transparent via-soabra-primary-blue/30 to-transparent rounded-full" />
        </div>

        {/* Menu Title Section */}
        <div className="text-center mb-8 my-0 py-[5px] px-[7px]">
          <h2 className="text-soabra-text-primary mb-4 text-right text-2xl font-medium">
            القائمة
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-soabra-primary-blue/30 to-transparent rounded-full" />
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        return <button key={index} style={{
          animationDelay: `${index * 0.1}s`,
          animation: 'fadeInUp 0.6s ease-out both'
        }} className={`
                flex items-center gap-6 px-4 py-4 text-right rounded-3xl transition-all duration-300 group
                ${item.active ? 'bg-white/20 text-[#3e494c] font-medium' : 'text-soabra-text-secondary hover:bg-white/10 hover:text-soabra-text-primary font-light'}
              `}>
              {/* Circle around icon with border only */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                <IconComponent className={`w-6 h-6 transition-all duration-300 ${item.active ? 'text-[#3e494c]' : 'group-hover:scale-110'}`} />
              </div>
              <span className="tracking-wide flex-1 text-xl font-normal">{item.label}</span>
              {item.active && <div className="w-2 h-2 bg-[#3e494c] rounded-full animate-pulse" />}
            </button>;
      })}

        {/* Bottom Decoration */}
        <div className="mt-auto pt-6">
          <div className="px-2">
            <div className="text-center text-xs text-soabra-text-secondary/70 font-medium">
              الإصدار 2.1.0
            </div>
          </div>
        </div>
      </nav>
    </aside>;
};
export default Sidebar;