
import { Home, FolderOpen, CheckSquare, Building, Users, Archive, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      icon: Home,
      label: 'الرئيسية',
      active: true
    },
    {
      icon: FolderOpen,
      label: 'المشاريع',
      active: false
    },
    {
      icon: CheckSquare,
      label: 'المهام',
      active: false
    },
    {
      icon: Building,
      label: 'الإدارات',
      active: false
    },
    {
      icon: Users,
      label: 'التخطيط التشاركي',
      active: false
    },
    {
      icon: Archive,
      label: 'الأرشيف',
      active: false
    }
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`bg-soabra-sidebar-bg h-full transition-all duration-300 ${
      isCollapsed ? 'w-[30px]' : 'w-[80px]'
    }`}>
      <nav className="flex flex-col gap-2 py-4 px-2">
        {/* Menu Title Section with Toggle */}
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h2 className="text-soabra-text-primary text-right text-sm font-medium flex-1 px-2">
              القائمة
            </h2>
          )}
          <button 
            onClick={toggleSidebar} 
            className="w-6 h-6 rounded flex items-center justify-center transition-all duration-300 hover:bg-black/10"
          >
            {isCollapsed ? (
              <ChevronLeft className="w-3 h-3 text-soabra-text-primary" />
            ) : (
              <ChevronRight className="w-3 h-3 text-soabra-text-primary" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              className={`
                flex items-center gap-2 px-2 py-2 text-right transition-all duration-300 group
                ${item.active 
                  ? 'bg-black/20 text-soabra-text-primary font-medium rounded' 
                  : 'text-soabra-text-secondary hover:bg-black/10 hover:text-soabra-text-primary font-light rounded'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              {/* Icon */}
              <div className={`w-8 h-8 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                item.active ? 'rounded bg-black/10' : 'rounded'
              }`}>
                <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                  item.active ? 'text-soabra-text-primary' : 'group-hover:scale-110'
                }`} />
              </div>
              
              {!isCollapsed && (
                <>
                  <span className="tracking-wide flex-1 text-xs font-light">
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="w-2 h-2 bg-soabra-text-primary rounded-full animate-pulse" />
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* Bottom Decoration */}
        {!isCollapsed && (
          <div className="mt-auto pt-2">
            <div className="px-2">
              <div className="text-center text-xs text-soabra-text-secondary/70 font-medium">
                الإصدار 2.1.0
              </div>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
