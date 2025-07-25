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
    label: 'التخطيط التشاركي',
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
  return;
};
export default Sidebar;