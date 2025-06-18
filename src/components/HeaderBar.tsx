
import { Bell, CircleUser, Search, RefreshCcw, Settings } from 'lucide-react';
import { useState } from 'react';

const HeaderBar = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <header 
      className="fixed top-0 right-0 left-0 h-[60px] z-header my-0 py-[65px] px-[5px]"
      style={{ background: '#dfecf2' }}
    >
      <div className="flex items-center justify-between h-full px-0">
        {/* Logo/Brand - Left Side aligned with sidebar menu */}
        <div className="text-right ml-4 mx-[5px] flex items-center">
          {!imageError ? <img src="/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png" alt="SoaBra Logo" className="h-12 w-auto object-contain transition-opacity duration-300" onError={handleImageError} onLoad={handleImageLoad} style={{
          opacity: imageLoaded ? 1 : 0.7,
          border: '1px solid rgba(255,255,255,0.2)'
        }} /> : <div className="">
              <span className="text-soabra-text-primary font-bold text-lg font-arabic">
                SoaBra
              </span>
            </div>}
        </div>

        {/* Center - Empty for balance */}
        <div className="flex-1" />

        {/* Action Icons - Right Side: بحث ← تحديث ← تنبيهات ← مستخدم ← إعدادات */}
        <div className="flex items-center gap-0 px-0 mx-0">
          <button className="p-2 hover:bg-white/20 transition-colors group rounded-full">
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <Search className="w-[19px] h-[19px] text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 transition-colors group rounded-full">
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <RefreshCcw className="w-[19px] h-[19px] text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 transition-colors group rounded-full">
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <Bell className="w-[19px] h-[19px] text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 transition-colors group rounded-full">
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <CircleUser className="w-[19px] h-[19px] text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors group">
            <div className="w-[50px] h-[50px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
              <Settings className="w-[19px] h-[19px] text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
