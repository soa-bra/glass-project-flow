import React from 'react';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';

interface LiveCursorsProps {
  projectId: string;
  currentUserId: string;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  canvasPosition: { x: number; y: number };
}

export const LiveCursors: React.FC<LiveCursorsProps> = ({
  projectId,
  currentUserId,
  canvasRef,
  zoom,
  canvasPosition
}) => {
  const { collaborators, broadcastCursor } = useCanvasCollaboration({
    projectId,
    userId: currentUserId,
    enable: true
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
    const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
    
    broadcastCursor(x, y);
  };

  React.useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (zoom / 100) - canvasPosition.x;
      const y = (e.clientY - rect.top) / (zoom / 100) - canvasPosition.y;
      
      broadcastCursor(x, y);
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    return () => document.removeEventListener('mousemove', handleDocumentMouseMove);
  }, [broadcastCursor, zoom, canvasPosition, canvasRef]);

  return (
    <>
      {/* Other users' cursors */}
      {collaborators
        .filter(collab => collab.isOnline && collab.cursor)
        .map((collab) => (
          <div
            key={collab.id}
            className="absolute z-50 pointer-events-none transform transition-all duration-75"
            style={{
              left: `${(collab.cursor!.x + canvasPosition.x) * (zoom / 100)}px`,
              top: `${(collab.cursor!.y + canvasPosition.y) * (zoom / 100)}px`,
              transform: `scale(${zoom / 100})`
            }}
          >
            {/* Cursor arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M4 4L16 10L10 12L8 16L4 4Z"
                fill={collab.color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            
            {/* User name label */}
            <div
              className="absolute top-5 left-3 px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg whitespace-nowrap"
              style={{ backgroundColor: collab.color }}
            >
              {collab.name}
            </div>
          </div>
        ))}
    </>
  );
};
