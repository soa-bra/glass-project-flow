
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({
  onToggle
}: SidebarProps) => {
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
    <aside 
      style={{
        width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)'
      }} 
      className="bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] mx-0 px-px"
    >
      <nav className="flex flex-col gap-2 h-full py-0 px-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
        {/* Menu Title Section with Toggle */}
        <div className={`text-center mb-2 rounded-full mx-0 px-0 py-[10px] my-[20px] ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center rounded-lg transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCollapsed ? 'justify-center px-0 mx-0' : 'justify-between px-[3px] mx-[20px]'}`}>
            {/* Title container */}
            {!isCollapsed && (
              <div className="flex-1 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-100 translate-x-0 scale-100" 
                style={{ transitionDelay: '50ms' }}>
                <h2 className="text-soabra-text-primary text-right font-medium text-3xl px-0 mx-[18px]">
                  القائمة
                </h2>
              </div>
            )}
            
            {/* Toggle button */}
            <button 
              onClick={toggleSidebar} 
              className="group w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] border-2 border-[#3e494c]/30 hover:border-[#3e494c]/50 hover:bg-white/15 hover:scale-105 text-3xl px-0 mx-0 hover:shadow-md flex-shrink-0"
            >
              <div className="transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] transform">
                {isCollapsed ? (
                  <ChevronRight className="w-6 h-6 text-[#3e494c] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-[#3e494c] transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className={`flex flex-col gap-2 px-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCollapsed ? 'mx-[15px]' : 'mx-[15px]'}`}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const baseDelay = isCollapsed ? 0 : 100 + (index * 30);
            
            return (
              <button 
                key={index} 
                className={`
                  flex items-center gap-3 text-right transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] group relative
                  ${item.active 
                    ? 'bg-white/20 text-[#3e494c] font-medium rounded-full shadow-lg border border-white/40 scale-[1.02]' 
                    : 'text-soabra-text-secondary hover:bg-white/15 hover:text-[#3e494c] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/20 hover:scale-[1.01]'
                  }
                  ${isCollapsed ? 'justify-center px-[12px] py-3' : 'px-2 py-3'}
                `}
              >
                {/* Icon container */}
                <div className={`
                    w-[60px] h-[60px] flex items-center justify-center transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 border-2 rounded-full
                    ${item.active 
                      ? 'bg-white/25 border-[#3e494c]/50 shadow-lg scale-105' 
                      : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/50 group-hover:bg-white/15 group-hover:shadow-md group-hover:scale-105'
                    }
                  `}>
                  <IconComponent className={`
                      w-6 h-6 transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)]
                      ${item.active 
                        ? 'text-[#3e494c] scale-110' 
                        : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'
                      }
                    `} />
                </div>
                
                {/* Label */}
                {!isCollapsed && (
                  <div 
                    className="flex-1 flex items-center transition-all duration-550 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-100 translate-x-0 scale-100 w-auto" 
                    style={{ transitionDelay: `${baseDelay}ms` }}
                  >
                    <span className={`tracking-wide text-base transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] ${item.active ? 'font-semibold' : 'group-hover:font-medium'}`}>
                      {item.label}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Version */}
        <div className={`mt-auto pt-2 py-0 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCollapsed ? 'mx-[15px] flex justify-center' : 'mx-[15px]'}`}>
          {!isCollapsed && (
            <div 
              className="px-2 transition-all duration-550 ease-[cubic-bezier(0.23,1,0.32,1)] opacity-100 translate-y-0 scale-100" 
              style={{ transitionDelay: '300ms' }}
            >
              <div className="text-center text-xs text-soabra-text-secondary/70 font-medium my-[45px] transition-all duration-600 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-soabra-text-secondary hover:scale-105">
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
