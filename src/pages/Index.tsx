import HeaderBar from '@/components/HeaderBar';
import MainContent from '@/components/MainContent';
const Index = () => {
  return <div dir="rtl" className="relative min-h-screen w-full  font-arabic overflow-hidden bg-[dfecf2]">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header bg-[dfecf2]">
        <HeaderBar />
      </div>
      <MainContent />
    </div>;
};
export default Index;