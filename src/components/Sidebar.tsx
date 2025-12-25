import { Home, Building, Users, Archive, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  forceCollapsed?: boolean;
}
const Sidebar = ({
  onToggle,
  activeSection = 'home',
  onSectionChange,
  forceCollapsed = false
}: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuItems = [{
    icon: Home,
    label: 'الرئيسية',
    key: 'home'
  }, {
    icon: Building,
    label: 'الإدارات',
    key: 'departments'
  }, {
    icon: Users,
    label: 'التخطيط التضامني',
    key: 'planning'
  }, {
    icon: Archive,
    label: 'الأرشيف',
    key: 'archive'
  }, {
    icon: Settings,
    label: 'الإعدادات',
    key: 'settings'
  }];
  const toggleSidebar = () => {
    if (forceCollapsed) return; // Don't allow toggling when forced
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onToggle?.(newCollapsedState);
  };
  const handleSectionClick = (sectionKey: string) => {
    onSectionChange?.(sectionKey);
  };
  useEffect(() => {
    if (forceCollapsed && !isCollapsed) {
      setIsCollapsed(true);
    } else if (!forceCollapsed && isCollapsed && activeSection !== 'planning') {
      // Only auto-expand if we're not on planning and not manually collapsed
    }
    onToggle?.(forceCollapsed || isCollapsed);
  }, [isCollapsed, onToggle, forceCollapsed, activeSection]);
  return <aside style={{
    width: forceCollapsed || isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width-expanded)',
    transition: 'var(--ds-transition-smooth)'
  }} className="z-sidebar h-full backdrop-blur-xl rounded-3xl mx-0 overflow-hidden px-0 bg-[hsl(var(--ds-color-panel))]">
      <nav className="flex flex-col gap-2 h-full py-0 mx-0 px-0 bg-[hsl(var(--ds-color-panel))]">
        {/* Menu Title Section with Toggle */}
        <div className={`text-center mb-2 rounded-full mx-0 px-0 py-[24px] my-[24px] sync-transition ${forceCollapsed || isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center rounded-lg sync-transition ${forceCollapsed || isCollapsed ? 'justify-center px-0 mx-0' : 'justify-between px-[3px] mx-[20px]'}`}>
            <div className={`flex-1 overflow-hidden`} style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)',
            opacity: forceCollapsed || isCollapsed ? 0 : 1,
            transform: forceCollapsed || isCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
            width: forceCollapsed || isCollapsed ? '0' : 'auto',
            transitionDelay: forceCollapsed || isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.4)'
          }}>
              <h2 className="text-soabra-text-primary text-right font-medium text-3xl px-0 mx-[18px] whitespace-nowrap">
                القائمة
              </h2>
            </div>
            
            <button onClick={toggleSidebar} className={`group w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 flex-shrink-0 sync-transition-fast ${forceCollapsed ? 'border-transparent bg-transparent hover:border-transparent hover:bg-transparent opacity-20 cursor-not-allowed' : 'border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/20 hover:shadow-lg'}`}>
              <div className="sync-transition-fast">
                {forceCollapsed || isCollapsed ? <ChevronRight className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" /> : <ChevronLeft className="w-6 h-6 text-[#3e494c] sync-transition-fast group-hover:scale-110" />}
              </div>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div className={`flex flex-col gap-2 px-0 sync-transition ${forceCollapsed || isCollapsed ? 'mx-[15px]' : 'mx-[15px]'}`}>
          {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.key;
          return <button key={index} onClick={() => handleSectionClick(item.key)} className={`
                  flex items-center gap-3 text-right group relative overflow-hidden sync-transition
                  ${isActive ? 'bg-white/25 text-[#3e494c] font-medium rounded-full shadow-lg border border-white/50 scale-[1.02]' : 'text-soabra-text-secondary hover:bg-white/15 hover:text-[#3e494c] font-light rounded-full hover:shadow-md border border-transparent hover:border-white/30 hover:scale-[1.02] active:scale-95'}
                  ${forceCollapsed || isCollapsed ? 'justify-center px-[12px] py-3' : 'px-2 py-3'}
                `} style={{
            transition: `all var(--animation-duration-main) var(--animation-easing)`,
            transitionDelay: isCollapsed ? '0ms' : `calc(var(--stagger-delay) * ${index})`
          }}>
                <div className={`
                    w-[60px] h-[60px] flex items-center justify-center flex-shrink-0 border-2 rounded-full sync-transition-fast
                    ${isActive ? 'bg-white/30 border-[#3e494c]/60 shadow-lg scale-105' : 'border-[#3e494c]/30 group-hover:border-[#3e494c]/60 group-hover:bg-white/20 group-hover:shadow-md group-hover:scale-110 group-active:scale-95'}
                  `}>
                  <IconComponent className={`
                      w-6 h-6 sync-transition-fast
                      ${isActive ? 'text-[#3e494c] scale-110' : 'text-soabra-text-secondary group-hover:text-[#3e494c] group-hover:scale-110'}
                    `} />
                </div>
                
                <div className="flex-1 flex items-center overflow-hidden" style={{
              opacity: forceCollapsed || isCollapsed ? 0 : 1,
              transform: forceCollapsed || isCollapsed ? 'translateX(32px) scale(0.9)' : 'translateX(0) scale(1)',
              width: forceCollapsed || isCollapsed ? '0' : 'auto',
              transition: 'all var(--animation-duration-main) var(--animation-easing)',
              transitionDelay: forceCollapsed || isCollapsed ? '0ms' : `calc(var(--base-delay) + var(--stagger-delay) * ${index})`
            }}>
                  <span className={`tracking-wide text-base whitespace-nowrap sync-transition-fast ${isActive ? 'font-semibold' : 'group-hover:font-medium'}`}>
                    {item.label}
                  </span>
                </div>
              </button>;
        })}
        </div>

        {/* Bottom Version */}
        <div className={`mt-auto pt-2 py-0 sync-transition ${forceCollapsed || isCollapsed ? 'mx-[15px] flex justify-center' : 'mx-[15px]'}`}>
          <div className="px-2 overflow-hidden" style={{
          opacity: forceCollapsed || isCollapsed ? 0 : 1,
          transform: forceCollapsed || isCollapsed ? 'translateY(24px) scale(0.9)' : 'translateY(0) scale(1)',
          height: forceCollapsed || isCollapsed ? '0' : 'auto',
          transition: 'all var(--animation-duration-main) var(--animation-easing)',
          transitionDelay: forceCollapsed || isCollapsed ? '0ms' : 'calc(var(--animation-duration-main) * 0.8)'
        }}>
            <div className="text-center text-xs text-soabra-text-secondary/70 font-medium my-[45px] sync-transition-fast hover:text-soabra-text-secondary hover:scale-105 whitespace-nowrap">
              الإصدار 2.1.0
            </div>
          </div>
        </div>
      </nav>
    </aside>;
};
export default Sidebar;