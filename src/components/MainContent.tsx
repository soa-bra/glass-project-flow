
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import OperationsBoard from '@/components/OperationsBoard';

const MainContent = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
      {/* Sidebar */}
      <div
        style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
        className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0"
      >
        <Sidebar onToggle={setIsSidebarCollapsed} />
      </div>

      <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
    </div>
  );
};
export default MainContent;
