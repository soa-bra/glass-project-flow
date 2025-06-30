
import React from 'react';
import { FinancialDashboard } from '../DepartmentTabs/Financial';

export const FinancialDepartment: React.FC = () => {
  return (
    <div style={{
      background: 'var(--backgrounds-admin-ops-board-bg)'
    }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-0 mx-0">
          <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
            <FinancialDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};
