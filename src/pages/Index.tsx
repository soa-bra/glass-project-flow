import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { useState } from 'react';
import ProjectPanel from '@/components/ProjectPanel';

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
    hasOverdueTasks: false
  }, {
    id: '2',
    title: 'حملة التعريف',
    description: 'حملة التعريف بسوبرا وخدماتها',
    daysLeft: 20,
    tasksCount: 10,
    status: 'success' as const,
    date: 'Aug 11',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: false
  }, {
    id: '3',
    title: 'صفحات التواصل',
    description: 'تطوير صفحات سوبرا بمنصات التواصل الاجتماعي',
    daysLeft: 30,
    tasksCount: 5,
    status: 'info' as const,
    date: 'Mar 07',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: true
  }, {
    id: '4',
    title: 'المؤتمرات الثقافية',
    description: 'تطوير مؤتمرات سوبرا لقياس الجوانب الثقافية للعلامة',
    daysLeft: 25,
    tasksCount: 6,
    status: 'success' as const,
    date: 'Jul 15',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: false,
    hasOverdueTasks: false
  }, {
    id: '5',
    title: 'العلامة الثقافية للعميل',
    description: 'تقديم خدمة تطوير العلامة الثقافية لصالح Velva',
    daysLeft: 18,
    tasksCount: 15,
    status: 'warning' as const,
    date: 'Jun 27',
    owner: 'د. أسامة',
    value: '15K',
    isOverBudget: true,
    hasOverdueTasks: false
  }, {
    id: '6',
    title: 'تطبيق الهاتف المحمول',
    description: 'تطوير تطبيق سوبرا للهواتف الذكية',
    daysLeft: 45,
    tasksCount: 8,
    status: 'info' as const,
    date: 'Dec 10',
    owner: 'م. سارة',
    value: '25K',
    isOverBudget: false,
    hasOverdueTasks: false
  }, {
    id: '7',
    title: 'نظام إدارة المحتوى',
    description: 'بناء نظام إدارة المحتوى الخاص بسوبرا',
    daysLeft: 7,
    tasksCount: 12,
    status: 'error' as const,
    date: 'Sep 03',
    owner: 'م. أحمد',
    value: '30K',
    isOverBudget: true,
    hasOverdueTasks: true
  }, {
    id: '8',
    title: 'استراتيجية التسويق الرقمي',
    description: 'وضع خطة شاملة للتسويق الرقمي والإعلانات',
    daysLeft: 35,
    tasksCount: 7,
    status: 'success' as const,
    date: 'Nov 18',
    owner: 'أ. فاطمة',
    value: '20K',
    isOverBudget: false,
    hasOverdueTasks: false
  }, {
    id: '9',
    title: 'تحليل البيانات والذكاء الاصطناعي',
    description: 'تطوير نظام تحليل البيانات باستخدام الذكاء الاصطناعي',
    daysLeft: 60,
    tasksCount: 20,
    status: 'warning' as const,
    date: 'Jan 15',
    owner: 'د. محمد',
    value: '50K',
    isOverBudget: false,
    hasOverdueTasks: false
  }
];

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  // لإخفاء محتوى عمليات المشروع أثناء الحركة فلا يظهر فجأة
  const [isPanelFullyOpen, setIsPanelFullyOpen] = useState(false);

  // الخطوة الأولى: إمساك بيانات المشروع المختار من mock
  const selectedProject = selectedProjectId
    ? mockProjects.find((p) => p.id === selectedProjectId)
    : null;

  // إدارة مراحل الحركة التفاعلية (فريمات الأنيميشن): frame 1..6
  const [projectPanelStage, setProjectPanelStage] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6>(0);

  // الخطوة الثانية: عند اختيار بطاقة مشروع تبدأ الأنيميشن المتسلسلة
  const handleProjectSelect = (projectId: string) => {
    if (selectedProjectId === projectId) {
      // غلق اللوحة عند النقر ثانيةً أو عند X
      setProjectPanelStage(0);
      setTimeout(() => {
        setSelectedProjectId(null);
        setIsPanelFullyOpen(false);
      }, 700);
      return;
    }
    // اختيار جديد: استرجاع البيانات وبدء الأنيميشن
    setSelectedProjectId(projectId);
    setProjectPanelStage(1);
    setTimeout(() => setProjectPanelStage(2), 90);      // فريم ٢ (بداية تشكل اللوحة)
    setTimeout(() => setProjectPanelStage(3), 210);     // فريم ٣ (تبدأ الإزاحة)
    setTimeout(() => setProjectPanelStage(4), 320);     // فريم ٤ (تستمر الحركة/SCALE-X)
    setTimeout(() => setProjectPanelStage(5), 490);     // فريم ٥
    setTimeout(() => { setProjectPanelStage(6); setIsPanelFullyOpen(true); }, 650); // النهاية
  };

  // إغلاق اللوحة عند النقر خارجها أو X
  const closePanel = () => {
    setProjectPanelStage(0);
    setTimeout(() => {
      setSelectedProjectId(null);
      setIsPanelFullyOpen(false);
    }, 700);
  };

  // منطق إزاحة لوحة التشغيل/لوحة المشروع اعتمادًا على المرحلة
  let operationsBoardClass = '';
  let projectPanelClass = '';
  let projectsColumnClass = '';

  if (selectedProjectId) {
    // حركة العمليات: تزحزح ثم تصغر وتختفي في عدة مراحل
    if (projectPanelStage === 1) {
      operationsBoardClass = 'z-30 sync-transition translate-x-0 scale-x-100 opacity-100';
      projectPanelClass = 'project-panel-frame1';
      projectsColumnClass = '';
    }
    else if (projectPanelStage === 2) {
      operationsBoardClass = 'z-30 sync-transition translate-x-0 scale-x-100 opacity-100';
      projectPanelClass = 'project-panel-frame2';
    }
    else if (projectPanelStage === 3) {
      operationsBoardClass = 'z-30 sync-transition translate-x-[22vw] scale-x-95 opacity-95';
      projectPanelClass = 'project-panel-frame3';
      projectsColumnClass = '';
    }
    else if (projectPanelStage === 4) {
      operationsBoardClass = 'z-30 sync-transition translate-x-[34vw] scale-x-75 opacity-65';
      projectPanelClass = 'project-panel-frame4';
    }
    else if (projectPanelStage === 5) {
      operationsBoardClass = 'z-30 sync-transition translate-x-[46vw] scale-x-35 opacity-40';
      projectPanelClass = 'project-panel-frame5';
    }
    else if (projectPanelStage === 6) {
      operationsBoardClass = 'z-10 sync-transition opacity-0 pointer-events-none';
      projectPanelClass = 'project-panel-frame6';
    }
  }

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>
      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        {/* Sidebar */}
        <div
          style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0"
        >
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>
        {/* Projects Column */}
        <div
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'} ${projectsColumnClass}`}
          style={{
            top: 'var(--sidebar-top-offset)',
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
        >
          <div
            style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
            className="w-full h-full p-2 py-0 mx-0 px-[5px]"
          >
            <ProjectsColumn
              projects={mockProjects}
              selectedProjectId={selectedProjectId}
              onProjectSelect={handleProjectSelect}
            />
          </div>
        </div>
        {/* Operations Board */}
        <div
          style={{ transition: 'all var(--animation-duration-main) var(--animation-easing)' }}
          className={`mx-0 ${operationsBoardClass ?? ''}`}
        >
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </div>
        {/* Project Panel Animated */}
        {!!selectedProject && (
          <ProjectPanel
            frameClass={projectPanelClass}
            project={selectedProject}
            showFull={isPanelFullyOpen}
            onClose={closePanel}
          />
        )}
      </div>
    </div>
  );
};
export default Index;
