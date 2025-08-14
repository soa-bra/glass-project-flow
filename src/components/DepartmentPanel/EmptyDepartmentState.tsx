import React from 'react';
export const EmptyDepartmentState: React.FC = () => {
  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl flex items-center justify-center ">
      <div className="text-center text-soabra-ink-60 font-arabic">
        <h3 className="text-display-m font-bold mb-2">اختر إدارة للبدء</h3>
        <p className="text-body">قم بتحديد إدارة من القائمة الجانبية لعرض المحتوى</p>
      </div>
    </div>;
};