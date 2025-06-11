
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
      className="bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl transition-all duration-500 ease-in-out mx-0 px-px overflow-hidden"
    >
      <nav className="flex flex-col gap-2 h-full py-0 px-0 transition-all duration-500 ease-in-out">
        {/* Menu Title Section with Toggle */}
        <div className={`text-center mb-2 rounded-full mx-0 px-0 py-[10px] my-[20px] transition-all duration-500 ease-in-out ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center rounded-lg transition-all duration-500 ease-in-out ${isCollapsed ? 'justify-center px-0 mx-0' : 'justify-between px-[3px] mx-[20px]'}`}>
            {/* Title container - synchronized timing */}
            <div 
              className={`flex-1 transition-all duration-300 ease-in-out ${
                isCollapsed 
                  ? 'opacity-0 translate-x-6 scale-90 w-0 overflow-hidden pointer-events-none' 
                  : 'opacity-100 translate-x-0 scale-100 w-auto overflow-visible pointer-events-auto'
              }`}
              style={{ 
                transitionDelay: isCollapsed ? '0ms' : '200ms',
                transitionProperty: 'opacity, transform, width'
              }}
            >
              <h2 className="text-soabra-text-primary text-right font-medium text-3xl px-0 mx-[18px] whitespace-nowrap">
                القائمة
              </h2>
            </div>
            
            {/* Toggle button - smooth rotation */}
            <button 
              onClick={toggleSidebar} 
              className="group w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 ease-in-out border-2 border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/20 hover:scale-110 active:scale-95 text-3xl px-0 mx-0 hover:shadow-lg flex-shrink-0"
            >
              <div className="transition-all duration-300 ease-in-out transform">
                {isCollapsed ? (
                  <ChevronRight className="w-6 h-6 text-[#3e494c] transition-all duration-300 ease-in-out group-hover:scale-110" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-[#3e494c] transition-all duration-300 ease-in-out group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Menu Items - perfectly synchronized staggered animation */}
        <div className={`flex flex-col gap-2 px-0 transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-[15px]' : 'mx-[15px]'}`}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            // Synchronized delays for perfect timing
            const baseDelay = 100;
            const staggerDelay = 50;
            const labelDelay = isCollapsed ? 0 : baseDelay + (index * staggerDelay);
            
            return (
              <button 
                key={index} 
                className={`
                  flex items-center gap-3 text-right transition-all duration-300 ease-in-out group relative overflow-hidden
                  ${item.active 
                    ? 'bg-white/25 text-[#3e494c] font-medium rounded-full shadow-lg border border-white/50 scale-[1.02]' 
                    : 'text-soabra-text-secondary hover:bg-white/15 hover:text-[#3e494c] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/30 hover:scale-[1.02] active:scale-95'
                  }
                  ${isCollapsed ? 'justify-center px-[12px] py-3' : 'px-2 py-3'}
                `}
                style={{
                  transitionDelay: isCollapsed ? '0ms' : `${index * 30}ms`
                }}
              >
                {/* Icon container - synchronized with main animation */}
                <div className={`
                    w-[60px] h-[60px] flex items-center justify-center transition-all duration-300 ease-in-out flex-shrink-0 border-2 rounded-full
                    ${item.active 
                      ? 'bg-white/30 border-[#3e494c]/60 shadow-lg scale-105' 
                      : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/60 group-hover:bg-white/20 group-hover:shadow-md group-hover:scale-110 group-active:scale-95'
                    }
                  `}>
                  <IconComponent className={`
                      w-6 h-6 transition-all duration-300 ease-in-out
                      ${item.active 
                        ? 'text-[#3e494c] scale-110' 
                        : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'
                      }
                    `} />
                </div>
                
                {/* Label - perfectly synchronized with staggered appearance */}
                <div 
                  className={`flex-1 flex items-center transition-all duration-300 ease-in-out ${
                    isCollapsed 
                      ? 'opacity-0 translate-x-8 scale-90 w-0 overflow-hidden pointer-events-none' 
                      : 'opacity-100 translate-x-0 scale-100 w-auto overflow-visible pointer-events-auto'
                  }`}
                  style={{ 
                    transitionDelay: `${labelDelay}ms`,
                    transitionProperty: 'opacity, transform, width'
                  }}
                >
                  <span className={`tracking-wide text-base transition-all duration-300 ease-in-out whitespace-nowrap ${item.active ? 'font-semibold' : 'group-hover:font-medium'}`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Version - synchronized with main animation */}
        <div className={`mt-auto pt-2 py-0 transition-all duration-500 ease-in-out ${isCollapsed ? 'mx-[15px] flex justify-center' : 'mx-[15px]'}`}>
          <div 
            className={`px-2 transition-all duration-300 ease-in-out ${
              isCollapsed 
                ? 'opacity-0 translate-y-6 scale-90 h-0 overflow-hidden pointer-events-none' 
                : 'opacity-100 translate-y-0 scale-100 h-auto overflow-visible pointer-events-auto'
            }`}
            style={{ 
              transitionDelay: isCollapsed ? '0ms' : '400ms',
              transitionProperty: 'opacity, transform, height'
            }}
          >
            <div className="text-center text-xs text-soabra-text-secondary/70 font-medium my-[45px] transition-all duration-300 ease-in-out hover:text-soabra-text-secondary hover:scale-105 whitespace-nowrap">
              الإصدار 2.1.0
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
