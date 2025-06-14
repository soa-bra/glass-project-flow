import ProjectsToolbar from './ProjectsToolbar';
import ProjectCard from './ProjectCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useCallback, useRef } from 'react';
import ProjectPanel from './ProjectPanel/ProjectPanel';

const mockProjects = [
  // ... keep existing code (mockProjects definition as is) ...
];

const PANEL_ANIMATION_DURATION = 400; // ms

interface ProjectsColumnProps {
  onProjectPanelChange?: (opened: boolean) => void;
  onProjectPanelModeChange?: (mode: "closed" | "opening" | "open" | "closing") => void;
  isProjectPanelOpen?: boolean;
}

const ProjectsColumn = ({
  onProjectPanelChange,
  onProjectPanelModeChange,
  isProjectPanelOpen
}: ProjectsColumnProps) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isPanelClosing, setIsPanelClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);

  // فتح لوحة المشروع
  const handleCardClick = useCallback(
    (id: string) => {
      if (isPanelClosing || (activeProjectId === id && !isPanelClosing)) return;
      if (activeProjectId !== id) {
        // بدء فتح اللوحة
        onProjectPanelModeChange?.("opening");
        setTimeout(() => {
          setActiveProjectId(id);
          onProjectPanelModeChange?.("open");
          onProjectPanelChange?.(true);
        }, 60);
      } else {
        // إغلاق اللوحة (عكس فقط عند النقر على الفاتح)
        handleClosePanel();
      }
      setIsPanelClosing(false);
    },
    [activeProjectId, isPanelClosing, onProjectPanelChange, onProjectPanelModeChange]
  );

  // إغلاق اللوحة مع أنيميشن
  const handleClosePanel = useCallback(() => {
    if (!activeProjectId) return;
    setIsPanelClosing(true);
    onProjectPanelModeChange?.("closing");
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveProjectId(null);
      setIsPanelClosing(false);
      onProjectPanelChange?.(false);
      onProjectPanelModeChange?.("closed");
    }, PANEL_ANIMATION_DURATION);
  }, [activeProjectId, onProjectPanelChange, onProjectPanelModeChange]);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl bg-soabra-projects-bg mx-0">
      <div className="flex-shrink-0 px-4 pt-4">
        <ProjectsToolbar />
      </div>
      <div className="flex-1 overflow-hidden rounded-t-3xl relative">
        <ScrollArea className="h-full w-full z-10">
          <div className="space-y-2 pb-4 px-0 rounded-full mx-[10px] relative">
            {mockProjects.map(project => (
              <ProjectCard
                key={project.id}
                {...project}
                isActive={activeProjectId === project.id && !isPanelClosing}
                onClick={() => handleCardClick(project.id)}
              />
            ))}
          </div>
        </ScrollArea>
        {/* لوحة التحكم في المشروع (تأخذ كامل المساحة بدل overlay) */}
        {activeProjectId && (
          <div
            className={`
              fixed inset-0 top-[var(--header-height)] z-[1111]
              flex items-stretch justify-end
              pointer-events-auto
            `}
            style={{background: "transparent"}}
            dir="rtl"
          >
            <ProjectPanel
              project={mockProjects.find(p => p.id === activeProjectId)!}
              onClose={handleClosePanel}
              isClosing={isPanelClosing}
              mode="full"
              animationDuration={PANEL_ANIMATION_DURATION}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsColumn;
