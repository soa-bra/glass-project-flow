
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TabsNavigation } from './TabsNavigation';
import { OperationsTabsContent } from './TabsContent';
import { TabData, fetchTabData } from './TabsData';

interface OperationsBoardProps {
  isVisible: boolean;
  onClose: () => void;
}

export const OperationsBoard = ({
  isVisible,
  onClose
}: OperationsBoardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tabData, setTabData] = useState<TabData>({});
  const [loading, setLoading] = useState<boolean>(false);

  // جلب بيانات التبويب النشط عند تغييره
  useEffect(() => {
    if (isVisible) {
      const loadTabData = async () => {
        setLoading(true);
        try {
          const data = await fetchTabData(activeTab);
          setTabData(prevData => ({
            ...prevData,
            [activeTab]: data
          }));
        } catch (error) {
          console.error('Error loading tab data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadTabData();
    }
  }, [activeTab, isVisible]);

  return (
    <div 
      className={`fixed transition-all duration-500 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-[100%]'}`} 
      style={{
        width: '60vw',
        height: 'calc(100vh - 60px)',
        top: 'var(--sidebar-top-offset)',
        left: '15px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #E8F2FE 0%, #F9DBF8 50%, #DAD4FC 100%)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
        zIndex: 30,
        position: 'relative'
      }}
    >
      {/* طبقة النويز والتأثيرات */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0),
            radial-gradient(circle at 6px 6px, rgba(255,255,255,0.05) 1px, transparent 0),
            linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.02) 75%),
            linear-gradient(-45deg, rgba(0,0,0,0.01) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.01) 75%)
          `,
          backgroundSize: '20px 20px, 40px 40px, 30px 30px, 30px 30px',
          backgroundPosition: '0 0, 10px 10px, 0 0, 15px 15px',
          borderRadius: '20px'
        }}
      />
      
      <div className="w-full h-full rounded-t-[20px] bg-white/40 backdrop-blur-sm flex flex-col mx-0 px-0 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl" className="w-full h-full my-0 mx-0 px-0">
          <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <OperationsTabsContent tabData={tabData} loading={loading} />
        </Tabs>
      </div>
    </div>
  );
};

export default OperationsBoard;
