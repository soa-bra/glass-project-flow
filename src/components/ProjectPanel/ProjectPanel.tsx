
import React, { useEffect, useRef, useCallback } from 'react';
import type { ProjectCardProps } from '../ProjectCard/types';
import { X } from "lucide-react";

interface ProjectPanelProps {
  project: ProjectCardProps;
  onClose: () => void;
  isClosing?: boolean;
}

const bgGrad = "bg-[linear-gradient(120deg,#e2e9fc_0%,#eddcff_60%,#fff3fa_100%)]";

const ANIMATION_DURATION = 300; // ms, نفس الوقت في tailwind أو أقصر

const ProjectPanel: React.FC<ProjectPanelProps> = ({
  project,
  onClose,
  isClosing = false
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Esc key to close
  useEffect(() => {
    if (isClosing) return; // لا تغلق أثناء الإغلاق بالفعل
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, isClosing]);

  // Click outside panel to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="fixed z-[1100] inset-0 flex items-start justify-end"
      style={{
        background: 'rgba(224,229,236,0.32)',
        backdropFilter: 'blur(2.5px)',
        WebkitBackdropFilter: 'blur(2.5px)',
        animation: 'fade-in 0.32s cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseDown={handleBackdropClick}
      dir="rtl"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        ref={panelRef}
        className={`
          ${isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'}
          shadow-xl glass-enhanced rounded-tl-[40px] rounded-bl-[40px] 
          min-h-screen max-h-screen overflow-hidden
          ${bgGrad}
        `}
        style={{
          width: 700,
          maxWidth: '92vw',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)'
        }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* زر الإغلاق */}
        <button
          className="absolute left-6 top-6 p-2 rounded-full hover:bg-white/70 transition scale-110 shadow"
          style={{ zIndex: 22 }}
          aria-label="إغلاق اللوحة"
          onClick={onClose}
        >
          <X size={32} strokeWidth={1.8} className='text-gray-800' />
        </button>
        {/* رأس اللوحة */}
        <div className="pt-8 px-10 pb-3 select-none">
          <div className="text-[2.1rem] md:text-[2.6rem] font-extrabold font-arabic text-right text-[#232A33] leading-tight tracking-tight" style={{letterSpacing: "-1.3px"}}>
            {project.title}
          </div>
          <div className="text-base font-arabic text-[#7366b8] mt-2">{project.description}</div>
        </div>
        {/* مكان لباقي المحتوى سيتم إكماله لاحقاً */}
        <div className="px-10 pb-7">
          {/* هنا تضاف عناصر الشارات - شريط التقدم - الأزرار ...إلخ */}
          <div className="flex items-center justify-center min-h-[300px] text-gray-400/60 text-xl font-arabic font-medium">
            (هنا باقي مكونات اللوحة: الشارات والمراحل والتبويبات...)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;
