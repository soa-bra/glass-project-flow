import { Home, Building, Users, Archive, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  forceCollapsed?: boolean;
  collapsed?: boolean;
}

const Sidebar = ({
  onToggle,
  activeSection = 'home',
  onSectionChange,
  forceCollapsed = false,
  collapsed = false,
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const effectiveCollapsed = forceCollapsed || isCollapsed;
  const menuItems = [
    { icon: Home, label: 'الرئيسية', key: 'home' },
    { icon: Building, label: 'الإدارات', key: 'departments' },
    { icon: Users, label: 'التخطيط التضامني', key: 'planning' },
    { icon: Archive, label: 'الأرشيف', key: 'archive' },
    { icon: Settings, label: 'الإعدادات', key: 'settings' },
  ];

  const toggleSidebar = () => {
    if (forceCollapsed) return;
    setIsCollapsed((current) => !current);
  };

  const handleSectionClick = (sectionKey: string) => {
    onSectionChange?.(sectionKey);
  };

  useEffect(() => {
    if (!forceCollapsed && isCollapsed !== collapsed) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed, forceCollapsed, isCollapsed]);

  useEffect(() => {
    onToggle?.(effectiveCollapsed);
  }, [effectiveCollapsed, onToggle]);

  return (
    <aside
      style={{
        width: effectiveCollapsed
          ? 'var(--sidebar-width-collapsed)'
          : 'var(--sidebar-width-expanded)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)',
      }}
      className="z-sidebar h-full backdrop-blur-xl rounded-3xl mx-0 overflow-hidden px-0 bg-slate-100"
    >
      <nav className="flex flex-col gap-2 h-full py-0 mx-0 px-0 bg-slate-100">
        <div
          className={`text-center mb-2 rounded-full mx-0 px-0 py-[24px] my-[24px] sync-transition ${
            effectiveCollapsed ? 'flex justify-center' : ''
          }`}
        >
          <div
            className={`flex items-center rounded-lg sync-transition ${
              effectiveCollapsed ? 'justify-center px-0 mx-0 w-full' : 'justify-between px-[3px] mx-[20px]'
            }`}
          >
            <div
              className="flex-1 overflow-hidden"
              style={{
                transition: 'all var(--animation-duration-main) var(--animation-easing)',
                opacity: effectiveCollapsed ? 0 : 1,
                transform: effectiveCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
                width: effectiveCollapsed ? '0' : 'auto',
                transitionDelay: effectiveCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.4)',
              }}
            >
              <h2 className="text-soabra-text-primary text-right font-medium text-3xl px-0 mx-[18px] whitespace-nowrap">
                القائمة
              </h2>
            </div>

            <button
              type="button"
              onClick={toggleSidebar}
              className={`group w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 flex-shrink-0 sync-transition-fast ${
                forceCollapsed
                  ? 'border-transparent bg-transparent hover:border-transparent hover:bg-transparent opacity-20 cursor-not-allowed'
                  : 'border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/20 hover:shadow-lg'
              }`}
              aria-label={effectiveCollapsed ? 'توسيع القائمة' : 'طي القائمة'}
            >
              <div className="sync-transition-fast">
                {effectiveCollapsed ? (
                  <ChevronRight className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />
                ) : (
                  <ChevronLeft className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />
                )}
              </div>
            </button>
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 px-0 sync-transition ${
            effectiveCollapsed ? 'mx-0 items-center' : 'mx-[15px]'
          }`}
        >
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleSectionClick(item.key)}
                className={`
                  flex items-center gap-3 text-right group relative overflow-hidden sync-transition
                  ${isActive ? 'bg-white/25 text-[#3e494c] font-medium rounded-full shadow-lg border border-white/50 scale-[1.02]' : 'text-soabra-text-secondary hover:bg-white/15 hover:text-[#3e494c] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/30 hover:scale-[1.02] active:scale-95'}
                  ${effectiveCollapsed ? 'w-[84px] justify-center px-0 py-3' : 'w-full px-2 py-3'}
                `}
                style={{
                  transition: 'all var(--animation-duration-main) var(--animation-easing)',
                  transitionDelay: effectiveCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`,
                }}
              >
                <div
                  className={`
                    w-[60px] h-[60px] flex items-center justify-center flex-shrink-0 border-2 rounded-full sync-transition-fast
                    ${isActive ? 'bg-white/30 border-[#3e494c]/60 shadow-lg scale-105' : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/60 group-hover:bg-white/20 group-hover:shadow-md group-hover:scale-110 group-active:scale-95'}
                  `}
                >
                  <IconComponent
                    className={`
                      w-6 h-6 sync-transition-fast
                      ${isActive ? 'text-[#3e494c] scale-110' : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'}
                    `}
                  />
                </div>

                <div
                  className="flex-1 flex items-center overflow-hidden"
                  style={{
                    opacity: effectiveCollapsed ? 0 : 1,
                    transform: effectiveCollapsed ? 'translateX(32px) scale(0.9)' : 'translateX(0) scale(1)',
                    width: effectiveCollapsed ? '0' : 'auto',
                    transition: 'all var(--animation-duration-main) var(--animation-easing)',
                    transitionDelay: effectiveCollapsed ? '0ms' : `calc(var(--base-delay) + var(--stagger-delay) * ${index})`,
                  }}
                >
                  <span className={`tracking-wide text-base whitespace-nowrap sync-transition-fast ${isActive ? 'font-semibold' : 'group-hover:font-medium'}`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div
          className={`mt-auto pt-2 py-0 sync-transition ${
            effectiveCollapsed ? 'mx-0 flex justify-center' : 'mx-[15px]'
          }`}
        >
          <div
            className="px-2 overflow-hidden"
            style={{
              opacity: effectiveCollapsed ? 0 : 1,
              transform: effectiveCollapsed ? 'translateY(24px) scale(0.9)' : 'translateY(0) scale(1)',
              height: effectiveCollapsed ? '0' : 'auto',
              transition: 'all var(--animation-duration-main) var(--animation-easing)',
              transitionDelay: effectiveCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.8)',
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
