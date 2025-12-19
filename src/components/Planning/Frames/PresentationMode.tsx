/**
 * PresentationMode - وضع العرض التقديمي للإطارات
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  Maximize2,
  Minimize2,
  Grid3X3,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCanvasStore } from '@/stores/canvasStore';
import type { CanvasElementType } from '@/types/canvas-elements';

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
  startFrameId?: string;
}

export function PresentationMode({ 
  isOpen, 
  onClose, 
  startFrameId 
}: PresentationModeProps) {
  const { elements } = useCanvasStore();
  
  // استخراج الإطارات مرتبة
  const frames = elements
    .filter(el => el.type === 'frame' && (el as any).visible !== false)
    .sort((a, b) => {
      const orderA = (a as any).presentationOrder ?? 999;
      const orderB = (b as any).presentationOrder ?? 999;
      return orderA - orderB;
    });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  // تعيين الإطار الابتدائي
  useEffect(() => {
    if (startFrameId && frames.length > 0) {
      const index = frames.findIndex(f => f.id === startFrameId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [startFrameId, frames]);

  // التشغيل التلقائي
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 5000); // 5 ثوان لكل شريحة
    
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  // التنقل بالكيبورد
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goPrev();
          break;
        case 'Escape':
          onClose();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'g':
        case 'G':
          setShowOverview(prev => !prev);
          break;
        case 'Home':
          setCurrentIndex(0);
          break;
        case 'End':
          setCurrentIndex(frames.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, frames.length]);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, frames.length - 1));
  }, [frames.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentFrame = frames[currentIndex];

  if (!isOpen || frames.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
      >
        {/* عرض النظرة العامة */}
        {showOverview ? (
          <OverviewGrid
            frames={frames}
            currentIndex={currentIndex}
            onSelect={(index) => {
              setCurrentIndex(index);
              setShowOverview(false);
            }}
            onClose={() => setShowOverview(false)}
          />
        ) : (
          <>
            {/* محتوى الشريحة */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFrame?.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-white rounded-xl shadow-2xl overflow-hidden"
                  style={{
                    width: Math.min(currentFrame?.size.width || 1280, window.innerWidth - 100),
                    height: Math.min(currentFrame?.size.height || 720, window.innerHeight - 150),
                    aspectRatio: `${currentFrame?.size.width || 16} / ${currentFrame?.size.height || 9}`
                  }}
                >
                  {/* هنا يمكن عرض محتويات الإطار */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-2">
                        {(currentFrame as any)?.name || `شريحة ${currentIndex + 1}`}
                      </h2>
                      <p className="text-muted-foreground">
                        {currentFrame?.size.width} × {currentFrame?.size.height}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* شريط التحكم */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center justify-center gap-4">
                {/* شريط التقدم */}
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>

                  <div className="flex items-center gap-1 px-2">
                    {frames.map((_, i) => (
                      <button
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentIndex 
                            ? 'bg-white w-4' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        onClick={() => setCurrentIndex(i)}
                      />
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={goNext}
                    disabled={currentIndex === frames.length - 1}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>

                  <div className="w-px h-4 bg-white/30 mx-2" />

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={() => setShowOverview(true)}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    onClick={toggleFullscreen}
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* رقم الشريحة */}
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm">
                  {currentIndex + 1} / {frames.length}
                </div>
              </div>
            </div>

            {/* زر الإغلاق */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 left-4 h-10 w-10 p-0 text-white hover:bg-white/20 rounded-full"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>

            {/* مناطق التنقل بالنقر */}
            <div 
              className="absolute top-0 right-0 w-1/3 h-full cursor-pointer"
              onClick={goPrev}
            />
            <div 
              className="absolute top-0 left-0 w-1/3 h-full cursor-pointer"
              onClick={goNext}
            />
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

// مكون النظرة العامة
interface OverviewGridProps {
  frames: CanvasElementType[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

function OverviewGrid({ frames, currentIndex, onSelect, onClose }: OverviewGridProps) {
  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm p-8 overflow-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">نظرة عامة على العرض</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {frames.map((frame, index) => (
            <motion.button
              key={frame.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                relative aspect-video rounded-lg overflow-hidden border-2 transition-all
                ${index === currentIndex 
                  ? 'border-primary ring-2 ring-primary/50' 
                  : 'border-white/20 hover:border-white/50'
                }
              `}
              onClick={() => onSelect(index)}
            >
              <div className="absolute inset-0 bg-white flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">
                  {index + 1}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                <p className="text-white text-xs truncate">
                  {(frame as any).name || `شريحة ${index + 1}`}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
