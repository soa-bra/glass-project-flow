import React from 'react';
import AuditLogViewer from '@/components/Audit/AuditLogViewer';

const AuditPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">سجل التدقيق</h1>
        <p className="text-muted-foreground text-right mt-2">
          مراقبة وتتبع جميع الأحداث والتفاعلات في النظام
        </p>
      </div>
      
      <AuditLogViewer />
    </div>
  );
};

export default AuditPage;