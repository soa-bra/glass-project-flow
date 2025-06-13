
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import ProjectsColumn from '@/components/ProjectsColumn';
import OperationsBoard from '@/components/OperationsBoard';
import { ProjectBoard } from '@/components/project/ProjectBoard';
import { useState } from 'react';
import { Project } from '@/types/project';

// بيانات وهمية للمشروع
const mockProject: Project = {
  id: 'project-1',
  title: 'تطوير الموقع الإلكتروني',
  description: 'تطوير الواجهة الإلكترونية الداخلية لإدارة عمليات سوبرا الشاملة وإدارة جميع مواردها وأصولها من الألف إلى الياء والمقارنة بكمها',
  daysLeft: 45,
  tasksCount: 23,
  status: 'warning',
  date: '2024-06-13',
  owner: 'د. أسامة',
  value: '15,000 ر.س',
  progress: 67,
  budget: {
    total: 150000,
    spent: 95000
  },
  timeline: [
    {
      id: '1',
      date: '2024-06-15',
      title: 'مراجعة التصميم',
      department: 'التصميم',
      status: 'pending'
    },
    {
      id: '2',
      date: '2024-06-20',
      title: 'تطوير الواجهة',
      department: 'التطوير',
      status: 'pending'
    },
    {
      id: '3',
      date: '2024-06-25',
      title: 'اختبار النظام',
      department: 'الجودة',
      status: 'pending'
    }
  ],
  tasks: [
    {
      id: '1',
      title: 'تطوير صفحة الرئيسية',
      status: 'completed',
      assignee: 'أحمد محمد',
      dueDate: '2024-06-10',
      priority: 'high'
    },
    {
      id: '2',
      title: 'تطوير لوحة التحكم',
      status: 'in-progress',
      assignee: 'سارة أحمد',
      dueDate: '2024-06-20',
      priority: 'high'
    },
    {
      id: '3',
      title: 'اختبار الأمان',
      status: 'pending',
      assignee: 'محمد علي',
      dueDate: '2024-06-25',
      priority: 'medium'
    }
  ],
  team: [
    {
      id: '1',
      name: 'أحمد محمد',
      role: 'مطور واجهات',
      hoursAssigned: 40
    },
    {
      id: '2',
      name: 'سارة أحمد',
      role: 'مطورة خلفية',
      hoursAssigned: 35
    },
    {
      id: '3',
      name: 'محمد علي',
      role: 'مختبر جودة',
      hoursAssigned: 20
    }
  ],
  contracts: [
    {
      id: '1',
      name: 'عقد التطوير الأساسي',
      status: 'active',
      expiryDate: '2024-12-31',
      value: 100000
    },
    {
      id: '2',
      name: 'عقد الاستضافة',
      status: 'active',
      expiryDate: '2025-06-30',
      value: 25000
    }
  ]
};

const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleProjectSelect = () => {
    setSelectedProject(mockProject);
  };

  const handleCloseBoard = () => {
    setSelectedProject(null);
  };

  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[var(--header-height)] overflow-hidden mx-0 px-0">
        {/* Sidebar with enhanced animation synchronization */}
        <div 
          style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }} 
          className="fixed top-[var(--sidebar-top-offset)] h-[calc(100vh-var(--sidebar-top-offset))] bg-soabra-solid-bg z-sidebar sidebar-layout px-0 mx-0"
        >
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Projects Column with synchronized animation */}
        <div 
          className={`fixed h-[calc(100vh-var(--sidebar-top-offset))] ${isSidebarCollapsed ? 'projects-layout-collapsed' : 'projects-layout-expanded'}`} 
          style={{
            top: 'var(--sidebar-top-offset)',
            transition: 'all var(--animation-duration-main) var(--animation-easing)'
          }}
        >
          <div 
            style={{
              transition: 'all var(--animation-duration-main) var(--animation-easing)'
            }} 
            className="w-full h-full p-2 py-0 mx-0 px-[5px]"
          >
            <ProjectsColumn onProjectSelect={handleProjectSelect} />
          </div>
        </div>

        {/* Operations Board with synchronized animation */}
        <div 
          style={{
            transition: 'all var(--animation-duration-main) var(--animation-easing)',
            transform: selectedProject ? 'translateX(-100%)' : 'translateX(0)'
          }} 
          className="mx-0"
        >
          <OperationsBoard isSidebarCollapsed={isSidebarCollapsed} />
        </div>

        {/* Project Board - Only render when selectedProject exists */}
        {selectedProject && (
          <ProjectBoard
            project={selectedProject}
            visible={true}
            onClose={handleCloseBoard}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
