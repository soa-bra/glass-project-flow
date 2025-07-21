import React from 'react';

interface ShortcutItem {
  label: string;
  shortcut: string;
  category: string;
}

export const SelectionKeyboardShortcuts: React.FC = () => {
  const shortcuts: ShortcutItem[] = [
    // العمليات الأساسية
    { label: 'نسخ', shortcut: 'Ctrl+C', category: 'أساسي' },
    { label: 'قص', shortcut: 'Ctrl+X', category: 'أساسي' },
    { label: 'لصق', shortcut: 'Ctrl+V', category: 'أساسي' },
    { label: 'حذف', shortcut: 'Delete', category: 'أساسي' },
    { label: 'تحديد الكل', shortcut: 'Ctrl+A', category: 'أساسي' },
    { label: 'إلغاء التحديد', shortcut: 'Esc', category: 'أساسي' },
    
    // التجميع
    { label: 'تجميع', shortcut: 'Ctrl+G', category: 'تجميع' },
    { label: 'فك التجميع', shortcut: 'Shift+G', category: 'تجميع' },
    
    // الحركة
    { label: 'تحريك دقيق', shortcut: '← ↑ → ↓', category: 'حركة' },
    { label: 'تحريك سريع', shortcut: 'Shift + ←↑→↓', category: 'حركة' },
    { label: 'تكرار العنصر', shortcut: 'Cmd + السحب', category: 'حركة' },
    { label: 'تحريك محوري', shortcut: 'Shift + السحب', category: 'حركة' }
  ];

  const categories = [...new Set(shortcuts.map(s => s.category))];

  return (
    <div className="bg-[#e9eff4] border border-[#d1e1ea] rounded-[16px] p-3">
      <h4 className="text-sm font-medium font-arabic mb-3 text-black">⌨️ اختصارات لوحة المفاتيح</h4>
      <div className="space-y-3">
        {categories.map(category => (
          <div key={category}>
            <h5 className="text-xs font-medium font-arabic mb-2 text-black/80">{category}</h5>
            <div className="text-xs font-arabic space-y-1">
              {shortcuts
                .filter(s => s.category === category)
                .map(shortcut => (
                  <div key={shortcut.label} className="flex justify-between items-center">
                    <span className="text-black/70">{shortcut.label}</span>
                    <code className="bg-white px-2 py-1 rounded-[6px] text-xs text-black border border-[#d1e1ea]">
                      {shortcut.shortcut}
                    </code>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};