// Fallback Canvas - Simple canvas renderer
import React from 'react';

interface FallbackCanvasProps {
  enabled: boolean;
}

const FallbackCanvas: React.FC<FallbackCanvasProps> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div className="absolute inset-0 bg-background">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0'
      }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-pulse text-muted-foreground">
            جارٍ تحضير اللوحة...
          </div>
        </div>
      </div>
    </div>
  );
};

export default FallbackCanvas;