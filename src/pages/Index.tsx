
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import ProjectPanel from '@/components/ProjectPanel';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isOpsPanelShifted, setIsOpsPanelShifted] = useState(false);

  console.log('Index render - panelOpen:', panelOpen, 'selectedProjectId:', selectedProjectId);

  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  const openProjectPanel = useCallback((projectId: string) => {
    console.log('فتح لوحة المشروع:', projectId);
    setSelectedProjectId(projectId);
    setPanelOpen(true);
    setIsOpsPanelShifted(true);
    // منع التمرير في الخلفية
    document.body.style.overflow = 'hidden';
  }, []);

  const closeProjectPanel = useCallback(() => {
    console.log('إغلاق لوحة المشروع');
    setPanelOpen(false);
    setIsOpsPanelShifted(false);
    // إعادة تفعيل التمرير
    document.body.style.overflow = 'auto';
    // تأخير إزالة المشروع المحدد للسماح بانتهاء الحركة
    setTimeout(() => {
      setSelectedProjectId(null);
    }, 300);
  }, []);

  // معالجة مفتاح Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && panelOpen) {
        closeProjectPanel();
      }
    };

    if (panelOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [panelOpen, closeProjectPanel]);

  // متغيرات الحركة للوحة العمليات
  const operationsVariants = {
    visible: { 
      x: 0, 
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    },
    hidden: { 
      x: 'calc(100% + 12px)', 
      opacity: 0.3,
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  // متغيرات الحركة لعمود المشاريع
  const projectsVariants = {
    normal: {
      width: 'var(--projects-width)',
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    },
    dimmed: {
      width: 'calc(var(--projects-width) * 0.9)',
      opacity: 0.6,
      filter: 'blur(1px)',
      transition: {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        <div 
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0 transition-all var(--animation-duration-main) var(--animation-easing)"
        >
          <Sidebar onToggle={handleSidebarToggle} />
        </div>

        {/* عمود المشاريع مع حركة التعتيم */}
        <motion.div 
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all var(--animation-duration-main) var(--animation-easing) ${
            isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'
          }`} 
          style={{
            top: 'var(--sidebar-top-offset)'
          }}
          variants={projectsVariants}
          animate={panelOpen ? 'dimmed' : 'normal'}
        >
          <div className="w-full h-full p-2 py-0 mx-0 px-[5px] transition-all var(--animation-duration-main) var(--animation-easing)">
            <ProjectsColumn onProjectSelect={openProjectPanel} />
          </div>
        </motion.div>

        {/* لوحة العمليات - تنزلق خارج الشاشة عند فتح لوحة المشروع */}
        <motion.div 
          className={`relative ${
            isSidebarCollapsed ? 'operations-board-collapsed' : 'operations-board-expanded'
          } h-[calc(100vh-var(--sidebar-top-offset))]`}
          style={{
            top: 'var(--sidebar-top-offset)'
          }}
          variants={operationsVariants}
          animate={panelOpen ? 'hidden' : 'visible'}
          id="operations-board"
        >
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
          
          {/* لوحة تحكم المشروع - تظهر فوق لوحة العمليات */}
          {panelOpen && selectedProjectId && (
            <ProjectPanel
              projectId={selectedProjectId}
              isVisible={panelOpen}
              onClose={closeProjectPanel}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export { Index };
export default Index;
