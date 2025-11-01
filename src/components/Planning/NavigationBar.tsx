import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Hand, Map as MapIcon, Maximize2 } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';

const NavigationBar: React.FC = () => {
  const { 
    viewport, 
    zoomIn, 
    zoomOut, 
    zoomToFit,
    setZoomPercentage,
    isPanMode,
    togglePanMode,
    toggleMinimap,
    showMinimap,
    toggleFullscreen,
    isFullscreen
  } = useCanvasStore();
  
  const zoomPercentage = Math.round(viewport.zoom * 100);
  const [isZoomDropdownOpen, setIsZoomDropdownOpen] = React.useState(false);
  
  const zoomOptions = [10, 25, 50, 75, 100, 125, 150, 200, 300, 500];
  
  const handleZoomSelect = (percentage: number) => {
    setZoomPercentage(percentage);
    setIsZoomDropdownOpen(false);
  };
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZoomPercentage(parseInt(e.target.value));
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40 bg-white rounded-[18px] p-3 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] border border-sb-border">
      {/* First Row */}
      <div className="flex items-center gap-2 mb-2">
        {/* Zoom Out */}
        <button
          onClick={zoomOut}
          className="p-1.5 hover:bg-sb-panel-bg rounded-lg transition-colors"
          title="تصغير (Ctrl + -)"
        >
          <ZoomOut size={14} className="text-sb-ink" />
        </button>
        
        {/* Zoom Slider */}
        <input
          type="range"
          min="10"
          max="500"
          value={zoomPercentage}
          onChange={handleSliderChange}
          className="w-20 h-1.5 bg-sb-panel-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sb-ink"
          title={`التكبير: ${zoomPercentage}%`}
        />
        
        {/* Zoom In */}
        <button
          onClick={zoomIn}
          className="p-1.5 hover:bg-sb-panel-bg rounded-lg transition-colors"
          title="تكبير (Ctrl + +)"
        >
          <ZoomIn size={14} className="text-sb-ink" />
        </button>
        
        {/* Zoom Percentage Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsZoomDropdownOpen(!isZoomDropdownOpen)}
            className="px-2 py-1 hover:bg-sb-panel-bg rounded-lg transition-colors text-[11px] font-medium text-sb-ink min-w-[50px]"
          >
            {zoomPercentage}%
          </button>
          
          {isZoomDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsZoomDropdownOpen(false)}
              />
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-[12px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border py-2 z-20 min-w-[100px]">
                {zoomOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleZoomSelect(option)}
                    className={`w-full px-4 py-2 text-right hover:bg-sb-panel-bg transition-colors text-[13px] ${
                      option === zoomPercentage ? 'bg-sb-panel-bg font-medium' : ''
                    }`}
                  >
                    {option}%
                  </button>
                ))}
                <div className="h-px bg-sb-border my-1" />
                <button
                  onClick={() => {
                    zoomToFit();
                    setIsZoomDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-right hover:bg-sb-panel-bg transition-colors text-[13px]"
                >
                  احتواء الكل
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Second Row */}
      <div className="flex items-center gap-2">
        {/* Fit to Screen */}
        <button
          onClick={zoomToFit}
          className="p-1.5 hover:bg-sb-panel-bg rounded-lg transition-colors"
          title="احتواء الكل (Ctrl + 0)"
        >
          <Maximize size={14} className="text-sb-ink" />
        </button>
        
        {/* Pan Mode */}
        <button
          onClick={togglePanMode}
          className={`p-1.5 rounded-lg transition-colors ${
            isPanMode 
              ? 'bg-sb-panel-bg text-sb-ink' 
              : 'hover:bg-sb-panel-bg text-sb-ink-40'
          }`}
          title="وضع التنقل (H أو Space)"
        >
          <Hand size={14} />
        </button>
        
        {/* Minimap */}
        <button
          onClick={toggleMinimap}
          className={`p-1.5 rounded-lg transition-colors ${
            showMinimap 
              ? 'bg-sb-panel-bg text-sb-ink' 
              : 'hover:bg-sb-panel-bg text-sb-ink-40'
          }`}
          title="الخريطة المصغرة"
        >
          <MapIcon size={14} />
        </button>
        
        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className={`p-1.5 rounded-lg transition-colors ${
            isFullscreen 
              ? 'bg-sb-panel-bg text-sb-ink' 
              : 'hover:bg-sb-panel-bg text-sb-ink-40'
          }`}
          title="ملء الشاشة (F11)"
        >
          <Maximize2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;
