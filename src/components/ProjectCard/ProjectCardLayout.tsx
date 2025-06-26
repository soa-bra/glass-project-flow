
import { ReactNode, useRef, useCallback } from 'react';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  isSelected?: boolean;
  isOtherSelected?: boolean;
  onProjectSelect?: (projectId: string) => void;
}

const ProjectCardLayout = ({
  children,
  id,
  isSelected = false,
  isOtherSelected = false,
  onProjectSelect,
}: ProjectCardLayoutProps) => {
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressActiveRef = useRef(false);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.target && (event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }

    isPressActiveRef.current = true;
    pressTimerRef.current = setTimeout(() => {
      if (isPressActiveRef.current && onProjectSelect) {
        console.log('ضغط مطول على المشروع:', id);
        onProjectSelect(id);
      }
    }, 500); // 500ms للضغط المطول
  }, [id, onProjectSelect]);

  const handleMouseUp = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    isPressActiveRef.current = false;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    isPressActiveRef.current = false;
  }, []);

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.target && (event.target as HTMLElement).closest('[data-dropdown-trigger]')) {
      return;
    }

    // تحديد عادي عند النقر السريع
    if (onProjectSelect && !pressTimerRef.current) {
      onProjectSelect(id);
    }
  }, [id, onProjectSelect]);

  const getCardClasses = () => {
    const baseClasses =
      'project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer select-none';
    
    if (isSelected) {
      return `${baseClasses} project-card-selected`;
    }
    
    if (isOtherSelected) {
      return `${baseClasses} project-card-dimmed`;
    }
    
    return baseClasses;
  };

  return (
    <div
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={getCardClasses()}
      style={{
        background: '#e7f1f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default ProjectCardLayout;
