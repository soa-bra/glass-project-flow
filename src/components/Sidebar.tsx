
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'الرئيسية', active: true, link: "/" },
    { icon: FolderOpen, label: 'المشاريع', active: false, link: "#" },
    { icon: CheckSquare, label: 'المهام', active: false, link: "#" },
    { icon: Building, label: 'الإدارات', active: false, link: "/administrations" },
    { icon: Users, label: 'التخطيط التشاركي', active: false, link: "#" },
    { icon: Archive, label: 'الأرشيف', active: false, link: "#" }
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
        background: 'rgba(255,255,255,0.40)',
        backdropFilter: 'blur(20px) saturate(140%)',
        WebkitBackdropFilter: 'blur(20px) saturate(140%)',
        borderRadius: '32px',
        border: '1.4px solid rgba(255,255,255,0.22)',
        boxShadow: '0 14px 36px rgba(31,38,135,0.07),0 2px 14px rgba(0,0,0,0.04)',
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        transition: 'all var(--animation-duration-main) var(--animation-easing)'
      }}
      className="z-sidebar h-full sidebar-layout px-0"
      dir="rtl"
    >
      <nav className="flex flex-col gap-2 h-full py-0">
        {/* Menu Title */}
        <div className={`text-center mb-0 rounded-full py-7 sync-transition ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center rounded-lg sync-transition ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3 mx-5'}`}>
            <div
              className="flex-1 overflow-hidden"
              style={{
                opacity: isCollapsed ? 0 : 1,
                transform: isCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
                width: isCollapsed ? '0' : 'auto',
                transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.4)'
              }}
            >
              <h2 className="text-soabra-text-primary text-right font-medium text-3xl font-arabic px-0 mx-4 whitespace-nowrap select-none">
                القائمة
              </h2>
            </div>
            <button
              onClick={toggleSidebar}
              className="group w-11 h-11 rounded-full flex items-center justify-center border-2 border-[#cfd3da]/50 hover:border-[#3e494c]/60 hover:bg-white/23 hover:shadow-lg flex-shrink-0 sync-transition-fast"
              style={{
                transform: 'scale(1)',
                marginRight: isCollapsed ? '0px' : '8px',
                background: 'rgba(255,255,255,0.17)',
                borderRadius: 999
              }}
            >
              <div
                className="sync-transition-fast"
                style={{
                  transform: isCollapsed ? 'rotate(0deg) scale(1.1)' : 'rotate(0deg) scale(1)'
                }}
              >
                {isCollapsed ? (
                  <ChevronRight className="w-6 h-6 text-[#3e494c]" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-[#3e494c]" />
                )}
              </div>
            </button>
          </div>
        </div>
        {/* Menu Items */}
        <div className="flex flex-col gap-2 px-0 sync-transition mx-3">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.link}
                className={`
                  flex items-center gap-3 text-right group relative overflow-hidden sync-transition
                  ${item.active
                  ? 'bg-white/40 text-[#3e494c] font-semibold rounded-full shadow-lg border border-white/50 scale-[1.03]'
                  : 'text-soabra-text-secondary hover:bg-white/18 hover:text-[#23272F] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/30 hover:scale-[1.02] active:scale-95'
                  }
                  ${isCollapsed ? 'justify-center px-2 py-3' : 'px-2 py-3'}
                `}
                style={{
                  transitionDelay: isCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`
                }}
              >
                <div
                  className={`
                    w-[45px] h-[45px] flex items-center justify-center flex-shrink-0 border-2 rounded-full sync-transition-fast
                    ${item.active
                  ? 'bg-white/28 border-[#3e494c]/60 shadow-lg scale-105'
                  : 'border-[#3e494c]/25 group-hover:border-[#3e494c]/40 group-hover:bg-white/16 group-hover:shadow group-hover:scale-110 group-active:scale-95'
                  }
                  `}
                  style={{ background: item.active ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.10)' }}
                >
                  <IconComponent className={`
                    w-6 h-6 sync-transition-fast
                    ${item.active
                    ? 'text-[#3e494c] scale-110'
                    : 'text-soabra-text-secondary group-hover:text-[#23272F] group-hover:scale-110'
                    }
                  `} />
                </div>
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
                  <span className="tracking-wide text-[19px] font-arabic whitespace-nowrap">{item.label}</span>
                </div>
              </a>
            );
          })}
        </div>
        {/* Bottom Version */}
        <div className={`mt-auto pt-2 py-0 sync-transition ${isCollapsed ? 'mx-[10px] flex justify-center' : 'mx-[10px]'}`}>
          <div
            style={{
              opacity: isCollapsed ? 0 : 1,
              transform: isCollapsed ? 'translateY(24px) scale(0.9)' : 'translateY(0) scale(1)',
              height: isCollapsed ? '0' : 'auto',
              transitionDelay: isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.8)'
            }}
          >
            <div className="text-center text-xs text-soabra-text-secondary/80 font-medium my-[36px] font-arabic whitespace-nowrap">
              الإصدار 2.1.0
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
