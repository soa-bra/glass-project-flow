
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useRef, useEffect, useCallback } from 'react';

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isOperationsBoardVisible, setIsOperationsBoardVisible] = useState(true);
  const projectDetailsRef = useRef<HTMLDivElement>(null);
  const lastClickTimeRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleProjectSelect = useCallback((projectId: string) => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    
    console.log('🔥 Index: handleProjectSelect called with projectId:', projectId);
    console.log('🔥 Current selectedProjectId:', selectedProjectId);
    console.log('🔥 Time since last click:', timeSinceLastClick, 'ms');
    
    // إلغاء أي timeout سابق
    if (debounceTimeoutRef.current) {
      console.log('🔥 Clearing previous debounce timeout');
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // تحديث وقت آخر نقرة
    lastClickTimeRef.current = now;
    
    // استخدام debounce لمنع النقرات المتعددة السريعة
    debounceTimeoutRef.current = setTimeout(() => {
      console.log('🔥 Debounce timeout executed - processing click');
      
      // إذا كان المشروع محدد بالفعل، قم بإلغاء التحديد وإغلاق لوحة التفاصيل
      if (selectedProjectId === projectId) {
        console.log('🔥 Same project clicked - deselecting');
        setSelectedProjectId(null);
        setIsOperationsBoardVisible(true);
        return;
      }
      
      // تحديد مشروع جديد
      console.log('🔥 New project selected:', projectId);
      setSelectedProjectId(projectId);
      setIsOperationsBoardVisible(false);
    }, 150); // debounce لمدة 150ms
  }, [selectedProjectId]);

  const handleResetSelection = useCallback(() => {
    console.log('🔥 handleResetSelection called');
    setSelectedProjectId(null);
    setIsOperationsBoardVisible(true);
  }, []);

  // إضافة مستمع الأحداث للنقر خارج لوحة تفاصيل المشروع
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedProjectId && projectDetailsRef.current && !projectDetailsRef.current.contains(event.target as Node)) {
        console.log('🔥 Click outside project details - resetting selection');
        handleResetSelection();
      }
    };
    
    if (selectedProjectId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // تنظيف timeout عند unmount
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [selectedProjectId, handleResetSelection]);

  // إضافة تسجيل للتغييرات في selectedProjectId
  useEffect(() => {
    console.log('🔥 selectedProjectId changed to:', selectedProjectId);
    console.log('🔥 isOperationsBoardVisible:', isOperationsBoardVisible);
  }, [selectedProjectId, isOperationsBoardVisible]);

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden mx-0 px-0">
      {/* Header - Fixed and no scroll */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden py-0 mx-0 my-0 px-0">
        {/* Sidebar - أقصى اليمين */}
        <div 
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out sidebar-layout my-0 px-0 py-0"
        >
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Projects Column - في الوسط */}
        <div 
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] transition-all duration-500 ease-in-out ${
            isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'
          }`} 
          style={{
            top: 'var(--sidebar-top-offset)',
          }}
        >
          <div className="bg-soabra-projects-bg rounded-t-3xl transition-all duration-300 hover:shadow-xl w-full h-full flex flex-col overflow-hidden px-0 mx-[25px]">
            <ScrollArea className="w-full h-full">
              <div className="p-2 px-0 overflow-y-auto overflow-x-hidden my-0 py-0 mx-[10px]">
                <ProjectsColumn 
                  onProjectSelect={handleProjectSelect} 
                  selectedProjectId={selectedProjectId}
                />
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Operations Board - أقصى اليسار */}
        <OperationsBoard 
          isVisible={isOperationsBoardVisible} 
          onClose={handleResetSelection}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Project Dashboard - سيتم إضافته في المستقبل */}
        {selectedProjectId && (
          <div 
            ref={projectDetailsRef} 
            className={`fixed bg-white/40 backdrop-blur-sm rounded-3xl shadow-lg transition-all duration-500 ease-in-out transform ${
              isSidebarCollapsed ? 'project-details-collapsed' : 'project-details-expanded'
            }`}
            style={{
              height: 'calc(100vh - 60px)',
              top: 'var(--sidebar-top-offset)',
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold">تفاصيل المشروع</h2>
                <p className="text-gray-500">رقم المشروع: {selectedProjectId}</p>
                <button 
                  onClick={handleResetSelection} 
                  className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-full"
                >
                  عودة إلى لوح التشغيل
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
