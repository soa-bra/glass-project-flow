
import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';

const Index = () => {
  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic px-0 mx-[5px]">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      <div className="flex h-screen pt-[60px] px-[240px] mx-0">
        {/* Sidebar */}
        <div className="fixed top-[60px] right-0 h-[calc(100vh-60px)] bg-soabra-solid-bg z-sidebar transition-width duration-300 my-[51px] py-0 px-[6px] w-[80px]">
          <Sidebar />
        </div>

        {/* Main Content Area - Empty and ready for future content */}
        <div className="flex-1 ml-[80px] p-6">
          <div className="glass rounded-3xl p-8 text-center">
            <h1 className="text-3xl font-bold text-soabra-text-primary mb-4">
              مرحباً بك في SoaBra
            </h1>
            <p className="text-lg text-soabra-text-secondary">
              نظام إدارة المشاريع جاهز للاستخدام
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
