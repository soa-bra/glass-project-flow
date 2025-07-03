import React, { useState } from 'react';
import { 
  CalendarDays, 
  Target, 
  Users, 
  FileText,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';

const CollaborativePlanningSidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('overview');

  const menuItems = [
    { icon: Target, label: 'نظرة عامة', key: 'overview' },
    { icon: CalendarDays, label: 'الجدولة', key: 'schedule' },
    { icon: Users, label: 'الفرق', key: 'teams' },
    { icon: FileText, label: 'المهام', key: 'tasks' },
    { icon: BarChart3, label: 'التحليلات', key: 'analytics' },
    { icon: Bell, label: 'التنبيهات', key: 'notifications' },
    { icon: Settings, label: 'الإعدادات', key: 'settings' }
  ];

  return (
    <aside className="h-full flex flex-col py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xs font-medium text-muted-foreground">التخطيط التشاركي</h3>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-2 px-3">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeItem === item.key;
          
          return (
            <button
              key={item.key}
              onClick={() => setActiveItem(item.key)}
              className={`
                w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
                ${isActive 
                  ? 'bg-primary/20 text-primary shadow-md' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              title={item.label}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-auto px-3">
        <div className="bg-muted/50 rounded-2xl p-3 text-center">
          <div className="text-lg font-bold text-foreground">12</div>
          <div className="text-xs text-muted-foreground">مهام نشطة</div>
        </div>
      </div>
    </aside>
  );
};

export default CollaborativePlanningSidebar;