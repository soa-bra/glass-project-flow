
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
        description: 'تطوير موقع سوبرا',
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
            description: 'تصميم الصفحة الرئيسية للموقع',
            status: 'completed',
            assignee: 'أحمد محمد',
            dueDate: '2025-06-20',
            priority: 'high'
          },
          {
            id: '2',
            title: 'تطوير قاعدة البيانات',
            description: 'إنشاء وتكوين قاعدة البيانات',
            status: 'in-progress',
            assignee: 'سارة أحمد',
            dueDate: '2025-06-25',
            priority: 'medium'
          }
        ],
        client: {
          name: 'محمد العلي',
          company: 'شركة التقنية المتقدمة',
          email: 'mohamed@tech.com',
          phone: '+966501234567',
          satisfaction: 85
        },
        documents: [
          {
            id: '1',
            name: 'عقد المشروع',
            type: 'pdf',
            url: '/documents/contract.pdf',
            uploadDate: '2025-06-01'
          }
        ],
        timeline: [
          {
            id: '1',
            title: 'بداية المشروع',
            date: '2025-06-01',
            type: 'task'
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
