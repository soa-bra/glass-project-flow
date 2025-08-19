import React from 'react';

interface EnhancedSelectionBoxProps {
  isSelecting: boolean;
  selectionBox: { 
    start: { x: number; y: number }; 
    end: { x: number; y: number } 
  } | null;
  zoom: number;
  theme?: 'default' | 'accent' | 'success';
}

export const EnhancedSelectionBox: React.FC<EnhancedSelectionBoxProps> = ({
  isSelecting,
  selectionBox,
  zoom,
  theme = 'default'
}) => {
  if (!isSelecting || !selectionBox) return null;

  const { start, end } = selectionBox;
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  // Only show selection box if it's large enough
  if (width < 5 || height < 5) return null;

  const getThemeClasses = () => {
    switch (theme) {
      case 'accent':
        return 'border-accent bg-accent/10';
      case 'success':
        return 'border-emerald-500 bg-emerald-500/10';
      default:
        return 'border-primary bg-primary/10';
    }
  };

  const borderWidth = Math.max(1, 2 / zoom);

  return (
    <div
      className={`absolute pointer-events-none border-dashed ${getThemeClasses()} w-[${width}px] h-[${height}px] border-[${borderWidth}px] animate-pulse`}
      style={{
        transform: `translate(${left}px, ${top}px)`
      }}
    >
      {/* Corner indicators */}
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary border border-background rounded-sm" />
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary border border-background rounded-sm" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary border border-background rounded-sm" />
      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary border border-background rounded-sm" />
      
      {/* Selection info */}
      {width > 80 && height > 40 && (
        <div className="absolute top-1 left-1 bg-background/80 text-foreground text-xs px-1 py-0.5 rounded">
          {Math.round(width)} × {Math.round(height)}
        </div>
      )}
    </div>
  );
};