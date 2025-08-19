import React from 'react';

export const SelectionTips: React.FC = () => {
  return (
    <div className="text-xs text-gray-500 font-arabic space-y-1">
      <div>💡 استخدم Ctrl + النقر للتحديد المتعدد</div>
      <div>📦 اسحب لإنشاء صندوق تحديد</div>
      <div>🔒 العناصر المقفلة لا يمكن تحديدها</div>
    </div>
  );
};