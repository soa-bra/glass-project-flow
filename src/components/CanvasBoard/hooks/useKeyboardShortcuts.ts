import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface KeyboardShortcutsProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onNew: () => void;
  onOpen: () => void;
  onCopy: () => void;
  onGridToggle: () => void;
  onSnapToggle: () => void;
  onSmartProjectGenerate: () => void;
  canvasRef?: React.RefObject<HTMLDivElement>;
}

export const useKeyboardShortcuts = ({
  selectedTool,
  onToolSelect,
  onUndo,
  onRedo,
  onSave,
  onNew,
  onOpen,
  onCopy,
  onGridToggle,
  onSnapToggle,
  onSmartProjectGenerate,
  canvasRef
}: KeyboardShortcutsProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;
    const key = event.key.toLowerCase();

    // منع التنفيذ إذا كان المستخدم يكتب في input أو textarea
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
      return;
    }

    // إيقاف الأحداث الافتراضية للاختصارات المهمة
    const shouldPreventDefault = () => {
      if (isCtrl && ['z', 'y', 's', 'n', 'o', 'd', 'p', 'g'].includes(key)) return true;
      if (['v', 'p', 'z', 'h', 'u', 'c', 't', 'r', 's', 'g', 'escape'].includes(key)) return true;
      return false;
    };

    if (shouldPreventDefault()) {
      event.preventDefault();
    }

    // Top Toolbar Shortcuts (مع Ctrl/Cmd)
    if (isCtrl) {
      switch (key) {
        case 'z':
          if (isShift) {
            onRedo();
            toast.success('إعادة الإجراء');
          } else {
            onUndo();
            toast.success('تراجع عن الإجراء');
          }
          return;
        case 'y':
          onRedo();
          toast.success('إعادة الإجراء');
          return;
        case 's':
          if (isShift) {
            toast.info('تصدير المشروع');
          } else {
            onSave();
            toast.success('تم حفظ المشروع');
          }
          return;
        case 'n':
          onNew();
          toast.info('مشروع جديد');
          return;
        case 'o':
          onOpen();
          toast.info('فتح مشروع');
          return;
        case 'd':
          onCopy();
          toast.success('تم إنشاء نسخة');
          return;
        case 'p':
          onSmartProjectGenerate();
          toast.info('توليد مشروع ذكي...');
          return;
        case 'g':
          if (isShift) {
            // فك التجميع
            toast.info('فك التجميع');
          } else {
            onSnapToggle();
            toast.info('تبديل المحاذاة');
          }
          return;
      }
    }

    // Grid shortcuts
    if (key === 'g' && !isCtrl) {
      onGridToggle();
      toast.info('تبديل الشبكة');
      return;
    }

    // Bottom Toolbar Tool Shortcuts (بدون Ctrl)
    if (!isCtrl && !isShift && !isAlt) {
      switch (key) {
        case 'v':
          onToolSelect('select');
          toast.info('أداة التحديد');
          return;
        case 'p':
          onToolSelect('smart-pen');
          toast.info('القلم الذكي');
          return;
        case 'z':
          onToolSelect('zoom');
          toast.info('أداة الزوم');
          return;
        case 'h':
          onToolSelect('hand');
          toast.info('أداة الكف');
          return;
        case 'u':
          onToolSelect('upload');
          toast.info('رفع مرفق');
          return;
        case 'c':
          onToolSelect('comment');
          toast.info('أداة التعليق');
          return;
        case 't':
          onToolSelect('text');
          toast.info('أداة النص');
          return;
        case 'r':
          onToolSelect('shape');
          toast.info('أداة الشكل');
          return;
        case 's':
          onToolSelect('smart-element');
          toast.info('العنصر الذكي');
          return;
        case 'escape':
          onToolSelect('select');
          toast.info('إلغاء التحديد');
          return;
      }
    }

    // Special shortcuts with modifiers
    if (isCtrl && isAlt) {
      switch (key) {
        case 'h':
          // فتح قائمة السجل
          toast.info('سجل العمليات');
          return;
      }
    }

    // Navigation shortcuts
    if (selectedTool === 'select' && !isCtrl) {
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        const pixels = isShift ? 10 : 1;
        // تحريك العنصر المحدد
        toast.info(`تحريك ${pixels}px`);
        return;
      }
    }

    // Pan tool with Space
    if (key === ' ' && selectedTool !== 'hand') {
      onToolSelect('hand');
      toast.info('أداة الكف (مؤقت)');
      return;
    }

  }, [
    selectedTool, onToolSelect, onUndo, onRedo, onSave, onNew, 
    onOpen, onCopy, onGridToggle, onSnapToggle, onSmartProjectGenerate
  ]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    // إعادة تعيين أداة الكف المؤقتة عند رفع مفتاح Space
    if (event.key === ' ' && selectedTool === 'hand') {
      onToolSelect('select');
      toast.info('العودة لأداة التحديد');
    }
  }, [selectedTool, onToolSelect]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // إرجاع معلومات الاختصارات للمساعدة
  const shortcuts = {
    tools: {
      'V': 'أداة التحديد',
      'P': 'القلم الذكي', 
      'Z': 'أداة الزوم',
      'H': 'أداة الكف',
      'U': 'رفع مرفق',
      'C': 'أداة التعليق',
      'T': 'أداة النص',
      'R': 'أداة الشكل',
      'S': 'العنصر الذكي'
    },
    actions: {
      'Ctrl+Z': 'تراجع',
      'Ctrl+Y': 'إعادة',
      'Ctrl+S': 'حفظ',
      'Ctrl+N': 'جديد',
      'Ctrl+O': 'فتح',
      'Ctrl+D': 'نسخ',
      'Ctrl+P': 'مشروع ذكي',
      'G': 'تبديل الشبكة',
      'Space': 'أداة الكف (مؤقت)',
      'Esc': 'إلغاء'
    }
  };

  return { shortcuts };
};