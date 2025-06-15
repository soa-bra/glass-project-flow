
import { Bell, CircleUser, Search, RefreshCcw, Settings } from 'lucide-react';
import { useState } from 'react';

const HeaderBar = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => setImageError(true);
  const handleImageLoad = () => setImageLoaded(true);

  return (
    <header
      className="fixed top-0 right-0 left-0 h-[60px] z-header"
      style={{
        background: 'rgba(255,255,255,0.40)',
        backdropFilter: 'blur(20px) saturate(135%)',
        WebkitBackdropFilter: 'blur(20px) saturate(135%)',
        borderBottom: '1.8px solid rgba(255,255,255,0.18)',
        fontFamily: '"IBM Plex Sans Arabic", Arial, Tahoma, sans-serif',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.10)',
      }}
      dir="rtl"
    >
      <div className="flex items-center justify-between h-full px-2">
        {/* Logo/Brand */}
        <div className="text-right ml-2 flex items-center">
          {!imageError ? (
            <img
              src="/lovable-uploads/9a8b8ed4-b3d6-4ecf-b62c-e6c1eba8c3d4.png"
              alt="SoaBra Logo"
              className="h-11 w-auto object-contain transition-opacity duration-300 rounded-xl shadow"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                opacity: imageLoaded ? 1 : 0.7,
                border: '1.5px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.37)',
                backdropFilter: 'blur(20px)',
                marginLeft: '10px'
              }}
            />
          ) : (
            <span className="text-soabra-text-primary font-bold text-lg font-arabic">
              SoaBra
            </span>
          )}
        </div>

        {/* Center - بدون أي محتوى للاتزان */}
        <div className="flex-1" />

        {/* Action Icons */}
        <div className="flex items-center gap-1 pr-2">
          {[Search, RefreshCcw, Bell, CircleUser, Settings].map((Icon, i) => (
            <button key={i}
              className="hover:bg-white/25 transition group rounded-full mx-0"
              style={{
                width: 46,
                height: 46,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                border: '2px solid #b7bec6',
                marginLeft: i === 0 ? 0 : 4,
                background: 'rgba(255,255,255,0.11)',
                boxShadow: '0 2px 14px rgba(111,111,155,0.07)'
              }}
              tabIndex={0}
              aria-label="icon-btn"
            >
              <Icon className="w-6 h-6 text-soabra-text-primary group-hover:scale-110 transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
export default HeaderBar;
