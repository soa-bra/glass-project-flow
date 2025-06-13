
import { useState, useEffect, useCallback } from 'react';
import { ProjectData, ProjectTab } from './types';

export const useProjectPanel = (projectId: string | null, isVisible: boolean) => {
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [activeTab, setActiveTab] = useState<ProjectTab>('tasks');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectData = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // محاكاة جلب البيانات - سيتم ربطها بـ Supabase لاحقاً
      const mockData: ProjectData = {
        id,
        title: 'تطوير الموقع الإلكتروني',
        description: 'تطوير موقع سوبرا الإلكتروني مع تطبيق تقنيات الذكاء الاصطناعي',
        status: 'info',
        budget: {
          total: 15000,
          spent: 8500,
          remaining: 6500
        },
        tasks: [
          {
            id: '1',
            title: 'تصميم الواجهة الرئيسية',
            description: 'تصميم الصفحة الرئيسية للموقع باستخدام Figma وتطبيق مبادئ UX/UI',
            status: 'completed',
            assignee: 'أحمد محمد',
            dueDate: '2025-06-20',
            priority: 'high'
          },
          {
            id: '2',
            title: 'تطوير قاعدة البيانات',
            description: 'إنشاء وتكوين قاعدة البيانات باستخدام PostgreSQL',
            status: 'in_progress',
            assignee: 'سارة أحمد',
            dueDate: '2025-06-25',
            priority: 'medium'
          },
          {
            id: '3',
            title: 'تطوير API الخلفي',
            description: 'بناء API RESTful باستخدام Node.js و Express',
            status: 'pending',
            assignee: 'محمد علي',
            dueDate: '2025-06-30',
            priority: 'high'
          },
          {
            id: '4',
            title: 'تكامل الذكاء الاصطناعي',
            description: 'دمج خدمات الذكاء الاصطناعي في التطبيق',
            status: 'pending',
            assignee: 'فاطمة خالد',
            dueDate: '2025-07-05',
            priority: 'medium'
          },
          {
            id: '5',
            title: 'اختبار الأداء والأمان',
            description: 'إجراء اختبارات شاملة للأداء والأمان',
            status: 'pending',
            assignee: 'عمر حسن',
            dueDate: '2025-07-10',
            priority: 'low'
          }
        ],
        client: {
          name: 'د. محمد العلي',
          company: 'شركة التقنية المتقدمة',
          email: 'mohamed.ali@techadvanced.com',
          phone: '+966501234567',
          satisfaction: 85
        },
        documents: [
          {
            id: '1',
            name: 'عقد المشروع الأساسي',
            type: 'pdf',
            url: '/documents/main-contract.pdf',
            uploadDate: '2025-06-01'
          },
          {
            id: '2',
            name: 'مواصفات المشروع التقنية',
            type: 'pdf',
            url: '/documents/technical-specs.pdf',
            uploadDate: '2025-06-02'
          },
          {
            id: '3',
            name: 'التصميمات الأولية',
            type: 'figma',
            url: '/designs/initial-designs.fig',
            uploadDate: '2025-06-05'
          }
        ],
        timeline: [
          {
            id: '1',
            title: 'بداية المشروع',
            date: '2025-06-01',
            type: 'task'
          },
          {
            id: '2',
            title: 'اجتماع مراجعة التصميم',
            date: '2025-06-15',
            type: 'meeting'
          },
          {
            id: '3',
            title: 'موعد تسليم المرحلة الأولى',
            date: '2025-06-30',
            type: 'deadline'
          }
        ],
        events: [
          {
            id: '1',
            title: 'اجتماع مراجعة التصميم',
            date: '2025-06-15',
            time: '10:00'
          },
          {
            id: '2',
            title: 'تسليم المرحلة الأولى',
            date: '2025-06-30'
          }
        ]
      };

      setTimeout(() => {
        setProjectData(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError('فشل في تحميل بيانات المشروع');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (projectId && isVisible) {
      fetchProjectData(projectId);
    }
  }, [projectId, isVisible, fetchProjectData]);

  return {
    projectData,
    activeTab,
    setActiveTab,
    loading,
    error,
    refetch: () => projectId && fetchProjectData(projectId)
  };
};
