
import React from 'react';
import { Button } from '@/components/ui/button';

export default function TopToolbar() {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">لوحة التخطيط</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">حفظ</Button>
        <Button variant="outline" size="sm">مشاركة</Button>
      </div>
    </div>
  );
}
