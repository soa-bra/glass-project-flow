
import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface EnhancedKeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onToolSelect: (tool: string) => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}

export const EnhancedKeyboardShortcuts: React.FC<EnhancedKeyboardShortcutsProps> = ({
  onUndo,
  onRedo,
  onSave,
  onCopy,
  onPaste,
  onDelete,
  onSelectAll,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onToolSelect,
  onToggleGrid,
  onToggleSnap
}) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { ctrlKey, metaKey, key, shiftKey, altKey } = event;
    const isCtrlOrCmd = ctrlKey || metaKey;

    // Prevent default for our shortcuts
    if (isCtrlOrCmd) {
      switch (key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (shiftKey) {
            onRedo();
            toast.success('تم الإعادة', {
              icon: '↩️',
              duration: 1000,
              className: 'animate-fade-in'
            });
          } else {
            onUndo();
            toast.success('تم التراجع', {
              icon: '↪️',
              duration: 1000,
              className: 'animate-fade-in'
            });
          }
          break;
        
        case 'y':
          event.preventDefault();
          onRedo();
          toast.success('تم الإعادة', {
            icon: '↩️',
            duration: 1000,
            className: 'animate-fade-in'
          });
          break;
          
        case 's':
          event.preventDefault();
          onSave();
          toast.success('تم الحفظ', {
            icon: '💾',
            duration: 1500,
            className: 'animate-scale-in'
          });
          break;
          
        case 'c':
          event.preventDefault();
          onCopy();
          toast.success('تم النسخ', {
            icon: '📋',
            duration: 1000,
            className: 'animate-fade-in'
          });
          break;
          
        case 'v':
          event.preventDefault();
          onPaste();
          toast.success('تم اللصق', {
            icon: '📝',
            duration: 1000,
            className: 'animate-fade-in'
          });
          break;
          
        case 'a':
          event.preventDefault();
          onSelectAll();
          toast.success('تم تحديد الكل', {
            icon: '✅',
            duration: 1000,
            className: 'animate-fade-in'
          });
          break;

        case '=':
        case '+':
          event.preventDefault();
          onZoomIn();
          toast.success('تكبير', {
            icon: '🔍',
            duration: 800,
            className: 'animate-scale-in'
          });
          break;

        case '-':
          event.preventDefault();
          onZoomOut();
          toast.success('تصغير', {
            icon: '🔍',
            duration: 800,
            className: 'animate-scale-in'
          });
          break;

        case '0':
          event.preventDefault();
          onZoomReset();
          toast.success('إعادة تعيين التكبير', {
            icon: '🎯',
            duration: 1000,
            className: 'animate-fade-in'
          });
          break;

        case 'g':
          event.preventDefault();
          onToggleGrid();
          toast.success('تبديل الشبكة', {
            icon: '📐',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;

        case 'shift':
          if (shiftKey) {
            event.preventDefault();
            onToggleSnap();
            toast.success('تبديل الجذب', {
              icon: '🧲',
              duration: 800,
              className: 'animate-fade-in'
            });
          }
          break;
      }
    }

    // Tool shortcuts (no modifier keys)
    if (!isCtrlOrCmd && !altKey && !shiftKey) {
      switch (key.toLowerCase()) {
        case 'v':
          event.preventDefault();
          onToolSelect('select');
          toast.success('أداة التحديد', {
            icon: '👆',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;
        case 'h':
          event.preventDefault();
          onToolSelect('hand');
          toast.success('أداة اليد', {
            icon: '✋',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;
        case 'p':
          event.preventDefault();
          onToolSelect('pen');
          toast.success('أداة القلم', {
            icon: '✏️',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;
        case 'r':
          event.preventDefault();
          onToolSelect('rectangle');
          toast.success('أداة المستطيل', {
            icon: '▭',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;
        case 'c':
          event.preventDefault();
          onToolSelect('circle');
          toast.success('أداة الدائرة', {
            icon: '⭕',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;
        case 't':
          event.preventDefault();
          onToolSelect('text');
          toast.success('أداة النص', {
            icon: '📝',
            duration: 800,
            className: 'animate-fade-in'
          });
          break;
      }
    }
    
    // Delete key
    if (key === 'Delete' || key === 'Backspace') {
      event.preventDefault();
      onDelete();
      toast.success('تم الحذف', {
        icon: '🗑️',
        duration: 1000,
        className: 'animate-fade-in'
      });
    }

    // Escape key - deselect all
    if (key === 'Escape') {
      event.preventDefault();
      onToolSelect('select');
      toast.info('تم إلغاء التحديد', {
        icon: '❌',
        duration: 800,
        className: 'animate-fade-in'
      });
    }
  }, [
    onUndo, onRedo, onSave, onCopy, onPaste, onDelete, onSelectAll,
    onZoomIn, onZoomOut, onZoomReset, onToolSelect, onToggleGrid, onToggleSnap
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null; // This component doesn't render anything
};
