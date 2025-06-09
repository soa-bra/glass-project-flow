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
  return <aside className={`bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-60'}`}>
      <nav className="flex flex-col gap-2 px-[10px] py-0 my-[60px]">
        {/* Menu Title Section with Toggle */}
        <div className="text-center mb-2 rounded-full px-[8px] py-[30px] my-0">
          <div className="flex items-center justify-between">
            {!isCollapsed && <h2 className="text-soabra-text-primary text-right text-xl font-medium flex-1 px-3">
                القائمة
              </h2>}
            <button onClick={toggleSidebar} className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-[#3e494c]/50 hover:bg-white/10">
              {isCollapsed ? <ChevronLeft className="w-4 h-4 text-[#3e494c]" /> : <ChevronRight className="w-4 h-4 text-[#3e494c]" />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        return <button key={index} style={{
          animationDelay: `${index * 0.1}s`,
          animation: 'fadeInUp 0.6s ease-out both'
        }} className={`
                flex items-center gap-3 px-2 py-2 text-right transition-all duration-300 group
                ${item.active ? 'bg-white/20 text-[#3e494c] font-medium rounded-full' : 'text-soabra-text-secondary hover:bg-white/10 hover:text-soabra-text-primary font-light rounded-3xl'}
                ${isCollapsed ? 'justify-center' : ''}
              `}>
              {/* Circle around icon with border */}
              <div className={`w-10 h-10 flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50 ${item.active ? 'rounded-full bg-white/30' : 'rounded-full'}`}>
                <IconComponent className={`w-4 h-4 transition-all duration-300 ${item.active ? 'text-[#3e494c]' : 'group-hover:scale-110'}`} />
              </div>
              {!isCollapsed && <>
                  <span className="tracking-wide flex-1 text-base font-light">{item.label}</span>
                  {item.active && <div className="w-2 h-2 bg-[#3e494c] rounded-full animate-pulse" />}
                </>}
            </button>;
      })}

        {/* Bottom Decoration */}
        {!isCollapsed && <div className="mt-auto pt-2">
            <div className="px-2">
              <div className="text-center text-xs text-soabra-text-secondary/70 font-medium">
                الإصدار 2.1.0
              </div>
            </div>
          </div>}
      </nav>
    </aside>;
};
export default Sidebar;