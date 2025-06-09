import Sidebar from '@/components/Sidebar';
import HeaderBar from '@/components/HeaderBar';
const Index = () => {
  return <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic py-0 mx-0 px-[240px] my-[90px]">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>

      
    </div>;
};
export default Index;