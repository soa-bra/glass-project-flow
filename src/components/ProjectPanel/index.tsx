
import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import ProjectPanelContent from "./ProjectPanelContent";
import { Project } from "@/types/project";

interface ProjectPanelProps {
  frameClass?: string;
  project: Project | null;
  showFull?: boolean;
  crossfade?: boolean;
  onClose: () => void;
  style?: React.CSSProperties;
}

const FADE_DURATION = 350;

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  frameClass = "",
  project,
  showFull,
  crossfade,
  onClose,
  style,
}) => {
  // محليًّا لإدارة تبديل تلاشي المحتوى
  const [fadeVisible, setFadeVisible] = useState(true);
  const [renderedProject, setRenderedProject] = useState<Project | null>(project);

  // Crossfade effect when switching projects inside open panel
  useEffect(() => {
    // Only fade if crossfade requested and new project is different
    if (crossfade && renderedProject && project && renderedProject.id !== project.id) {
      setFadeVisible(false);
      // After fade out
      const timer = setTimeout(() => {
        setRenderedProject(project);
        setFadeVisible(true);
      }, FADE_DURATION);
      return () => clearTimeout(timer);
    } else if (project && (!renderedProject || renderedProject.id !== project.id)) {
      setRenderedProject(project);
      setFadeVisible(true);
    }
  }, [project, crossfade, renderedProject]);

  // When fully closed, don't render panel at all unless animating out
  if (!project && !renderedProject) return null;

  // زر الإغلاق
  // مع دعم Glass/Blur، وخط IBM، والاتجاه الصحيح
  return (
    <div
      className={`fixed z-[1200] sync-transition ${frameClass} rtl-fix-panel`}
      style={{
        ...style,
        top: "var(--sidebar-top-offset)",
        height: "calc(100vh - var(--sidebar-top-offset))",
        borderRadius: "32px",
        background: "rgba(255,255,255,0.4)",
        boxShadow:
          "0 8px 32px rgba(31,38,135,0.14), inset 0 1px 0 rgba(255,255,255,0.4)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.2)",
        transition: "all var(--animation-duration-main) cubic-bezier(0.4,0,0.2,1)",
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

      {/* تلاشي المحتوى - كروس فيد */}
      <div
        className={`w-full h-full flex flex-col transition-opacity duration-[${FADE_DURATION}ms] ease-in-out ${fadeVisible && showFull ? 'opacity-100' : 'opacity-0'} `}
        style={{
          transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.4,0,0.2,1)`,
          willChange: "opacity",
        }}
      >
        {/* رأس اللوحة والمحتوى */}
        {renderedProject && (
          <>
            <div className="flex flex-col gap-2 pb-7 flex-shrink-0">
              <div className="flex items-baseline justify-between w-full">
                <div className="grow flex flex-col items-end min-w-0">
                  <div className="text-heading-main font-arabic text-right truncate" style={{fontSize:36,letterSpacing:"-0.5px"}}>
                    {renderedProject.title}
                  </div>
                  <div className="text-body-secondary font-arabic mt-1 text-right">{renderedProject.description}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-6 justify-end">
                <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-base font-arabic flex items-center gap-2 text-gray-900">
                  <span className="w-8 h-8 rounded-full bg-soabra-primary-blue/10 flex items-center justify-center text-soabra-primary-blue font-bold mr-1">
                    {renderedProject.owner[0]}
                  </span>
                  <span>{renderedProject.owner}</span>
                </div>
                <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-base font-arabic flex items-center gap-2 text-gray-900">
                  <span> {renderedProject.value} ر.س </span>
                </div>
                <div className="backdrop-blur-3xl bg-white/10 border border-white/20 rounded-full px-4 py-2 text-base font-arabic flex items-center gap-2 text-gray-900">
                  <span>داخلي</span>
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ProjectPanelContent project={renderedProject} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ProjectPanel;
