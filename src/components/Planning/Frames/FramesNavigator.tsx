/**
 * FramesNavigator - قائمة الإطارات مع التنقل السريع
 */

import React, { useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Frame, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Play,
  MoreHorizontal,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElementType } from '@/types/canvas-elements';

interface FramesNavigatorProps {
  onFrameSelect?: (frameId: string) => void;
  onStartPresentation?: (frameId: string) => void;
  className?: string;
}

export function FramesNavigator({ 
  onFrameSelect, 
  onStartPresentation,
  className = '' 
}: FramesNavigatorProps) {
  const { elements, updateElement, deleteElement, duplicateElement, selectElements } = useCanvasStore();
  
  // استخراج الإطارات فقط
  const frames = useMemo(() => {
    return elements
      .filter(el => el.type === 'frame')
      .sort((a, b) => {
        const orderA = (a as any).presentationOrder ?? 999;
        const orderB = (b as any).presentationOrder ?? 999;
        return orderA - orderB;
      });
  }, [elements]);

  // التنقل لإطار
  const handleJumpToFrame = (frameId: string) => {
    selectElements([frameId]);
    onFrameSelect?.(frameId);
  };

  // تبديل الرؤية
  const toggleVisibility = (frameId: string, currentVisible: boolean) => {
    updateElement(frameId, { visible: !currentVisible } as any);
  };

  // تبديل القفل
  const toggleLock = (frameId: string, currentLocked: boolean) => {
    updateElement(frameId, { locked: !currentLocked } as any);
  };

  // إعادة ترتيب
  const handleReorder = (reorderedFrames: CanvasElementType[]) => {
    reorderedFrames.forEach((frame, index) => {
      updateElement(frame.id, { presentationOrder: index } as any);
    });
  };

  // حذف إطار
  const handleDelete = (frameId: string) => {
    deleteElement(frameId);
  };

  // نسخ إطار
  const handleDuplicate = (frameId: string) => {
    duplicateElement(frameId);
  };

  if (frames.length === 0) {
    return (
      <div className={`p-4 text-center ${className}`}>
        <Frame className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground mb-3">
          لا توجد إطارات بعد
        </p>
        <p className="text-xs text-muted-foreground">
          استخدم أداة الإطار لإنشاء مشاهد للعرض التقديمي
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      {/* الرأس */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <Frame className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">الإطارات</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {frames.length}
          </span>
        </div>
        
        {frames.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1"
            onClick={() => onStartPresentation?.(frames[0].id)}
          >
            <Play className="w-3.5 h-3.5" />
            <span className="text-xs">عرض</span>
          </Button>
        )}
      </div>

      {/* قائمة الإطارات */}
      <ScrollArea className="flex-1">
        <Reorder.Group
          axis="y"
          values={frames}
          onReorder={handleReorder}
          className="p-2 space-y-1"
        >
          <AnimatePresence>
            {frames.map((frame, index) => (
              <FrameItem
                key={frame.id}
                frame={frame}
                index={index}
                onJump={() => handleJumpToFrame(frame.id)}
                onToggleVisibility={() => toggleVisibility(frame.id, (frame as any).visible !== false)}
                onToggleLock={() => toggleLock(frame.id, (frame as any).locked === true)}
                onDelete={() => handleDelete(frame.id)}
                onDuplicate={() => handleDuplicate(frame.id)}
                onPresent={() => onStartPresentation?.(frame.id)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </ScrollArea>
    </div>
  );
}

// مكون عنصر الإطار
interface FrameItemProps {
  frame: CanvasElementType;
  index: number;
  onJump: () => void;
  onToggleVisibility: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onPresent: () => void;
}

function FrameItem({ 
  frame, 
  index, 
  onJump, 
  onToggleVisibility, 
  onToggleLock,
  onDelete,
  onDuplicate,
  onPresent
}: FrameItemProps) {
  const isVisible = (frame as any).visible !== false;
  const isLocked = (frame as any).locked === true;
  const frameName = (frame as any).name || `إطار ${index + 1}`;
  const frameColor = (frame as any).style?.borderColor || '#3B82F6';

  return (
    <Reorder.Item
      value={frame}
      id={frame.id}
      className="group"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`
          flex items-center gap-2 p-2 rounded-lg border cursor-pointer
          transition-colors hover:bg-muted/50
          ${!isVisible ? 'opacity-50' : ''}
        `}
        onClick={onJump}
      >
        {/* مقبض السحب */}
        <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* معاينة الإطار */}
        <div 
          className="w-12 h-8 rounded border-2 bg-muted/30 flex items-center justify-center text-xs font-bold"
          style={{ borderColor: frameColor }}
        >
          {index + 1}
        </div>

        {/* اسم الإطار */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{frameName}</p>
          <p className="text-xs text-muted-foreground">
            {Math.round(frame.size.width)} × {Math.round(frame.size.height)}
          </p>
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
          >
            {isVisible ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock();
            }}
          >
            {isLocked ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Unlock className="w-3.5 h-3.5" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onPresent}>
                <Play className="w-4 h-4 ml-2" />
                بدء العرض من هنا
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDuplicate}>
                <Copy className="w-4 h-4 ml-2" />
                نسخ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </Reorder.Item>
  );
}
