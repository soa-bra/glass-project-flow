/**
 * Canvas Accessibility Components
 * مكونات إمكانية الوصول للكانفاس
 */

import React, { useEffect, useState } from 'react';
import { useCanvasStore } from '@/stores/canvasStore';

/**
 * Live Region for Screen Reader Announcements
 * منطقة مباشرة لإعلانات قارئ الشاشة
 */
export const CanvasLiveRegion: React.FC = () => {
  const [announcement, setAnnouncement] = useState('');
  const { selectedElementIds, elements, activeTool } = useCanvasStore();
  
  // Announce selection changes
  useEffect(() => {
    if (selectedElementIds.length === 0) {
      setAnnouncement('لم يتم تحديد أي عنصر');
    } else if (selectedElementIds.length === 1) {
      const element = elements.find(e => e.id === selectedElementIds[0]);
      const typeLabels: Record<string, string> = {
        'shape': 'شكل',
        'text': 'نص',
        'sticky': 'ملاحظة لاصقة',
        'image': 'صورة',
        'frame': 'إطار',
        'arrow': 'سهم',
        'smart': 'عنصر ذكي'
      };
      setAnnouncement(`تم تحديد ${typeLabels[element?.type || ''] || 'عنصر'}`);
    } else {
      setAnnouncement(`تم تحديد ${selectedElementIds.length} عنصر`);
    }
  }, [selectedElementIds, elements]);
  
  // Announce tool changes
  useEffect(() => {
    const toolLabels: Record<string, string> = {
      'selection_tool': 'أداة التحديد',
      'smart_pen': 'القلم الذكي',
      'frame_tool': 'أداة الإطار',
      'file_uploader': 'رفع الملفات',
      'text_tool': 'أداة النص',
      'shapes_tool': 'أداة الأشكال',
      'smart_element_tool': 'العنصر الذكي'
    };
    setAnnouncement(`تم تفعيل ${toolLabels[activeTool] || activeTool}`);
  }, [activeTool]);
  
  return (
    <>
      {/* Polite announcements */}
      <div 
        role="status"
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      {/* Assertive announcements for urgent updates */}
      <div 
        role="alert"
        aria-live="assertive" 
        aria-atomic="true" 
        className="sr-only"
        id="canvas-urgent-announcements"
      />
    </>
  );
};

/**
 * Keyboard Instructions Panel
 * لوحة تعليمات لوحة المفاتيح
 */
interface KeyboardInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardInstructions: React.FC<KeyboardInstructionsProps> = ({ 
  isOpen, 
  onClose 
}) => {
  if (!isOpen) return null;
  
  const shortcuts = [
    { category: 'التنقل', items: [
      { keys: ['←', '→', '↑', '↓'], action: 'تحريك العناصر المحددة' },
      { keys: ['Tab'], action: 'الانتقال للعنصر التالي' },
      { keys: ['Shift', 'Tab'], action: 'الانتقال للعنصر السابق' },
      { keys: ['Space'], action: 'وضع التحريك (Pan)' },
    ]},
    { category: 'الأدوات', items: [
      { keys: ['V'], action: 'أداة التحديد' },
      { keys: ['T'], action: 'أداة النص' },
      { keys: ['R'], action: 'أداة الأشكال' },
      { keys: ['P'], action: 'القلم الذكي' },
      { keys: ['F'], action: 'أداة الإطار' },
      { keys: ['S'], action: 'العنصر الذكي' },
    ]},
    { category: 'التحرير', items: [
      { keys: ['Ctrl/⌘', 'C'], action: 'نسخ' },
      { keys: ['Ctrl/⌘', 'V'], action: 'لصق' },
      { keys: ['Ctrl/⌘', 'X'], action: 'قص' },
      { keys: ['Ctrl/⌘', 'D'], action: 'تكرار' },
      { keys: ['Ctrl/⌘', 'Z'], action: 'تراجع' },
      { keys: ['Ctrl/⌘', 'Shift', 'Z'], action: 'إعادة' },
      { keys: ['Delete', '/Backspace'], action: 'حذف' },
    ]},
    { category: 'العرض', items: [
      { keys: ['+', '/='], action: 'تكبير' },
      { keys: ['-'], action: 'تصغير' },
      { keys: ['0'], action: 'إعادة التكبير' },
      { keys: ['G'], action: 'تبديل الشبكة' },
      { keys: ['Ctrl/⌘', 'A'], action: 'تحديد الكل' },
      { keys: ['Escape'], action: 'إلغاء التحديد' },
    ]},
  ];
  
  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-instructions-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        <div className="sticky top-0 bg-white border-b border-sb-border p-4 flex items-center justify-between">
          <h2 id="keyboard-instructions-title" className="text-lg font-bold text-sb-ink">
            اختصارات لوحة المفاتيح
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-sb-panel-bg rounded-lg"
            aria-label="إغلاق"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-sm font-semibold text-sb-ink-60 mb-3">
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between py-2 border-b border-sb-border/50 last:border-0"
                  >
                    <span className="text-sm text-sb-ink">{item.action}</span>
                    <div className="flex gap-1">
                      {item.keys.map((key, keyIdx) => (
                        <kbd 
                          key={keyIdx}
                          className="px-2 py-1 text-xs font-mono bg-sb-panel-bg rounded border border-sb-border"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Skip Links for Keyboard Navigation
 * روابط التخطي للتنقل بلوحة المفاتيح
 */
export const SkipLinks: React.FC = () => {
  return (
    <nav 
      aria-label="روابط التخطي" 
      className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-0 focus-within:left-0 focus-within:z-[200] focus-within:bg-white focus-within:p-4 focus-within:shadow-lg"
    >
      <ul className="space-y-2">
        <li>
          <a 
            href="#canvas-main" 
            className="text-sb-ink underline focus:outline-none focus:ring-2 focus:ring-sb-ink"
          >
            الانتقال إلى اللوحة الرئيسية
          </a>
        </li>
        <li>
          <a 
            href="#toolbar-bottom" 
            className="text-sb-ink underline focus:outline-none focus:ring-2 focus:ring-sb-ink"
          >
            الانتقال إلى شريط الأدوات
          </a>
        </li>
        <li>
          <a 
            href="#layers-panel" 
            className="text-sb-ink underline focus:outline-none focus:ring-2 focus:ring-sb-ink"
          >
            الانتقال إلى لوحة الطبقات
          </a>
        </li>
      </ul>
    </nav>
  );
};

/**
 * Focus Trap for Modals
 * مصيدة التركيز للنوافذ المنبثقة
 */
interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, active }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active || !containerRef.current) return;
    
    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);
  
  return <div ref={containerRef}>{children}</div>;
};

/**
 * Accessible Element Description
 * وصف العنصر لقارئات الشاشة
 */
interface ElementDescriptionProps {
  element: {
    type: string;
    content?: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    locked?: boolean;
  };
}

export const ElementDescription: React.FC<ElementDescriptionProps> = ({ element }) => {
  const typeLabels: Record<string, string> = {
    'shape': 'شكل',
    'text': 'نص',
    'sticky': 'ملاحظة لاصقة',
    'image': 'صورة',
    'frame': 'إطار',
    'arrow': 'سهم',
    'smart': 'عنصر ذكي'
  };
  
  const description = [
    typeLabels[element.type] || element.type,
    element.content ? `المحتوى: ${element.content.substring(0, 50)}` : null,
    `الموقع: ${Math.round(element.position.x)}, ${Math.round(element.position.y)}`,
    `الحجم: ${Math.round(element.size.width)} × ${Math.round(element.size.height)}`,
    element.locked ? 'مقفل' : null
  ].filter(Boolean).join('. ');
  
  return (
    <span className="sr-only">
      {description}
    </span>
  );
};

export default CanvasLiveRegion;
