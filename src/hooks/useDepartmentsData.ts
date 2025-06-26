
import { useState, useEffect } from 'react';

interface Department {
  id: string;
  name: string;
  icon: any;
  color: string;
  hasNotification?: boolean;
  notificationCount?: number;
}

export const useDepartmentsData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // حفظ الإدارة المختارة أخيراً في localStorage
  useEffect(() => {
    const lastSelected = localStorage.getItem('lastSelectedDepartment');
    if (lastSelected) {
      setSelectedDepartmentId(lastSelected);
    }
  }, []);

  useEffect(() => {
    if (selectedDepartmentId) {
      localStorage.setItem('lastSelectedDepartment', selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  const departments: Department[] = [
    { id: 'hr', name: 'الموارد البشرية', icon: 'Users', color: '#4f46e5', hasNotification: true, notificationCount: 3 },
    { id: 'finance', name: 'المالية والمحاسبة', icon: 'Calculator', color: '#059669' },
    { id: 'legal', name: 'الشؤون القانونية', icon: 'FileText', color: '#dc2626', hasNotification: true, notificationCount: 1 },
    { id: 'operations', name: 'العمليات', icon: 'Briefcase', color: '#ea580c' },
    { id: 'it', name: 'تقنية المعلومات', icon: 'Database', color: '#7c3aed', hasNotification: true, notificationCount: 5 },
    { id: 'security', name: 'الأمن والسلامة', icon: 'Shield', color: '#be123c' },
    { id: 'customer', name: 'خدمة العملاء', icon: 'Headphones', color: '#0891b2' },
    { id: 'marketing', name: 'التسويق', icon: 'Globe', color: '#c2410c' },
    { id: 'admin', name: 'الشؤون الإدارية', icon: 'Settings', color: '#6b7280' },
    { id: 'projects', name: 'إدارة المشاريع', icon: 'Building2', color: '#0d9488' }
  ];

  // فلترة الإدارات حسب البحث
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectDepartment = async (departmentId: string) => {
    setIsLoading(true);
    setSelectedDepartmentId(departmentId);
    
    // محاكاة تحميل بيانات الإدارة
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsLoading(false);
  };

  return {
    departments: filteredDepartments,
    searchQuery,
    setSearchQuery,
    selectedDepartmentId,
    selectDepartment,
    isLoading
  };
};
