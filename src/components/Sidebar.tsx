
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
    <aside className={`h-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-full'} overflow-hidden`}>
      <nav className="flex flex-col h-full p-4">
        {/* Header Section with Toggle */}
        <div className="flex items-center justify-between mb-8 pt-4">
          {!isCollapsed && (
            <h2 className="text-gray-800 text-right text-lg font-semibold flex-1 px-2">
              القائمة الرئيسية
            </h2>
          )}
          <button 
            onClick={toggleSidebar} 
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 bg-white shadow-md hover:shadow-lg border border-gray-200 hover:bg-blue-50"
          >
            {isCollapsed ? 
              <ChevronLeft className="w-4 h-4 text-gray-600" /> : 
              <ChevronRight className="w-4 h-4 text-gray-600" />
            }
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <button
                key={index}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 text-right transition-all duration-300 group rounded-xl
                  ${item.active ? 
                    'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' : 
                    'text-gray-600 hover:bg-white hover:shadow-md hover:text-gray-800'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out both'
                }}
              >
                <div className={`w-8 h-8 flex items-center justify-center transition-all duration-300 flex-shrink-0 rounded-lg ${item.active ? 'bg-white/20' : 'group-hover:bg-blue-50'}`}>
                  <IconComponent className={`w-4 h-4 transition-all duration-300 ${item.active ? 'text-white' : 'group-hover:text-blue-600 group-hover:scale-110'}`} />
                </div>
                {!isCollapsed && (
                  <>
                    <span className="tracking-wide flex-1 text-sm font-medium">{item.label}</span>
                    {item.active && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Section */}
        {!isCollapsed && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500 font-medium">
              الإصدار 2.1.0
            </div>
            <div className="mt-2 bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full opacity-30"></div>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
