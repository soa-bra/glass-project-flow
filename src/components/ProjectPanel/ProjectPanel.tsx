
import React, { useEffect, useRef, useCallback } from 'react';
import type { ProjectCardProps } from '../ProjectCard/types';
import { X } from "lucide-react";

interface ProjectPanelProps {
  project: ProjectCardProps;
  onClose: () => void;
  isClosing?: boolean;
  mode?: "full" | "popover";
  animationDuration?: number;
}

const bgGrad = "bg-[linear-gradient(120deg,#e2e9fc_0%,#eddcff_60%,#fff3fa_100%)]";

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  project,
  onClose,
  isClosing = false,
  mode = "popover",
  animationDuration = 400,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc key to close
  useEffect(() => {
    if (isClosing) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, isClosing]);

  // Click outside panel to close (optional، لأن الآن اللوحة تغطي كل شيء غالبًا)
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  // إذا وضعت mode=full، نستخدم أنيميشن وتمدد مناسبة
  return (
    <div
      className={`
        flex-1 flex flex-col h-full relative z-[1111]
        bg-transparent
        transition-all
      `}
      style={{
        animation: isClosing
          ? `slide-out-right ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`
          : `slide-in-right ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`,
        overflow: "visible"
      }}
      onMouseDown={handleBackdropClick}
      dir="rtl"
      aria-modal="true"
      tabIndex={-1}
    >
      {/* حاوية اللوحة الداخلية */}
      <div
        ref={panelRef}
        className={`
          glass-enhanced shadow-2xl rounded-tl-[40px] rounded-bl-[40px]
          flex flex-col min-h-full max-h-full
          ${bgGrad}
          border-r-[4px] border-[#ede0ff]/70
        `}
        style={{
          transition: `all ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)`,
          width: "100%",
          maxWidth: "100vw",
          marginLeft: 0,
          boxShadow: "0 8px 80px 0 #cebfff25, 0 3px 30px 0 #9072b440",
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: "rgba(255,255,255,0.44)",
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          className="absolute left-6 top-6 p-2 rounded-full hover:bg-white/70 transition scale-110 shadow"
          style={{ zIndex: 22, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
          aria-label="إغلاق اللوحة"
          onClick={onClose}
        >
          <X size={32} strokeWidth={1.8} className='text-gray-800' />
        </button>
        {/* رأس اللوحة */}
        <div className="pt-8 px-10 pb-3 select-none">
          <div
            className="text-[2.1rem] md:text-[2.6rem] font-extrabold font-arabic text-right text-[#232A33] leading-tight tracking-tight"
            style={{ letterSpacing: "-1.3px", fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}
          >
            {project.title}
          </div>
          <div className="text-base font-arabic text-[#7366b8] mt-2">{project.description}</div>
        </div>
        {/* مكان لباقي المحتوى */}
        <div className="px-10 pb-7">
          {/* هنا تضاف مكونات الشارات - شريط التقدم... */}
          <div className="flex items-center justify-center min-h-[300px] text-gray-400/60 text-xl font-arabic font-medium">
            (هنا باقي مكونات اللوحة: الشارات والمراحل والتبويبات...)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;
