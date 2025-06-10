
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isOperationsBoardVisible, setIsOperationsBoardVisible] = useState(true);
  const handleProjectSelect = (projectId: string) => {
    console.log('Selected project:', projectId);
    setSelectedProjectId(projectId);
    setIsOperationsBoardVisible(false); // إخفاء اللوح عند تحديد مشروع
    // يمكن إضافة منطق التنقل أو فتح تفاصيل المشروع هنا
  };
  const handleResetSelection = () => {
    setSelectedProjectId(null);
    setIsOperationsBoardVisible(true); // إظهار اللوح عند إلغاء تحديد المشروع
  };
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden mx-0 px-0">
      {/* Header - Fixed and no scroll */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden py-0 mx-0 my-0 px-0">
        {/* Sidebar - Fixed with consistent margin */}
        <div style={{
        marginRight: 'var(--sidebar-margin)',
        marginTop: '50px'
      }} className="fixed top-[var(--sidebar-top-offset)] right-0 h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out sidebar-layout my-0 py-0 px-0 mx-[20px]">
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Main Content Area - Responsive positioning with consistent margins */}
        <div className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'content-layout-collapsed' : 'content-layout-expanded'}`} style={{
        top: 'var(--sidebar-top-offset)',
        maxWidth: '500px',
        minWidth: '300px'
      }}>
          <div className="bg-soabra-projects-bg rounded-t-3xl transition-all duration-300 hover:shadow-xl w-full h-full flex flex-col overflow-hidden px-0 mx-[25px]">
            <ScrollArea className="w-full h-full">
              <div className="p-2 px-0 overflow-y-auto overflow-x-hidden my-0 py-0 mx-[10px]">
                <ProjectsColumn onProjectSelect={handleProjectSelect} />
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Operations Board */}
        <OperationsBoard isVisible={isOperationsBoardVisible} onClose={handleResetSelection} />

        {/* Project Dashboard - سيتم إضافته في المستقبل */}
        {selectedProjectId && <div className="fixed bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg transition-all duration-500 ease-in-out transform" style={{
        width: '60vw',
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        left: '10px'
      }}>
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">تفاصيل المشروع</h2>
                <p className="text-gray-500">رقم المشروع: {selectedProjectId}</p>
                <button onClick={handleResetSelection} className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full">
                  عودة إلى لوح التشغيل
                </button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
};
export default Index;
