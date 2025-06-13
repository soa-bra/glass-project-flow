
import React, { useState, useCallback } from 'react';
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

  console.log('Index render - panelOpen:', panelOpen, 'selectedProjectId:', selectedProjectId);

  const handleSidebarToggle = useCallback((collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  }, []);

  const openProjectPanel = useCallback((projectId: string) => {
    console.log('فتح لوحة المشروع:', projectId);
    setSelectedProjectId(projectId);
    setPanelOpen(true);
  }, []);

  const closeProjectPanel = useCallback(() => {
    console.log('إغلاق لوحة المشروع');
    setPanelOpen(false);
    // تأخير إزالة المشروع المحدد للسماح بانتهاء الحركة
    setTimeout(() => {
      setSelectedProjectId(null);
    }, 300);
  }, []);

  // متغيرات الحركة للوحة العمليات
  const operationsVariants = {
    visible: { x: 0, opacity: 1 },
    hidden: { x: '-100%', opacity: 0 }
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

        <div 
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all var(--animation-duration-main) var(--animation-easing) ${
            isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'
          }`} 
          style={{
            top: 'var(--sidebar-top-offset)'
          }}
        >
          <div className="w-full h-full p-2 py-0 mx-0 px-[5px] transition-all var(--animation-duration-main) var(--animation-easing)">
            <ProjectsColumn onProjectSelect={openProjectPanel} />
          </div>
        </div>

        {/* لوحة العمليات - تنزلق خارج الشاشة عند فتح لوحة المشروع */}
        <motion.div 
          className="mx-0"
          variants={operationsVariants}
          animate={panelOpen ? 'hidden' : 'visible'}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </motion.div>
      </div>

      {/* لوحة تحكم المشروع */}
      {panelOpen && selectedProjectId && (
        <ProjectPanel
          projectId={selectedProjectId}
          isVisible={panelOpen}
          onClose={closeProjectPanel}
        />
      )}
    </div>
  );
};

export { Index };
export default Index;
