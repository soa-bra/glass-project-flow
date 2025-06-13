
import { Bell, CircleUser, Search, RefreshCcw, Settings } from 'lucide-react';
import { useState, useCallback } from 'react';

const HEADER_ACTIONS = [
  { icon: Search, label: 'البحث' },
  { icon: RefreshCcw, label: 'تحديث' },
  { icon: Bell, label: 'التنبيهات' },
  { icon: CircleUser, label: 'المستخدم' },
  { icon: Settings, label: 'الإعدادات' },
];

const HeaderBar = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 h-[60px] bg-soabra-sidebar-bg z-header my-0 py-[65px] px-[5px]">
      <div className="flex items-center justify-between h-full px-0">
        <div className="text-right ml-4 mx-[5px] flex items-center">
          {!imageError ? (
            <img 
              src="/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png" 
              alt="SoaBra Logo" 
              className="h-12 w-auto object-contain transition-opacity duration-300" 
              onError={handleImageError} 
              onLoad={handleImageLoad}
              style={{
                opacity: imageLoaded ? 1 : 0.7,
                border: '1px solid rgba(255,255,255,0.2)'
              }} 
            />
          ) : (
            <div>
              <span className="text-soabra-text-primary font-bold text-lg font-arabic">
                SoaBra
              </span>
            </div>
          )}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-0 px-0 mx-0">
          {HEADER_ACTIONS.map(({ icon: Icon, label }) => (
            <button 
              key={label}
              className="p-2 hover:bg-white/20 transition-colors group rounded-full"
              aria-label={label}
            >
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 border-2 border-[#3e494c]/50">
                <Icon className="w-6 h-6 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export { HeaderBar };
export default HeaderBar;
