
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

  return (
    <aside className={`bg-soabra-solid-bg z-sidebar h-full backdrop-blur-xl rounded-3xl transition-all duration-500 ease-in-out transform hover:shadow-lg ${isCollapsed ? 'w-20' : 'w-60'}`}>
      <nav className="flex flex-col gap-2 px-0 mx-[15px] my-[80px] py-[3px]">
        {/* Menu Title Section with Toggle */}
        <div className="text-center mb-2 rounded-full px-[8px] my-[27px] py-[40px]">
          <div className="flex items-center justify-between">
            <div className={`flex-1 transition-all duration-500 ease-in-out transform ${isCollapsed ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100 scale-100 translate-x-0'}`}>
              {!isCollapsed && (
                <h2 className="text-soabra-text-primary text-right text-xl font-medium px-3 animate-fade-in">
                  القائمة
                </h2>
              )}
            </div>
            <button 
              onClick={toggleSidebar} 
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-out border-2 border-[#3e494c]/50 hover:bg-white/20 hover:border-[#3e494c]/70 hover:scale-110 hover:shadow-md active:scale-95"
            >
              <div className={`transition-transform duration-300 ease-out ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                {isCollapsed ? 
                  <ChevronLeft className="w-4 h-4 text-[#3e494c] transition-all duration-200" /> : 
                  <ChevronRight className="w-4 h-4 text-[#3e494c] transition-all duration-200" />
                }
              </div>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button 
              key={index} 
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.8s ease-out both'
              }}
              className={`
                flex items-center gap-3 px-2 py-3 text-right transition-all duration-300 ease-out group relative overflow-hidden
                ${item.active ? 
                  'bg-white/25 text-[#3e494c] font-medium rounded-full shadow-md transform hover:scale-105' : 
                  'text-soabra-text-secondary hover:bg-white/15 hover:text-soabra-text-primary font-light rounded-3xl hover:scale-102 hover:shadow-sm'
                }
                ${isCollapsed ? 'justify-center' : ''}
                hover:translate-y-[-1px] active:translate-y-0 active:scale-100
              `}
            >
              {/* Animated background for active items */}
              {item.active && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full animate-shimmer" />
              )}
              
              {/* Circle around icon with enhanced animations */}
              <div className={`
                w-10 h-10 flex items-center justify-center transition-all duration-300 ease-out flex-shrink-0 border-2 relative z-10
                ${item.active ? 
                  'rounded-full bg-white/40 border-[#3e494c]/60 shadow-inner' : 
                  'rounded-full border-[#3e494c]/50 group-hover:border-[#3e494c]/70 group-hover:bg-white/10'
                }
                group-hover:scale-110 group-hover:rotate-3 group-active:scale-95 group-active:rotate-0
              `}>
                <IconComponent className={`
                  w-4 h-4 transition-all duration-300 ease-out
                  ${item.active ? 
                    'text-[#3e494c] drop-shadow-sm' : 
                    'group-hover:scale-110 group-hover:text-[#3e494c] group-hover:drop-shadow-sm'
                  }
                  group-hover:animate-pulse
                `} />
              </div>
              
              {/* Label with smooth transitions */}
              <div className={`flex-1 flex items-center transition-all duration-500 ease-in-out transform ${isCollapsed ? 'opacity-0 scale-95 translate-x-4 w-0' : 'opacity-100 scale-100 translate-x-0 w-auto'}`}>
                {!isCollapsed && (
                  <>
                    <span className="tracking-wide text-base font-light transition-all duration-200 group-hover:font-medium relative z-10">
                      {item.label}
                    </span>
                    {item.active && (
                      <div className="w-2 h-2 bg-[#3e494c] rounded-full animate-pulse ml-2 shadow-sm transform transition-all duration-300 group-hover:scale-125" />
                    )}
                  </>
                )}
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            </button>
          );
        })}

        {/* Bottom Decoration with smooth transitions */}
        <div className={`mt-auto pt-2 py-0 my-0 transition-all duration-500 ease-in-out transform ${isCollapsed ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
          {!isCollapsed && (
            <div className="px-2">
              <div className="text-center text-xs text-soabra-text-secondary/70 font-medium my-[45px] transition-all duration-300 hover:text-soabra-text-secondary/90 hover:scale-105">
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
