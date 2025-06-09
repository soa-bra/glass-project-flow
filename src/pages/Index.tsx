import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
const Index = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      {/* Header - Fixed and no scroll */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px] overflow-hidden">
        {/* Sidebar - Fixed and no scroll */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar transition-all duration-500 ease-in-out my-[50px] px-0 mx-[8px]">
          <Sidebar onToggle={setIsSidebarCollapsed} />
        </div>

        {/* Main Content Area - Moves with sidebar, content inside can scroll */}
        <div className={`fixed top-[137px] w-[30%] h-[calc(100vh-137px)] transition-all duration-500 ease-in-out px-0 ${isSidebarCollapsed ? 'mr-[105px]' : 'mr-[285px]'}`}>
          <div className="glass rounded-t-3xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] transform w-full h-full flex flex-col px-[7px] mx-[10px]">
            <ScrollArea className="w-full h-full">
              <div className="p-8 text-center py-[35px] px-[5px]">
                <h1 className="text-3xl font-bold text-soabra-text-primary mb-4 animate-fade-in">
                  مرحباً بك في SoaBra
                </h1>
                <p className="text-lg text-soabra-text-secondary animate-fade-in mb-8" style={{
                animationDelay: '0.2s'
              }}>
                  نظام إدارة المشاريع جاهز للاستخدام
                </p>
                
                {/* Additional content to demonstrate scrolling */}
                <div className="space-y-6 mt-12">
                  <div className="p-6 bg-white/20 rounded-2xl">
                    <h3 className="text-xl font-semibold text-soabra-text-primary mb-3">ميزات النظام</h3>
                    <p className="text-soabra-text-secondary">إدارة شاملة للمشاريع والمهام</p>
                  </div>
                  
                  <div className="p-6 bg-white/20 rounded-2xl">
                    <h3 className="text-xl font-semibold text-soabra-text-primary mb-3">التخطيط التشاركي</h3>
                    <p className="text-soabra-text-secondary">تعاون فعال بين أعضاء الفريق</p>
                  </div>
                  
                  <div className="p-6 bg-white/20 rounded-2xl">
                    <h3 className="text-xl font-semibold text-soabra-text-primary mb-3">تتبع الإنجاز</h3>
                    <p className="text-soabra-text-secondary">مراقبة مستمرة لتقدم العمل</p>
                  </div>
                  
                  <div className="p-6 bg-white/20 rounded-2xl">
                    <h3 className="text-xl font-semibold text-soabra-text-primary mb-3">التقارير والإحصائيات</h3>
                    <p className="text-soabra-text-secondary">تحليلات مفصلة للأداء</p>
                  </div>
                  
                  <div className="p-6 bg-white/20 rounded-2xl">
                    <h3 className="text-xl font-semibold text-soabra-text-primary mb-3">إدارة الفرق</h3>
                    <p className="text-soabra-text-secondary">تنظيم وتوزيع المهام بكفاءة</p>
                  </div>
                  
                  <div className="p-6 bg-white/20 rounded-2xl">
                    <h3 className="text-xl font-semibold text-soabra-text-primary mb-3">الأرشيف</h3>
                    <p className="text-soabra-text-secondary">حفظ وتنظيم المشاريع المكتملة</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;