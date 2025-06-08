
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

  return <aside className={`bg-soabra-sidebar-bg border-l border-gray-200/50 z-sidebar h-full glass backdrop-blur-xl rounded-3xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'}`}>
      <nav className="flex flex-col py-8 px-6 gap-6">
        {/* Logo/Title Section */}
        {!isCollapsed && (
          <div className="mb-6 px-2 text-center group">
            <h1 className="text-2xl font-bold bg-gradient-to-l from-soabra-primary-blue to-soabra-success bg-clip-text text-transparent leading-tight transition-all duration-300 group-hover:scale-105">
              نظام إدارة المشاريع
            </h1>
            <div className="text-soabra-text-secondary text-sm mt-2 font-medium tracking-wide">
              SoaBra
            </div>
            <div className="mt-4 h-px bg-gradient-to-r from-transparent via-soabra-primary-blue/30 to-transparent rounded-full" />
          </div>
        )}

        {/* Menu Title Section with Toggle */}
        <div className="text-center mb-8 rounded-full py-[6px] my-[3px] mx-0 px-[7px]">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-soabra-text-primary text-right text-2xl font-medium flex-1">
                القائمة
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-[#3e494c]/50 hover:bg-white/10"
            >
              {isCollapsed ? (
                <ChevronLeft className="w-5 h-5 text-[#3e494c]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-[#3e494c]" />
              )}
            </button>
          </div>
          {!isCollapsed && (
            <div className="h-px bg-gradient-to-r from-transparent via-soabra-primary-blue/30 to-transparent rounded-full mt-4" />
          )}
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
                ${isCollapsed ? 'justify-center' : ''}
              `}>
              {/* Circle around icon with border - now fully rounded when active */}
              <div className={`w-14 h-14 flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50 ${item.active ? 'rounded-full bg-white/30' : 'rounded-full'}`}>
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
