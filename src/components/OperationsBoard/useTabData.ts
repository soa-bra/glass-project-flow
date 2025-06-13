
import { useState, useEffect, useCallback } from 'react';
import { TabData } from './types';
import { getMockData } from './mockData';

export const useTabData = (activeTab: string, isVisible: boolean) => {
  const [tabData, setTabData] = useState<TabData>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTabData = useCallback(async (tabName: string) => {
    setLoading(true);
    const mockData = getMockData();
    
    setTimeout(() => {
      setTabData(prevData => ({ 
        ...prevData, 
        [tabName]: mockData[tabName as keyof typeof mockData] 
      }));
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchTabData(activeTab);
    }
  }, [activeTab, isVisible, fetchTabData]);

  return { tabData, loading };
};
