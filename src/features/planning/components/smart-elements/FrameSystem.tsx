import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Frame, Move, Lock, Unlock, Eye, EyeOff } from 'lucide-react';

interface CanvasFrame {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  isLocked: boolean;
  isVisible: boolean;
  children: string[]; // element IDs
}

interface FrameSystemProps {
  frames: CanvasFrame[];
  onFrameUpdate?: (frameId: string, updates: Partial<CanvasFrame>) => void;
  onFrameCreate?: (frame: Omit<CanvasFrame, 'id'>) => void;
  onFrameDelete?: (frameId: string) => void;
}

export const FrameSystem: React.FC<FrameSystemProps> = ({
  frames,
  onFrameUpdate,
  onFrameCreate,
  onFrameDelete
}) => {
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dragState, setDragState] = useState<{
    frameId: string;
    startX: number;
    startY: number;
    mode: 'move' | 'resize';
  } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const createFrame = (x: number, y: number) => {
    const newFrame: Omit<CanvasFrame, 'id'> = {
      name: `إطار ${frames.length + 1}`,
      x,
      y,
      width: 300,
      height: 200,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      isLocked: false,
      isVisible: true,
      children: []
    };
    
    onFrameCreate?.(newFrame);
    setIsCreating(false);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!isCreating) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    createFrame(x, y);
  };

  const handleFrameMouseDown = (e: React.MouseEvent, frameId: string, mode: 'move' | 'resize') => {
    e.stopPropagation();
    
    const frame = frames.find(f => f.id === frameId);
    if (!frame || frame.isLocked) return;
    
    setSelectedFrameId(frameId);
    setDragState({
      frameId,
      startX: e.clientX,
      startY: e.clientY,
      mode
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    
    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;
    
    const frame = frames.find(f => f.id === dragState.frameId);
    if (!frame) return;
    
    if (dragState.mode === 'move') {
      onFrameUpdate?.(dragState.frameId, {
        x: frame.x + deltaX,
        y: frame.y + deltaY
      });
    } else if (dragState.mode === 'resize') {
      onFrameUpdate?.(dragState.frameId, {
        width: Math.max(100, frame.width + deltaX),
        height: Math.max(80, frame.height + deltaY)
      });
    }
    
    setDragState({
      ...dragState,
      startX: e.clientX,
      startY: e.clientY
    });
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  const toggleFrameLock = (frameId: string) => {
    const frame = frames.find(f => f.id === frameId);
    if (!frame) return;
    
    onFrameUpdate?.(frameId, { isLocked: !frame.isLocked });
  };

  const toggleFrameVisibility = (frameId: string) => {
    const frame = frames.find(f => f.id === frameId);
    if (!frame) return;
    
    onFrameUpdate?.(frameId, { isVisible: !frame.isVisible });
  };

  const updateFrameName = (frameId: string, name: string) => {
    onFrameUpdate?.(frameId, { name });
  };

  const deleteFrame = (frameId: string) => {
    if (confirm('هل تريد حذف هذا الإطار؟')) {
      onFrameDelete?.(frameId);
      if (selectedFrameId === frameId) {
        setSelectedFrameId(null);
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Frame Creation Controls */}
      <div className="absolute top-4 left-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 border border-sb-border">
        <button
          onClick={() => setIsCreating(!isCreating)}
          className={cn(
            "p-2 rounded-lg flex items-center gap-2 text-sm",
            isCreating 
              ? "bg-primary text-primary-foreground" 
              : "bg-white hover:bg-sb-panel-bg/50"
          )}
          title="إنشاء إطار جديد"
        >
          <Frame size={16} />
          {isCreating ? "انقر لإنشاء إطار" : "إضافة إطار"}
        </button>
      </div>

      {/* Frames Layer */}
      <div 
        ref={containerRef}
        className="absolute inset-0"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {frames.map((frame) => {
          if (!frame.isVisible) return null;
          
          const isSelected = selectedFrameId === frame.id;
          
          return (
            <div
              key={frame.id}
              className={cn(
                "absolute border-2 border-dashed rounded-lg",
                isSelected ? "border-primary" : "border-gray-400",
                frame.isLocked && "border-red-400"
              )}
              style={{
                left: frame.x,
                top: frame.y,
                width: frame.width,
                height: frame.height,
                backgroundColor: frame.backgroundColor,
                zIndex: isSelected ? 20 : 10
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFrameId(frame.id);
              }}
            >
              {/* Frame Header */}
              <div 
                className={cn(
                  "absolute -top-8 left-0 bg-white border border-sb-border rounded-t-lg px-2 py-1 flex items-center gap-2 text-xs",
                  !frame.isLocked && "cursor-move"
                )}
                onMouseDown={(e) => handleFrameMouseDown(e, frame.id, 'move')}
              >
                <input
                  type="text"
                  value={frame.name}
                  onChange={(e) => updateFrameName(frame.id, e.target.value)}
                  className="bg-transparent border-none outline-none font-medium min-w-16"
                  disabled={frame.isLocked}
                />
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFrameLock(frame.id);
                    }}
                    className="p-1 hover:bg-sb-panel-bg/50 rounded"
                    title={frame.isLocked ? "إلغاء القفل" : "قفل الإطار"}
                  >
                    {frame.isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFrameVisibility(frame.id);
                    }}
                    className="p-1 hover:bg-sb-panel-bg/50 rounded"
                    title="إخفاء الإطار"
                  >
                    <EyeOff size={12} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFrame(frame.id);
                    }}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                    title="حذف الإطار"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Children Count */}
              {frame.children.length > 0 && (
                <div className="absolute bottom-2 right-2 bg-white/80 text-xs px-2 py-1 rounded">
                  {frame.children.length} عنصر
                </div>
              )}

              {/* Resize Handle */}
              {isSelected && !frame.isLocked && (
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
                  onMouseDown={(e) => handleFrameMouseDown(e, frame.id, 'resize')}
                  style={{
                    clipPath: 'polygon(100% 0%, 100% 100%, 0% 100%)'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Frames List Panel (when frames exist) */}
      {frames.length > 0 && (
        <div className="absolute top-4 right-4 z-50 bg-white/90 backdrop-blur-sm rounded-lg border border-sb-border p-3 max-w-48">
          <h4 className="font-medium text-sm mb-2">الإطارات ({frames.length})</h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {frames.map((frame) => (
              <div
                key={frame.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded text-xs cursor-pointer",
                  selectedFrameId === frame.id ? "bg-primary/10" : "hover:bg-sb-panel-bg/50",
                  !frame.isVisible && "opacity-50"
                )}
                onClick={() => setSelectedFrameId(frame.id)}
              >
                <span className="truncate">{frame.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFrameVisibility(frame.id);
                    }}
                    className="p-1 hover:bg-white/50 rounded"
                  >
                    {frame.isVisible ? <Eye size={10} /> : <EyeOff size={10} />}
                  </button>
                  {frame.isLocked && <Lock size={10} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {isCreating && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-4 rounded-lg border border-sb-border text-center">
            <p className="text-sm mb-2">انقر في أي مكان لإنشاء إطار جديد</p>
            <p className="text-xs text-sb-color-text-light">اضغط ESC للإلغاء</p>
          </div>
        </div>
      )}
    </div>
  );
};