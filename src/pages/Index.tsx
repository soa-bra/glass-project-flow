
import HeaderBar from '@/components/HeaderBar';
import MainContent from '@/components/MainContent';

const Index = () => {
  return (
    <div dir="rtl" className="relative min-h-screen w-full bg-soabra-solid-bg font-arabic overflow-hidden">
      <div className="fixed top-0 inset-x-0 bg-soabra-solid-bg z-header">
        <HeaderBar />
      </div>
      <MainContent />
    </div>
  );
};
export default Index;
