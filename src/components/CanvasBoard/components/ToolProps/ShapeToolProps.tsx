import React from 'react';
import { Input } from '@/components/ui/input';

const ShapeToolProps: React.FC = () => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium font-arabic">خصائص الشكل</h4>
      <div className="grid grid-cols-2 gap-2">
        <select className="p-2 border rounded">
          <option>مستطيل</option>
          <option>دائرة</option>
          <option>مثلث</option>
          <option>خط</option>
        </select>
        <Input type="number" placeholder="سمك الحد" />
      </div>
    </div>
  );
};

export default ShapeToolProps;