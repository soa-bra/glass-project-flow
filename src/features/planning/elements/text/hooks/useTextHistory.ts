/**
 * useTextHistory - Hook لإدارة Undo/Redo في محرر النص
 * 
 * ✅ يخزن سجل التغييرات في History Stack
 * ✅ يدعم Ctrl+Z للتراجع و Ctrl+Shift+Z للإعادة
 * ✅ يحد من حجم السجل لتوفير الذاكرة
 */

import { useRef, useCallback, useState } from 'react';

interface HistoryState {
  content: string;
  timestamp: number;
}

interface UseTextHistoryOptions {
  /** الحد الأقصى لعدد الحالات المحفوظة */
  maxHistorySize?: number;
  /** المحتوى الأولي */
  initialContent?: string;
  /** دالة يتم استدعاؤها عند تغيير المحتوى */
  onContentChange?: (content: string) => void;
}

interface UseTextHistoryReturn {
  /** إضافة حالة جديدة للسجل */
  pushState: (content: string) => void;
  /** التراجع عن آخر تغيير */
  undo: () => string | null;
  /** إعادة آخر تغيير تم التراجع عنه */
  redo: () => string | null;
  /** هل يمكن التراجع */
  canUndo: boolean;
  /** هل يمكن الإعادة */
  canRedo: boolean;
  /** المحتوى الحالي */
  currentContent: string;
  /** مسح السجل */
  clearHistory: () => void;
  /** عدد الحالات في سجل Undo */
  undoCount: number;
  /** عدد الحالات في سجل Redo */
  redoCount: number;
}

export function useTextHistory({
  maxHistorySize = 50,
  initialContent = '',
  onContentChange
}: UseTextHistoryOptions = {}): UseTextHistoryReturn {
  // سجل Undo - الحالات السابقة
  const undoStackRef = useRef<HistoryState[]>([]);
  
  // سجل Redo - الحالات التي تم التراجع عنها
  const redoStackRef = useRef<HistoryState[]>([]);
  
  // المحتوى الحالي
  const [currentContent, setCurrentContent] = useState(initialContent);
  
  // تتبع آخر وقت حفظ (لتجنب الحفظ المتكرر)
  const lastSaveTimeRef = useRef<number>(0);
  const debounceTimeMs = 300; // تأخير 300 ميلي ثانية
  
  // State للـ UI (لإعادة الرسم)
  const [, forceUpdate] = useState({});
  
  /**
   * إضافة حالة جديدة للسجل
   */
  const pushState = useCallback((content: string) => {
    const now = Date.now();
    
    // تجاهل إذا كان المحتوى نفسه
    if (content === currentContent) return;
    
    // تجاهل إذا مر وقت قصير جداً (debounce)
    if (now - lastSaveTimeRef.current < debounceTimeMs) {
      // تحديث المحتوى الحالي فقط بدون حفظ في السجل
      setCurrentContent(content);
      return;
    }
    
    lastSaveTimeRef.current = now;
    
    // حفظ الحالة الحالية في سجل Undo
    undoStackRef.current.push({
      content: currentContent,
      timestamp: now
    });
    
    // تقليم السجل إذا تجاوز الحد
    if (undoStackRef.current.length > maxHistorySize) {
      undoStackRef.current = undoStackRef.current.slice(-maxHistorySize);
    }
    
    // مسح سجل Redo عند إضافة تغيير جديد
    redoStackRef.current = [];
    
    // تحديث المحتوى الحالي
    setCurrentContent(content);
    
    // إعلام المستمعين
    onContentChange?.(content);
    
    // إجبار إعادة الرسم
    forceUpdate({});
  }, [currentContent, maxHistorySize, onContentChange]);
  
  /**
   * التراجع عن آخر تغيير
   */
  const undo = useCallback((): string | null => {
    if (undoStackRef.current.length === 0) return null;
    
    // استخراج آخر حالة من سجل Undo
    const previousState = undoStackRef.current.pop();
    if (!previousState) return null;
    
    // حفظ الحالة الحالية في سجل Redo
    redoStackRef.current.push({
      content: currentContent,
      timestamp: Date.now()
    });
    
    // تحديث المحتوى
    setCurrentContent(previousState.content);
    onContentChange?.(previousState.content);
    
    // إجبار إعادة الرسم
    forceUpdate({});
    
    return previousState.content;
  }, [currentContent, onContentChange]);
  
  /**
   * إعادة آخر تغيير تم التراجع عنه
   */
  const redo = useCallback((): string | null => {
    if (redoStackRef.current.length === 0) return null;
    
    // استخراج آخر حالة من سجل Redo
    const nextState = redoStackRef.current.pop();
    if (!nextState) return null;
    
    // حفظ الحالة الحالية في سجل Undo
    undoStackRef.current.push({
      content: currentContent,
      timestamp: Date.now()
    });
    
    // تحديث المحتوى
    setCurrentContent(nextState.content);
    onContentChange?.(nextState.content);
    
    // إجبار إعادة الرسم
    forceUpdate({});
    
    return nextState.content;
  }, [currentContent, onContentChange]);
  
  /**
   * مسح السجل بالكامل
   */
  const clearHistory = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    forceUpdate({});
  }, []);
  
  return {
    pushState,
    undo,
    redo,
    canUndo: undoStackRef.current.length > 0,
    canRedo: redoStackRef.current.length > 0,
    currentContent,
    clearHistory,
    undoCount: undoStackRef.current.length,
    redoCount: redoStackRef.current.length
  };
}

export default useTextHistory;
