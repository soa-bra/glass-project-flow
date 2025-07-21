import React from 'react';

interface MiroMinimapProps {
  zoom: number;
  canvasPosition: { x: number; y: number };
  onNavigate: (position: { x: number; y: number }) => void;
}

export const MiroMinimap: React.FC<MiroMinimapProps> = ({
  zoom,
  canvasPosition,
  onNavigate
}) => {
  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate new canvas position based on minimap click
    const scale = 0.1; // Minimap scale factor
    const newX = -(x / scale - window.innerWidth / 2);
    const newY = -(y / scale - window.innerHeight / 2);
    
    onNavigate({ x: newX, y: newY });
  };

  return (
    <div className="fixed bottom-4 right-4 z-30 bg-white rounded-lg shadow-md border border-border p-2">
      <div className="text-xs text-muted-foreground mb-2 text-center" dir="rtl">
        خريطة مصغرة
      </div>
      
      <div
        className="w-32 h-24 bg-gray-100 rounded cursor-pointer relative overflow-hidden"
        onClick={handleMinimapClick}
      >
        {/* Minimap content representation */}
        <div className="absolute inset-0">
          {/* Sample elements in minimap */}
          <div
            className="absolute w-4 h-4 bg-yellow-400 rounded-sm opacity-60"
            style={{
              left: '20%',
              top: '30%'
            }}
          />
          <div
            className="absolute w-4 h-4 bg-blue-400 rounded-sm opacity-60"
            style={{
              left: '50%',
              top: '30%'
            }}
          />
          <div
            className="absolute w-4 h-4 bg-green-400 rounded-sm opacity-60"
            style={{
              left: '35%',
              top: '60%'
            }}
          />
        </div>
        
        {/* Viewport indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10"
          style={{
            left: `${50 + (canvasPosition.x * 0.01)}%`,
            top: `${50 + (canvasPosition.y * 0.01)}%`,
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
            maxWidth: '100%',
            maxHeight: '100%'
          }}
        />
      </div>
    </div>
  );
};