
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
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
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggle?.(newCollapsedState);
  };

  useEffect(() => {
    onToggle?.(isCollapsed);
  }, [isCollapsed, onToggle]);

  return (
    <aside className={`bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl transition-all duration-500 ease-in-out ${isCollapsed ? 'w-[5%]' : 'w-[15%]'}`}>
      <nav className="flex flex-col gap-2 p-6 h-full">
        {/* Menu Title Section with Toggle */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100'}`} style={{
            transitionDelay: isCollapsed ? '0ms' : '100ms'
          }}>
            {!isCollapsed && (
              <h2 className="text-soabra-text-primary text-right text-xl font-semibold">
                القائمة
              </h2>
            )}
          </div>
          <button 
            onClick={toggleSidebar} 
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-out border-2 border-[#3e494c]/20 hover:border-[#3e494c]/40 hover:bg-white/15 hover:scale-110 active:scale-95 flex-shrink-0 shadow-sm"
          >
            <div className={`transition-transform duration-300 ease-out ${isCollapsed ? 'rotate-0' : 'rotate-0'}`}>
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5 text-[#3e494c]" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-[#3e494c]" />
              )}
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-3">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const baseDelay = isCollapsed ? 0 : 150 + index * 50;
            return (
              <button 
                key={index} 
                className={`
                  w-full flex items-center gap-4 px-4 py-4 text-right transition-all duration-400 ease-in-out group relative
                  ${item.active 
                    ? 'bg-white/25 text-[#3e494c] font-semibold rounded-2xl shadow-md border border-white/30' 
                    : 'text-soabra-text-secondary hover:bg-white/15 hover:text-soabra-text-primary font-medium rounded-2xl border border-transparent hover:border-white/20'
                  }
                  ${isCollapsed ? 'justify-center px-3' : ''}
                  hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0 active:scale-95
                `}
              >
                {/* Icon container with enhanced styling */}
                <div className={`
                  w-9 h-9 flex items-center justify-center transition-all duration-300 ease-out flex-shrink-0 rounded-xl
                  ${item.active 
                    ? 'bg-white/30 border border-[#3e494c]/15 shadow-sm' 
                    : 'group-hover:bg-white/20 group-hover:border group-hover:border-white/20'
                  }
                  group-hover:scale-110 group-active:scale-95
                `}>
                  <IconComponent className={`
                    w-5 h-5 transition-all duration-300 ease-out
                    ${item.active ? 'text-[#3e494c]' : 'text-soabra-text-secondary group-hover:text-[#3e494c]'}
                  `} />
                </div>
                
                {/* Label with enhanced transitions */}
                <div 
                  className={`flex-1 flex items-center transition-all duration-500 ease-in-out ${
                    isCollapsed ? 'opacity-0 translate-x-6 scale-95 w-0 overflow-hidden' : 'opacity-100 translate-x-0 scale-100 w-auto'
                  }`} 
                  style={{ transitionDelay: `${baseDelay}ms` }}
                >
                  {!isCollapsed && (
                    <span className="tracking-wide text-base transition-all duration-200 group-hover:font-semibold">
                      {item.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Version with enhanced styling */}
        <div 
          className={`mt-auto pt-6 transition-all duration-500 ease-in-out ${
            isCollapsed ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'
          }`} 
          style={{ transitionDelay: isCollapsed ? '0ms' : '450ms' }}
        >
          {!isCollapsed && (
            <div className="px-4 text-center">
              <div className="text-sm text-soabra-text-secondary/80 font-medium transition-all duration-300 hover:text-soabra-text-secondary">
                الإصدار 2.1.0
              </div>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
