import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

export const SelectionKeyboardShortcuts: React.FC = () => {
  const shortcuts = [
    { key: 'V', action: 'تفعيل أداة التحديد' },
    { key: 'Shift + Click', action: 'تحديد عناصر متعددة' },
    { key: 'Ctrl/Cmd + A', action: 'تحديد الكل' },
    { key: 'Delete/Backspace', action: 'حذف العنصر' },
    { key: 'Ctrl/Cmd + C', action: 'نسخ' },
    { key: 'Ctrl/Cmd + V', action: 'لصق' },
    { key: 'Ctrl/Cmd + X', action: 'قص' },
    { key: 'Ctrl/Cmd + Z', action: 'تراجع' },
    { key: 'Ctrl/Cmd + Y', action: 'إعادة' },
    { key: '↑↓←→', action: 'تحريك دقيق 1px' },
    { key: 'Shift + ↑↓←→', action: 'تحريك سريع 10px' },
    { key: 'Ctrl + G', action: 'تجميع' },
    { key: 'Shift + G', action: 'فك التجميع' },
    { key: 'Esc', action: 'إلغاء التحديد' }
  ];

  return (
    <Card className="bg-blue-50/50 border-blue-200 rounded-[16px]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Keyboard className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium font-arabic text-blue-800">اختصارات لوحة المفاتيح</h4>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between text-xs">
              <span className="text-gray-700 font-arabic">{shortcut.action}</span>
              <code className="bg-white px-2 py-1 rounded text-blue-600 font-mono border border-blue-200">
                {shortcut.key}
              </code>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};