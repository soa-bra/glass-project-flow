
import { Home, FolderOpen, CheckSquare, Building, Users, Archive } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'الرئيسية', active: true },
    { icon: FolderOpen, label: 'المشاريع', active: false },
    { icon: CheckSquare, label: 'المهام', active: false },
    { icon: Building, label: 'الإدارات', active: false },
    { icon: Users, label: 'التخطيط التشاركي', active: false },
    { icon: Archive, label: 'الأرشيف', active: false },
  ];

  return (
    <aside className="w-60 bg-soabra-sidebar-bg border-l border-gray-200 z-sidebar h-full">
      <nav className="flex flex-col py-6 px-4 gap-2">
        {/* Logo/Title Section */}
        <div className="mb-8 px-2">
          <h1 className="text-heading-main text-center">
            نظام إدارة المشاريع
          </h1>
          <div className="text-center text-soabra-text-secondary text-sm mt-1">
            SoaBra
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <button
              key={index}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-right w-full
                ${item.active 
                  ? 'bg-soabra-primary-blue text-white shadow-lg' 
                  : 'hover:bg-white/20 text-soabra-text-primary hover:text-soabra-primary-blue'
                }
              `}
            >
              <IconComponent className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
