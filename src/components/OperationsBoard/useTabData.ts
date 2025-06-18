
import { useState, useEffect } from 'react';
import { TabData } from './types';
import { getMockData } from './mockData';

/**
 * خطاف مخصص لجلب بيانات التبويبات
 */
export const useTabData = (activeTab: string, isVisible: boolean) => {
  const [tabData, setTabData] = useState<TabData>({});
  const [loading, setLoading] = useState<boolean>(false);

  // محاكاة جلب البيانات من الـ API
  const fetchTabData = async (tabName: string) => {
    setLoading(true);
    
    // هنا سيتم استبدال هذا بطلب API حقيقي
    // const response = await fetch(`/api/overview?dept=${tabName}`);
    // const data = await response.json();
    
    const mockData = getMockData();
    
    setTimeout(() => {
      setTabData(prevData => ({ 
        ...prevData, 
        [tabName]: mockData[tabName as keyof typeof mockData] 
      }));
      setLoading(false);
    }, 300); // محاكاة وقت التحميل
  };

  // جلب بيانات التبويب النشط عند تغييره
  useEffect(() => {
    if (isVisible) {
      fetchTabData(activeTab);
    }
  }, [activeTab, isVisible]);

  return { tabData, loading };
};
