import React from 'react';
import { ZoomIn, ZoomOut, Maximize, Hand, Map as MapIcon, Maximize2, Wifi, WifiOff, Users } from 'lucide-react';
import { useCanvasStore } from '@/stores/canvasStore';
import { useCollaborationStore } from '@/stores/collaborationStore';
import SnapSettingsDropdown from '../widgets/SnapSettingsDropdown';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  
  const { isConnected, participants } = useCollaborationStore();
  
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

  const onlineParticipants = participants.filter(p => p.online);
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {showMinimap && (
        <div
          className="absolute bottom-full right-0 mb-2 w-44 overflow-hidden rounded-[12px] border border-sb-border bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          data-testid="planning-minimap-panel"
          role="status"
          aria-label="الخريطة المصغرة مفعلة"
        >
          <div className="flex items-center justify-between border-b border-sb-border px-3 py-2">
            <span className="text-[11px] font-medium text-sb-ink">الخريطة المصغرة</span>
            <span className="text-[10px] text-muted-foreground">{zoomPercentage}%</span>
          </div>
          <div className="relative h-24 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:16px_16px]">
            <div className="absolute left-4 top-4 h-4 w-10 rounded-[4px] bg-sb-ink/20" />
            <div className="absolute right-5 top-9 h-5 w-12 rounded-[4px] bg-sb-ink/25" />
            <div className="absolute bottom-4 left-12 h-3 w-14 rounded-[4px] bg-sb-ink/15" />
            <div className="absolute inset-x-8 inset-y-5 rounded-[6px] border border-[#3DA8F5] bg-[#3DA8F5]/10" />
          </div>
        </div>
      )}

      <div className="bg-white rounded-[12px] p-2 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_12px_28px_rgba(0,0,0,0.10)] border border-sb-border">
        {/* First Row - Connection Status & Tools */}
        <div className="flex items-center gap-1.5 mb-1.5">
          {/* Connection Status */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-muted/50">
                  {isConnected ? (
                    <Wifi size={12} className="text-accent-green" />
                  ) : (
                    <WifiOff size={12} className="text-accent-red" />
                  )}
                  {onlineParticipants.length > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Users size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{onlineParticipants.length}</span>
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{isConnected ? 'متصل' : 'غير متصل'}</p>
                {onlineParticipants.length > 0 && (
                  <p className="text-xs text-muted-foreground">{onlineParticipants.length} متصل</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Separator */}
          <div className="h-3 w-px bg-border" />

          {/* Fit to Screen */}
          <button
            type="button"
            onClick={zoomToFit}
            className="p-1 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="احتواء الكل (Ctrl + 0)"
          >
            <Maximize size={12} className="text-sb-ink" />
          </button>
          
          {/* Pan Mode */}
          <button
            type="button"
            onClick={togglePanMode}
            aria-pressed={isPanMode}
            className={`p-1 rounded-lg transition-colors ${
              isPanMode 
                ? 'bg-sb-panel-bg text-sb-ink ring-1 ring-sb-border' 
                : 'hover:bg-sb-panel-bg text-sb-ink-40'
            }`}
            title={isPanMode ? 'وضع التنقل مفعل' : 'وضع التنقل (H أو Space)'}
          >
            <Hand size={12} />
          </button>
          
          {/* Snap Settings Dropdown */}
          <SnapSettingsDropdown />
          <button
            type="button"
            onClick={toggleMinimap}
            aria-pressed={showMinimap}
            className={`p-1 rounded-lg transition-colors ${
              showMinimap 
                ? 'bg-sb-panel-bg text-sb-ink ring-1 ring-sb-border' 
                : 'hover:bg-sb-panel-bg text-sb-ink-40'
            }`}
            title={showMinimap ? 'إخفاء الخريطة المصغرة' : 'إظهار الخريطة المصغرة'}
          >
            <MapIcon size={12} />
          </button>
          
          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            className={`p-1 rounded-lg transition-colors ${
              isFullscreen 
                ? 'bg-sb-panel-bg text-sb-ink' 
                : 'hover:bg-sb-panel-bg text-sb-ink-40'
            }`}
            title="ملء الشاشة (F11)"
          >
            <Maximize2 size={12} />
          </button>
        </div>
        
        {/* Second Row */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Out */}
          <button
            type="button"
            onClick={zoomOut}
            className="p-1 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="تصغير (Ctrl + -)"
          >
            <ZoomOut size={12} className="text-sb-ink" />
          </button>
          
          {/* Zoom Slider */}
          <input
            type="range"
            min="10"
            max="500"
            value={zoomPercentage}
            onChange={handleSliderChange}
            className="w-16 h-1 bg-sb-panel-bg rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sb-ink"
            title={`التكبير: ${zoomPercentage}%`}
          />
          
          {/* Zoom In */}
          <button
            type="button"
            onClick={zoomIn}
            className="p-1 hover:bg-sb-panel-bg rounded-lg transition-colors"
            title="تكبير (Ctrl + +)"
          >
            <ZoomIn size={12} className="text-sb-ink" />
          </button>
          
          {/* Zoom Percentage Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsZoomDropdownOpen(!isZoomDropdownOpen)}
              className="px-1.5 py-0.5 hover:bg-sb-panel-bg rounded-lg transition-colors text-[10px] font-medium text-sb-ink min-w-[42px]"
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
                      type="button"
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
                    type="button"
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
      </div>
    </div>
  );
};

export default NavigationBar;
