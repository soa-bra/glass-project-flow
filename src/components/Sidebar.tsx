
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'الرئيسية', active: true },
    { icon: FolderOpen, label: 'المشاريع', active: false },
    { icon: CheckSquare, label: 'المهام', active: false },
    { icon: Building, label: 'الإدارات', active: false },
    { icon: Users, label: 'التخطيط التشاركي', active: false },
    { icon: Archive, label: 'الأرشيف', active: false }
  ];

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
        width: isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)'
      }}
      className="bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl mx-0 overflow-hidden px-0"
    >
      <nav className="flex flex-col gap-2 h-full py-0 mx-0 px-0">
        {/* Menu Title Section with Toggle - Synchronized Animation */}
        <div className={`text-center mb-2 rounded-full mx-0 px-0 py-[24px] my-[24px] sync-transition ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center rounded-lg sync-transition ${isCollapsed ? 'justify-center px-0 mx-0' : 'justify-between px-[3px] mx-[20px]'}`}>
            {/* Title container - Perfect synchronization */}
            <div 
              className={`flex-1 overflow-hidden`}
              style={{
                transition: 'all var(--animation-duration-main) var(--animation-easing)',
                opacity: isCollapsed ? 0 : 1,
                transform: isCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
                width: isCollapsed ? '0' : 'auto',
                transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.4)'
              }}
            >
              <h2 className="text-soabra-text-primary text-right font-medium text-3xl px-0 mx-[18px] whitespace-nowrap">
                القائمة
              </h2>
            </div>
            
            {/* Toggle button - Smooth scaling and rotation */}
            <button 
              onClick={toggleSidebar}
              className="group w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/20 hover:shadow-lg flex-shrink-0 sync-transition-fast"
              style={{
                transform: 'scale(1)',
                transition: 'all var(--animation-duration-fast) var(--animation-easing)'
              }}
            >
              <div 
                className="sync-transition-fast"
                style={{
                  transform: isCollapsed ? 'rotate(0deg) scale(1.1)' : 'rotate(0deg) scale(1)',
                  transition: 'all var(--animation-duration-fast) var(--animation-easing)'
                }}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Menu Items - Perfectly synchronized staggered animation */}
        <div className={`flex flex-col gap-2 px-0 sync-transition ${isCollapsed ? 'mx-[15px]' : 'mx-[15px]'}`}>
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className={`
                  flex items-center gap-3 text-right group relative overflow-hidden sync-transition
                  ${item.active 
                    ? 'bg-white/25 text-[#3e494c] font-medium rounded-full shadow-lg border border-white/50 scale-[1.02]' 
                    : 'text-soabra-text-secondary hover:bg-white/15 hover:text-[#3e494c] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/30 hover:scale-[1.02] active:scale-95'
                  }
                  ${isCollapsed ? 'justify-center px-[12px] py-3' : 'px-2 py-3'}
                `}
                style={{
                  transition: `all var(--animation-duration-main) var(--animation-easing)`,
                  transitionDelay: isCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`
                }}
              >
                {/* Icon container - synchronized with main animation */}
                <div className={`
                    w-[60px] h-[60px] flex items-center justify-center flex-shrink-0 border-2 rounded-full sync-transition-fast
                    ${item.active 
                      ? 'bg-white/30 border-[#3e494c]/60 shadow-lg scale-105' 
                      : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/60 group-hover:bg-white/20 group-hover:shadow-md group-hover:scale-110 group-active:scale-95'
                    }
                  `}>
                  <IconComponent className={`
                      w-6 h-6 sync-transition-fast
                      ${item.active 
                        ? 'text-[#3e494c] scale-110' 
                        : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'
                      }
                    `} />
                </div>
                
                {/* Label - Perfect synchronization with staggered appearance */}
                <div 
                  className="flex-1 flex items-center overflow-hidden"
                  style={{
                    opacity: isCollapsed ? 0 : 1,
                    transform: isCollapsed ? 'translateX(32px) scale(0.9)' : 'translateX(0) scale(1)',
                    width: isCollapsed ? '0' : 'auto',
                    transition: 'all var(--animation-duration-main) var(--animation-easing)',
                    transitionDelay: isCollapsed ? '0ms' : `calc(var(--base-delay) + var(--stagger-delay) * ${index})`
                  }}
                >
                  <span className={`tracking-wide text-base whitespace-nowrap sync-transition-fast ${item.active ? 'font-semibold' : 'group-hover:font-medium'}`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Version - Synchronized with main animation */}
        <div className={`mt-auto pt-2 py-0 sync-transition ${isCollapsed ? 'mx-[15px] flex justify-center' : 'mx-[15px]'}`}>
          <div 
            className="px-2 overflow-hidden"
            style={{
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateY(24px) scale(0.9)' : 'translateY(0) scale(1)',
              height: isCollapsed ? '0' : 'auto',
              transition: 'all var(--animation-duration-main) var(--animation-easing)',
              transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.8)'
            }}
          >
            <div className="text-center text-xs text-soabra-text-secondary/70 font-medium my-[45px] sync-transition-fast hover:text-soabra-text-secondary hover:scale-105 whitespace-nowrap">
              الإصدار 2.1.0
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
