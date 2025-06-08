
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return <aside className={`${isCollapsed ? 'w-20' : 'w-60'} bg-soabra-sidebar-bg border-l border-gray-200/50 z-sidebar h-full glass backdrop-blur-xl rounded-3xl py-[148px] transition-all duration-300 ease-in-out`}>
      <nav className="flex flex-col px-6 gap-6 py-[48px]">
        {/* Menu Title Section */}
        <div className="text-center mb-8 py-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-soabra-text-primary" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-soabra-text-primary" />
              )}
            </button>
            {!isCollapsed && (
              <h2 className="text-soabra-text-primary text-right text-2xl font-medium py-0">
                القائمة
              </h2>
            )}
          </div>
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
              {/* Rectangular border around icon for active state */}
              <div className={`w-14 h-14 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                item.active 
                  ? 'bg-white/10 border-2 border-[#3e494c] rounded-lg' 
                  : 'rounded-full border-2 border-[#3e494c]/50'
              }`}>
                <IconComponent className={`w-6 h-6 transition-all duration-300 ${item.active ? 'text-[#3e494c]' : 'group-hover:scale-110'}`} />
              </div>
              {!isCollapsed && (
                <>
                  <span className="tracking-wide flex-1 text-xl font-normal">{item.label}</span>
                  {item.active && <div className="w-2 h-2 bg-[#3e494c] rounded-full animate-pulse" />}
                </>
              )}
            </button>;
      })}

        {/* Bottom Decoration */}
        {!isCollapsed && (
          <div className="mt-auto pt-6">
            <div className="px-2">
              <div className="text-center text-xs text-soabra-text-secondary/70 font-medium">
                الإصدار 2.1.0
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>;
};

export default Sidebar;
