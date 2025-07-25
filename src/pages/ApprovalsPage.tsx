import React from 'react';
import ApprovalsBoard from '@/components/Approvals/ApprovalsBoard';

const ApprovalsPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">نظام الموافقات</h1>
        <p className="text-muted-foreground text-right mt-2">
          إدارة ومراجعة جميع طلبات الموافقة في النظام
        </p>
      </div>
      
      <ApprovalsBoard />
    </div>
  );
};

export default ApprovalsPage;