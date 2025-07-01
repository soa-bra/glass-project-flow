
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Building2, 
  Menu, 
  X,
  Users,
  Lightbulb,
  Archive,
  Settings,
  Home
} from 'lucide-react';

interface SidebarProps {
  onToggle: (collapsed: boolean) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle, activeSection, onSectionChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle(newCollapsed);
  };

  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'projects', label: 'المشاريع', icon: FolderOpen },
    { id: 'departments', label: 'الإدارات', icon: Building2 },
    { id: 'planning', label: 'التخطيط التشاركي', icon: Users },
    { id: 'archive', label: 'الأرشيف', icon: Archive },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  return (
    <div className={cn(
      "bg-white rounded-3xl shadow-lg transition-all duration-300 ease-in-out flex flex-col h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <h1 className="font-bold text-gray-900">سـوبــرا</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100"
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 font-normal transition-all duration-200",
                isCollapsed && "justify-center px-0",
                isActive && "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className={cn("h-5 w-5", isCollapsed && "mx-auto")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lightbulb className="h-4 w-4" />
            <span>نظام إدارة متكامل</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
