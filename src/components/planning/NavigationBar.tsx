import React, { useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Hand, Map, ChevronDown } from "lucide-react";

interface NavigationBarProps {
  canvasRef: React.RefObject<HTMLDivElement>;
}

export default function NavigationBar({ canvasRef }: NavigationBarProps) {
  const [zoom, setZoom] = useState(100);
  const [showMinimap, setShowMinimap] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(500, prev + 10));
  const handleZoomOut = () => setZoom(prev => Math.max(10, prev - 10));
  const handleFitToScreen = () => setZoom(100);

  return (
    <div className="absolute bottom-4 left-4 z-20">
      <div className="bg-white/90 backdrop-blur-md border border-[hsl(var(--border))] rounded-2xl p-2 shadow-lg flex items-center gap-2">
        {/* Zoom Out */}
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="تصغير"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        {/* Zoom Slider */}
        <input
          type="range"
          min="10"
          max="500"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-24 h-1 bg-[hsl(var(--panel))] rounded-lg appearance-none cursor-pointer"
        />

        {/* Zoom In */}
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="تكبير"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* Zoom Percentage */}
        <button className="px-2 py-1 text-sm font-medium hover:bg-[hsl(var(--panel))] rounded flex items-center gap-1">
          {zoom}%
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[hsl(var(--border))]" />

        {/* Fit to Screen */}
        <button
          onClick={handleFitToScreen}
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="ملاءمة الشاشة"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Pan Tool */}
        <button
          className="p-2 hover:bg-[hsl(var(--panel))] rounded-lg transition-colors"
          title="أداة الكف"
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Minimap */}
        <button
          onClick={() => setShowMinimap(!showMinimap)}
          className={`p-2 rounded-lg transition-colors ${
            showMinimap ? 'bg-[hsl(var(--accent-green))] text-white' : 'hover:bg-[hsl(var(--panel))]'
          }`}
          title="الخريطة المصغرة"
        >
          <Map className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
