import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Keyboard } from 'lucide-react';
export const SelectionKeyboardShortcuts: React.FC = () => {
  const shortcuts = [{
    key: 'V',
    action: 'تفعيل أداة التحديد'
  }, {
    key: 'Shift + Click',
    action: 'تحديد عناصر متعددة'
  }, {
    key: 'Ctrl/Cmd + A',
    action: 'تحديد الكل'
  }, {
    key: 'Delete/Backspace',
    action: 'حذف العنصر'
  }, {
    key: 'Ctrl/Cmd + C',
    action: 'نسخ'
  }, {
    key: 'Ctrl/Cmd + V',
    action: 'لصق'
  }, {
    key: 'Ctrl/Cmd + X',
    action: 'قص'
  }, {
    key: 'Ctrl/Cmd + Z',
    action: 'تراجع'
  }, {
    key: 'Ctrl/Cmd + Y',
    action: 'إعادة'
  }, {
    key: '↑↓←→',
    action: 'تحريك دقيق 1px'
  }, {
    key: 'Shift + ↑↓←→',
    action: 'تحريك سريع 10px'
  }, {
    key: 'Ctrl + G',
    action: 'تجميع'
  }, {
    key: 'Shift + G',
    action: 'فك التجميع'
  }, {
    key: 'Esc',
    action: 'إلغاء التحديد'
  }];
  return;
};