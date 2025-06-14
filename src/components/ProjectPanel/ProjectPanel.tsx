import React, { useEffect, useRef, useCallback } from 'react';
import type { ProjectCardProps } from '../ProjectCard/types';
import { X } from "lucide-react";

// لاسترجاع بيانات المشروع مباشرةً من mockProjects
const mockProjects = [
  {
    id: '1',
    title: 'تطوير الموقع الإلكتروني',
    description: 'تطوير موقع سوبرا',
    daysLeft: 11,
    tasksCount: 3,
    status: 'info' as const,
    date: 'May 25',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: false,
  },
  // ... keep existing mockProjects items ...
];

interface ProjectPanelProps {
  projectId: string | null;
  onClose: () => void;
}

const bgGrad = "bg-[linear-gradient(120deg,#e2e9fc_0%,#eddcff_60%,#fff3fa_100%)]";

const ProjectPanel: React.FC<ProjectPanelProps> = ({ projectId, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  const project = mockProjects.find((p) => p.id === projectId);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if(e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  }, [onClose]);

  if (!project) return null;

  return (
    <div 
      className="flex items-start justify-end h-full w-full glass-enhanced"
      style={{
        background: 'rgba(215,224,236,0.4)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        animation: 'fade-in 0.33s cubic-bezier(0.4,0,0.2,1)',
        borderRadius: '32px'
      }}
      onMouseDown={handleBackdropClick}
      dir="rtl"
    >
      <div
        ref={panelRef}
        className={`
          animate-slide-in-right 
          shadow-xl glass-enhanced rounded-tl-[40px] rounded-bl-[40px] 
          min-h-full max-h-full overflow-hidden
          ${bgGrad}
        `}
        style={{
          width: '100%',
          maxWidth: '100%',
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
        {/* مكان لباقي المحتوى */}
        <div className="px-10 pb-7">
          <div className="flex items-center justify-center min-h-[300px] text-gray-400/60 text-xl font-arabic font-medium">
            (هنا باقي مكونات اللوحة: الشارات والمراحل والتبويبات...)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;
