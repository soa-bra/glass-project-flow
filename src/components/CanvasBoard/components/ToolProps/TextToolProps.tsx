import React from 'react';
import { Input } from '@/components/ui/input';

const TextToolProps: React.FC = () => {
  return (
    <div className="space-y-3">
      <h4 className="font-medium font-arabic">خصائص النص</h4>
      <Input placeholder="محتوى النص..." />
      <div className="grid grid-cols-2 gap-2">
        <select className="p-2 border rounded">
          <option>العادي</option>
          <option>عريض</option>
          <option>مائل</option>
        </select>
        <select className="p-2 border rounded">
          <option>صغير</option>
          <option>متوسط</option>
          <option>كبير</option>
        </select>
      </div>
    </div>
  );
};

export default TextToolProps;