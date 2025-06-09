
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

  return <aside className={`bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl transition-all duration-500 ease-in-out ${isCollapsed ? 'w-[5%]' : 'w-[15%]'}`}>
      <nav className="flex flex-col gap-1 p-4 h-full">
        {/* Menu Title Section with Toggle */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className={`flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 translate-x-4 scale-95' : 'opacity-100 translate-x-0 scale-100'}`} style={{
            transitionDelay: isCollapsed ? '0ms' : '100ms'
          }}>
            {!isCollapsed && <h2 className="text-soabra-text-primary text-right text-lg font-semibold">
                القائمة
              </h2>}
          </div>
          <button onClick={toggleSidebar} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-out border-2 border-[#3e494c]/30 hover:border-[#3e494c]/60 hover:bg-white/10 hover:scale-105 active:scale-95 flex-shrink-0">
            <div className={`transition-transform duration-300 ease-out ${isCollapsed ? 'rotate-0' : 'rotate-0'}`}>
              {isCollapsed ? <ChevronRight className="w-4 h-4 text-[#3e494c]" /> : <ChevronLeft className="w-4 h-4 text-[#3e494c]" />}
            </div>
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const baseDelay = isCollapsed ? 0 : 150 + index * 50;
            return <button key={index} className={`
                  w-full flex items-center gap-3 px-3 py-3 text-right transition-all duration-400 ease-in-out group relative
                  ${item.active ? 'bg-white/20 text-[#3e494c] font-medium rounded-xl shadow-sm' : 'text-soabra-text-secondary hover:bg-white/10 hover:text-soabra-text-primary font-light rounded-xl'}
                  ${isCollapsed ? 'justify-center px-2' : ''}
                  hover:translate-y-[-1px] hover:shadow-md active:translate-y-0 active:scale-95
                `}>
                {/* Icon container with subtle hover effects */}
                <div className={`
                  w-8 h-8 flex items-center justify-center transition-all duration-300 ease-out flex-shrink-0 rounded-lg
                  ${item.active ? 'bg-white/20 border border-[#3e494c]/20' : 'group-hover:bg-white/10'}
                  group-hover:scale-105 group-active:scale-95
                `}>
                  <IconComponent className={`
                    w-4 h-4 transition-all duration-300 ease-out
                    ${item.active ? 'text-[#3e494c]' : 'text-soabra-text-secondary group-hover:text-[#3e494c]'}
                  `} />
                </div>
                
                {/* Label with smooth transitions */}
                <div className={`flex-1 flex items-center transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 translate-x-6 scale-95 w-0 overflow-hidden' : 'opacity-100 translate-x-0 scale-100 w-auto'}`} style={{
              transitionDelay: `${baseDelay}ms`
            }}>
                  {!isCollapsed && <>
                      <span className="tracking-wide text-sm transition-all duration-200 group-hover:font-medium">
                        {item.label}
                      </span>
                    </>}
                </div>
              </button>;
        })}
        </div>

        {/* Bottom Version with smooth transitions */}
        <div className={`mt-auto pt-4 transition-all duration-500 ease-in-out ${isCollapsed ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}`} style={{
        transitionDelay: isCollapsed ? '0ms' : '450ms'
      }}>
          {!isCollapsed && <div className="px-3 text-center">
              <div className="text-xs text-soabra-text-secondary/70 font-medium transition-all duration-300 hover:text-soabra-text-secondary">
                الإصدار 2.1.0
              </div>
            </div>}
        </div>
      </nav>
    </aside>;
};

export default Sidebar;
