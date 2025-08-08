
import HeaderBar from '@/components/HeaderBar';
import Whiteboard from '../../glass-project-flow-main-5/src/components/Whiteboard';

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
      <Whiteboard />
    </div>
  );
};

export default Index;
