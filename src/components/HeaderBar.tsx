
import React from 'react';
import { HEADER_ACTIONS, LOGO_PATH, APP_NAME } from '@/constants';
import { useImageState } from '@/hooks/useImageState';

const HeaderBar = React.memo(() => {
  const { imageState, handleImageError, handleImageLoad, imageStyle } = useImageState();

  return (
    <header className="fixed top-0 right-0 left-0 h-[60px] bg-soabra-sidebar-bg z-header my-0 py-[65px] px-[5px]">
      <div className="flex items-center justify-between h-full px-0">
        <div className="text-right ml-4 mx-[5px] flex items-center">
          {!imageState.error ? (
            <img 
              src={LOGO_PATH}
              alt={`${APP_NAME} Logo`}
              className="h-12 w-auto object-contain transition-opacity duration-300" 
              onError={handleImageError} 
              onLoad={handleImageLoad}
              style={imageStyle} 
            />
          ) : (
            <div>
              <span className="text-soabra-text-primary font-bold text-lg font-arabic">
                {APP_NAME}
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
});

HeaderBar.displayName = 'HeaderBar';

export { HeaderBar };
export default HeaderBar;
