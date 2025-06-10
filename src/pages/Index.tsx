import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const handleProjectSelect = (projectId: string) => {
    console.log('Selected project:', projectId);
    // يمكن إضافة منطق التنقل أو فتح تفاصيل المشروع هنا
  };
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      {/* Header - Fixed and no scroll */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden">
        {/* Sidebar - Fixed with consistent margin */}
        <div className="fixed top-[var(--sidebar-top-offset)] right-0 h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out sidebar-layout" style={{
        marginRight: 'var(--sidebar-margin)',
        marginTop: '50px'
      }}>
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Main Content Area - Responsive positioning with consistent margins */}
        <div className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'content-layout-collapsed' : 'content-layout-expanded'}`} style={{
        top: 'var(--sidebar-top-offset)',
        maxWidth: '500px',
        minWidth: '300px'
      }}>
          <div className="bg-soabra-projects-bg rounded-t-3xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform w-full h-full flex flex-col mx-[var(--sidebar-margin)] px-[5px]">
            <ScrollArea className="w-full h-full">
              <div className="p-2 mx-[5px] my-0 px-0 py-0">
                <ProjectsColumn onProjectSelect={handleProjectSelect} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;