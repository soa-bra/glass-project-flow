
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';

export const SelectionKeyboardShortcuts: React.FC = () => {
  const shortcuts = [
    { key: 'Ctrl + A', action: 'تحديد الكل' },
    { key: 'Ctrl + C', action: 'نسخ' },
    { key: 'Ctrl + X', action: 'قص' },
    { key: 'Ctrl + V', action: 'لصق' },
    { key: 'Delete', action: 'حذف' },
    { key: 'Ctrl + G', action: 'تجميع' },
    { key: 'Ctrl + Shift + G', action: 'إلغاء التجميع' },
    { key: 'Arrow Keys', action: 'تحريك بكسل واحد' },
    { key: 'Shift + Arrow', action: 'تحريك 10 بكسل' },
    { key: 'Escape', action: 'إلغاء التحديد' }
  ];

  return (
    <Card className="w-full bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-arabic flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          اختصارات الكيبورد
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex justify-between items-center text-xs">
              <span className="font-mono bg-white px-2 py-1 rounded border text-blue-800">
                {shortcut.key}
              </span>
              <span className="font-arabic text-blue-700">{shortcut.action}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
