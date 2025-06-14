
import { ReactNode, useCallback, useState, useEffect } from 'react';

interface ProjectCardLayoutProps {
  children: ReactNode;
  id: string;
  onProjectSelect?: (projectId: string) => void;
}

const ProjectCardLayout: React.FC<ProjectCardLayoutProps> = ({
  children,
  id,
  onProjectSelect,
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    
    setClickCount(prev => prev + 1);
    
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (clickCount === 0) {
        // نقرة واحدة - فتح اللوحة
        console.log('النقر على كارت المشروع:', id);
        onProjectSelect?.(id);
      } else if (clickCount === 1) {
        // نقرة مزدوجة - إغلاق اللوحة
        console.log('النقر المزدوج - إغلاق اللوحة');
        // نحتاج إلى إرسال إشارة إغلاق
        const closeEvent = new CustomEvent('closeProjectPanel');
        window.dispatchEvent(closeEvent);
      }
      setClickCount(0);
    }, 300);

    setClickTimer(timer);
  }, [id, onProjectSelect, clickCount, clickTimer]);

  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  const cardClasses = `
    project-card-glass project-card-hover rounded-[40px] p-2 mx-auto my-1 cursor-pointer 
    transition-all duration-200 ease-out hover:scale-[1.02]
  `;

  return (
    <div onClick={handleClick} className={cardClasses}>
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export { ProjectCardLayout };
export default ProjectCardLayout;
