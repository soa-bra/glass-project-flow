
import React from 'react';
import { Home, FolderOpen, CheckSquare, Building, Users, Archive } from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
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

  return (
    <aside 
      className={`h-full backdrop-blur-xl rounded-3xl transition-all duration-300 ${
        isCollapsed ? 'w-[60px]' : 'w-full'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <nav className="flex flex-col gap-3 px-4 py-8">
        {/* Menu Title Section */}
        {!isCollapsed && (
          <div className="text-center mb-6 p-4">
            <h2 className="text-gray-800 text-2xl font-bold">
              القائمة
            </h2>
          </div>
        )}

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.6s ease-out both'
              }}
              className={`
                flex items-center gap-4 px-4 py-4 text-right transition-all duration-300 group
                ${item.active 
                  ? 'bg-white/60 text-gray-800 font-bold rounded-2xl shadow-lg border border-white/50' 
                  : 'text-gray-600 hover:bg-white/30 hover:text-gray-800 font-medium rounded-2xl border border-white/20'
                }
                ${isCollapsed ? 'justify-center px-2' : ''}
              `}
            >
              {/* Icon with enhanced styling */}
              <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 flex-shrink-0 rounded-2xl ${
                item.active 
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg' 
                  : 'bg-white/40 text-gray-600 group-hover:bg-white/60 border border-white/30'
              }`}
              style={item.active ? { 
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' 
              } : {}}>
                <IconComponent className={`w-5 h-5 transition-all duration-300 ${
                  item.active ? 'text-white' : 'group-hover:scale-110'
                }`} />
              </div>
              
              {!isCollapsed && (
                <>
                  <span className="tracking-wide flex-1 text-base">{item.label}</span>
                  {item.active && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg" 
                         style={{ boxShadow: '0 0 10px rgba(59, 130, 246, 0.6)' }} />
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* Bottom Decoration */}
        {!isCollapsed && (
          <div className="mt-auto pt-6">
            <div className="text-center p-4 bg-white/20 rounded-2xl border border-white/30 backdrop-blur-sm">
              <div className="text-sm text-gray-600 font-medium">
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
