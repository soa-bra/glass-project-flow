import React, { useEffect } from 'react';
import { toast } from 'sonner';

interface KeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onUndo,
  onRedo,
  onSave,
  onCopy,
  onDelete,
  onSelectAll
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrlKey, metaKey, key, shiftKey } = event;
      const isCtrlOrCmd = ctrlKey || metaKey;

      // Prevent default for our shortcuts
      if (isCtrlOrCmd) {
        switch (key.toLowerCase()) {
          case 'z':
            event.preventDefault();
            if (shiftKey) {
              onRedo();
              toast.success('تم الإعادة');
            } else {
              onUndo();
              toast.success('تم التراجع');
            }
            break;
          
          case 'y':
            event.preventDefault();
            onRedo();
            toast.success('تم الإعادة');
            break;
            
          case 's':
            event.preventDefault();
            onSave();
            toast.success('تم الحفظ');
            break;
            
          case 'c':
            event.preventDefault();
            onCopy();
            toast.success('تم النسخ');
            break;
            
          case 'a':
            event.preventDefault();
            onSelectAll();
            toast.success('تم تحديد الكل');
            break;
        }
      }
      
      // Delete key
      if (key === 'Delete' || key === 'Backspace') {
        event.preventDefault();
        onDelete();
        toast.success('تم الحذف');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onUndo, onRedo, onSave, onCopy, onDelete, onSelectAll]);

  return null; // This component doesn't render anything
};