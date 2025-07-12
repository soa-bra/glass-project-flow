import { useEffect, useState } from 'react';
import { TOOL_KEYBOARD_SHORTCUTS, MAIN_TOOLBAR_TOOLS } from '../constants';

interface UseToolShortcutsProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
  disabled?: boolean;
  showNotifications?: boolean;
}

export const useToolShortcuts = ({
  selectedTool,
  onToolSelect,
  disabled = false,
  showNotifications = true
}: UseToolShortcutsProps) => {
  const [notification, setNotification] = useState<{
    show: boolean;
    toolName: string;
    shortcut: string;
  }>({
    show: false,
    toolName: '',
    shortcut: ''
  });
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // تجاهل الاختصارات إذا كان المستخدم يكتب في حقل إدخال
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // تجاهل إذا كانت هناك مفاتيح معدلة (Ctrl, Alt, etc)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      const pressedKey = e.key.toLowerCase();
      
      // البحث عن الأداة المطابقة للمفتاح المضغوط
      const matchingTool = Object.entries(TOOL_KEYBOARD_SHORTCUTS).find(
        ([, shortcut]) => shortcut.toLowerCase() === pressedKey
      );

      if (matchingTool) {
        const [toolId] = matchingTool;
        e.preventDefault();
        
        // تبديل الأداة أو إبقاؤها محددة إذا كانت نفس الأداة
        if (selectedTool !== toolId) {
          onToolSelect(toolId);
          
          // عرض إشعار التبديل
          if (showNotifications) {
            const tool = MAIN_TOOLBAR_TOOLS.find(t => t.id === toolId);
            if (tool && tool.shortcut) {
              setNotification({
                show: true,
                toolName: tool.label,
                shortcut: tool.shortcut
              });
            }
          }
        }
      }
    };

    // إضافة مستمع الأحداث
    document.addEventListener('keydown', handleKeyDown);
    
    // تنظيف المستمع عند إلغاء التحميل
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedTool, onToolSelect, disabled]);

  // إرجاع قائمة الاختصارات للاستخدام في واجهة المستخدم
  return {
    shortcuts: TOOL_KEYBOARD_SHORTCUTS,
    getShortcutForTool: (toolId: string) => TOOL_KEYBOARD_SHORTCUTS[toolId as keyof typeof TOOL_KEYBOARD_SHORTCUTS],
    notification,
    hideNotification: () => setNotification(prev => ({ ...prev, show: false }))
  };
};