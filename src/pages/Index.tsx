
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel/ProjectPanel';
import { useState, useRef } from 'react';

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // متغيرات لإدارة التسلسل الزمني للأنيميشن
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null); // المشروع المطلوب
  const [stage, setStage] = useState<'idle' | 'shifting-projects' | 'hiding-operations' | 'showing-panel'>('idle');
  const [showOperations, setShowOperations] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  // عند اختيار مشروع
  const handleProjectSelect = (projectId: string | null) => {
    if (projectId && projectId !== activeProjectId) {
      setActiveProjectId(projectId);
      setStage('shifting-projects');
      // ابدأ بانزياح عمود المشاريع قليلاً لليسار
      setTimeout(() => setStage('hiding-operations'), 220); // وقت الحركة 
      setTimeout(() => {
        setShowOperations(false); // أخفِ لوحة التشغيل
        setStage('showing-panel');
      }, 600);
      setTimeout(() => setShowPanel(true), 650); // أظهر اللوحة بعد إخفاء الوسط
    } else {
      // إلغاء تحديد مشروع: أخرج اللوحة أولاً ثم أعد الوسط
      setStage('idle');
      setShowPanel(false);
      setTimeout(() => {
        setShowOperations(true);
        setActiveProjectId(null);
      }, 430); // يتوافق زمنياً مع حركة خروج اللوحة
    }
  };

  // حالة الانيميشن:
  const isProjectPanelOpen = stage === 'showing-panel' && showPanel;

  // تحكم في انزياح عمود المشاريع (كلاسات CSS)
  const projectsShifted = (stage === 'shifting-projects' || stage === 'hiding-operations' || stage === 'showing-panel');

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>
      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        {/* Sidebar */}
        <div style={{
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }} className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0">
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>
        {/* Projects Column */}
        <div
          className={`
            fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-500
            ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'}
            ${projectsShifted ? 'translate-x-[-44px]' : 'translate-x-0'}
          `}
          style={{
            top: 'var(--sidebar-top-offset)',
            right: 0,
            width: 'var(--projects-column-width)',
            zIndex: 1010,
            transition: 'transform 0.38s cubic-bezier(0.4,0,0.2,1), all var(--animation-duration-main) var(--animation-easing)',
          }}
        >
          <div className="w-full h-full p-2 py-0 mx-0 px-[5px]">
            <ProjectsColumn
              activeProjectId={activeProjectId}
              onProjectSelect={handleProjectSelect}
            />
          </div>
        </div>
        {/* الجزء الرئيسي: لوحة الإدارة */}
        {showOperations && (
          <div
            className={`
              fixed z-[1020] transition-all duration-500 ease-in-out
              ${stage === 'hiding-operations' || stage === 'showing-panel' ? 'animate-fade-out pointer-events-none opacity-0 translate-x-[-40px] scale-95' : 'opacity-100 translate-x-0 scale-100'}
            `}
            style={{
              top: 'var(--sidebar-top-offset)',
              right: `calc(var(--projects-column-width))`,
              height: 'calc(100vh - var(--sidebar-top-offset))',
              width: 'calc(100vw - var(--projects-column-width) - var(--sidebar-width-expanded))',
              transition:
                'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.44s cubic-bezier(0.4,0,0.2,1), scale 0.35s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
          </div>
        )}
        {/* لوحة المشروع - تظهر بعد خروج الوسط */}
        {showPanel && (
          <div
            className="fixed z-[1050] h-[calc(100vh-var(--sidebar-top-offset))] animate-slide-in-right"
            style={{
              top: 'var(--sidebar-top-offset)',
              right: `calc(var(--projects-column-width))`,
              width: 'calc(100vw - var(--projects-column-width) - var(--sidebar-width-expanded))',
              transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.3s cubic-bezier(0.4,0,0.2,1)'
            }}
          >
            <ProjectPanel
              projectId={activeProjectId}
              onClose={() => handleProjectSelect(null)}
              onExited={() => {
                setShowPanel(false);
                setStage('idle');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
