
import React from 'react';
import { Button } from '@/components/ui/button';

export default function QuickToolbar() {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border">
      <Button variant="ghost" size="sm">تحديد</Button>
      <Button variant="ghost" size="sm">رسم</Button>
      <Button variant="ghost" size="sm">نص</Button>
      <Button variant="ghost" size="sm">أشكال</Button>
    </div>
  );
}
