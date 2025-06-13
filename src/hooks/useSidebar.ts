
import { useState, useEffect, useCallback, useMemo } from 'react';
import { CSS_VARIABLES } from '@/constants';

interface UseSidebarProps {
  onToggle?: (collapsed: boolean) => void;
}

export const useSidebar = ({ onToggle }: UseSidebarProps = {}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => {
      const newCollapsedState = !prev;
      onToggle?.(newCollapsedState);
      return newCollapsedState;
    });
  }, [onToggle]);

  const sidebarStyle = useMemo(() => ({
    width: isCollapsed ? CSS_VARIABLES.SIDEBAR_WIDTH_COLLAPSED : CSS_VARIABLES.SIDEBAR_WIDTH_EXPANDED,
    transition: `all ${CSS_VARIABLES.ANIMATION_DURATION_MAIN} ${CSS_VARIABLES.ANIMATION_EASING}`
  }), [isCollapsed]);

  const titleContainerStyle = useMemo(() => ({
    transition: `all ${CSS_VARIABLES.ANIMATION_DURATION_MAIN} ${CSS_VARIABLES.ANIMATION_EASING}`,
    opacity: isCollapsed ? 0 : 1,
    transform: isCollapsed ? 'translateX(24px) scale(0.9)' : 'translateX(0) scale(1)',
    width: isCollapsed ? '0' : 'auto',
    transitionDelay: isCollapsed ? '0ms' : `calc(${CSS_VARIABLES.ANIMATION_DURATION_MAIN} * 0.4)`
  }), [isCollapsed]);

  const versionStyle = useMemo(() => ({
    opacity: isCollapsed ? 0 : 1,
    transform: isCollapsed ? 'translateY(24px) scale(0.9)' : 'translateY(0) scale(1)',
    height: isCollapsed ? '0' : 'auto',
    transition: `all ${CSS_VARIABLES.ANIMATION_DURATION_MAIN} ${CSS_VARIABLES.ANIMATION_EASING}`,
    transitionDelay: isCollapsed ? '0ms' : `calc(${CSS_VARIABLES.ANIMATION_DURATION_MAIN} * 0.8)`
  }), [isCollapsed]);

  useEffect(() => {
    onToggle?.(isCollapsed);
  }, [isCollapsed, onToggle]);

  return {
    isCollapsed,
    toggleSidebar,
    sidebarStyle,
    titleContainerStyle,
    versionStyle
  };
};
