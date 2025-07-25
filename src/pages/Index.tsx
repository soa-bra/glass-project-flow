
import HeaderBar from '@/components/HeaderBar';
import MainContent from '@/components/MainContent';
import NavigationMenu from '@/components/Navigation/NavigationMenu';

const Index = () => {
  return (
    <div 
      dir="rtl" 
      className="relative min-h-screen w-full font-arabic overflow-hidden"
      style={{ background: '#dfecf2' }}
    >
      <div 
        className="fixed top-0 inset-x-0 z-header"
        style={{ background: '#dfecf2' }}
      >
        <HeaderBar />
      </div>
      
      {/* Navigation Menu Section */}
      <div className="pt-[120px] px-6">
        <NavigationMenu />
      </div>
      
      {/* Original Main Content */}
      <MainContent />
    </div>
  );
};

export default Index;
