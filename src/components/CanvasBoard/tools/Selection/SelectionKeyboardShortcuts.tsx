import React from 'react';

interface ShortcutItem {
  label: string;
  shortcut: string;
}

export const SelectionKeyboardShortcuts: React.FC = () => {
  const shortcuts: ShortcutItem[] = [
    { label: 'نسخ', shortcut: 'Ctrl+C' },
    { label: 'قص', shortcut: 'Ctrl+X' },
    { label: 'لصق', shortcut: 'Ctrl+V' },
    { label: 'حذف', shortcut: 'Delete' },
    { label: 'تحديد الكل', shortcut: 'Ctrl+A' },
    { label: 'إلغاء التحديد', shortcut: 'Esc' }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <h4 className="text-sm font-medium font-arabic mb-2">⌨️ اختصارات لوحة المفاتيح</h4>
      <div className="text-xs font-arabic space-y-1">
        {shortcuts.map(shortcut => (
          <div key={shortcut.label} className="flex justify-between">
            <span>{shortcut.label}</span>
            <code className="bg-white px-1 rounded text-xs">{shortcut.shortcut}</code>
          </div>
        ))}
      </div>
    </div>
  );
};