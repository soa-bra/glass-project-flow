
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { ProjectBoardProvider } from '@/contexts/ProjectBoardContext';
import { ProjectBoardMain } from '@/components/ProjectBoard/ProjectBoardMain';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectBoard } from '@/contexts/ProjectBoardContext';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { selectedProject, closeBoard, isBoardOpen } = useProjectBoard();

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
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
        <div className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'}`} style={{
          top: 'var(--sidebar-top-offset)',
          transition: 'all var(--animation-duration-main) var(--animation-easing)'
        }}>
          <div style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }} className="w-full h-full p-2 py-0 mx-0 px-[5px]">
            <ProjectsColumn />
          </div>
        </div>

        {/* Operations Board with sliding animation */}
        <AnimatePresence mode="wait">
          {!isBoardOpen && (
            <motion.main
              key="operations-board"
              style={{
                transition: 'all var(--animation-duration-main) var(--animation-easing)'
              }}
              className="mx-0"
              initial={{ x: 0, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ 
                x: '100%', 
                opacity: 0,
                transition: { 
                  duration: 0.35,
                  ease: [0.4, 0.0, 0.2, 1],
                  delay: 0.25
                }
              }}
              transition={{ 
                duration: 0.35,
                ease: [0.4, 0.0, 0.2, 1]
              }}
            >
              <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      {/* Project Board */}
      {selectedProject && (
        <ProjectBoardMain
          project={selectedProject}
          onClose={closeBoard}
          isVisible={isBoardOpen}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <ProjectBoardProvider>
      <MainContent />
    </ProjectBoardProvider>
  );
};

export default Index;
