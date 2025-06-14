
import React from "react";
import { X } from "lucide-react";
import ProjectPanelContent from "./ProjectPanelContent";
import { Project } from "@/types/project";

interface ProjectPanelProps {
  frameClass?: string;
  project: Project;
  showFull?: boolean;
  onClose: () => void;
  isContentVisible?: boolean;
  isSidebarCollapsed?: boolean;
}

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  frameClass = "",
  project,
  showFull,
  onClose,
  isContentVisible,
  isSidebarCollapsed,
}) => {
  const layoutClass = isSidebarCollapsed ? 'project-details-collapsed' : 'project-details-expanded';

  return (
    <div
      className={`fixed z-[1200] sync-transition ${frameClass} ${layoutClass} rtl-fix-panel`}
      style={{
        top: "var(--sidebar-top-offset)",
        height: "calc(100vh - var(--sidebar-top-offset))",
        borderRadius: "32px",
        background: "rgba(255,255,255,0.4)",
        boxShadow:
          "0 8px 32px rgba(31,38,135,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.2)",
        padding: "48px 54px 36px 54px",
        display: "flex",
        flexDirection: "column",
        pointerEvents: showFull ? "auto" : "none",
        overflow: "hidden",
      }}
    >
      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className="absolute top-5 left-6 rounded-full bg-white/70 hover:bg-white/100 shadow-lg border border-white/30 w-[40px] h-[40px] flex items-center justify-center transition z-10"
        tabIndex={0}
        aria-label="إغلاق لوحة المشروع"
      >
        <X className="text-gray-700" size={28} />
      </button>

      {/* غلاف المحتوى للتحكم في التلاشي مع حركة أنيقة */}
      <div className={`w-full h-full flex flex-col transition-all duration-300 ease-in-out ${isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* رأس اللوحة */}
        <div className="flex flex-col gap-2 pb-7 flex-shrink-0">
          <div className="flex items-baseline justify-between w-full">
            {/* عنوان المشروع */}
            <div className="grow flex flex-col items-end min-w-0">
              <div className="text-heading-main font-arabic text-right truncate" style={{fontSize:36,letterSpacing:"-0.5px"}}>
                {project.title}
              </div>
              <div className="text-body-secondary font-arabic mt-1 text-right">{project.description}</div>
            </div>
          </div>
          {/* شارات ميتا (مالك، قيمة، نوع) */}
          <div className="flex gap-2 mt-6 justify-end">
            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-base font-arabic flex items-center gap-2 text-gray-900">
              <span className="w-8 h-8 rounded-full bg-soabra-primary-blue/10 flex items-center justify-center text-soabra-primary-blue font-bold mr-1">
                {project.owner[0]}
              </span>
              <span>{project.owner}</span>
            </div>
            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-base font-arabic flex items-center gap-2 text-gray-900">
              <span> {project.value} ر.س </span>
            </div>
            <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-base font-arabic flex items-center gap-2 text-gray-900">
              <span>داخلي</span>
            </div>
          </div>
        </div>
        {/* محتوى اللوحة الداخلية مع كل التفاصيل */}
        <div className="flex-1 min-h-0">
          <ProjectPanelContent project={project} />
        </div>
      </div>
    </div>
  );
};
export default ProjectPanel;
