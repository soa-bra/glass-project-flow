import React from 'react';

export default function PlanningWorkspace({ isSidebarCollapsed }: { isSidebarCollapsed?: boolean }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">مساحة التخطيط</h1>
      <div className="mt-4 bg-white rounded-lg border p-8 text-center">
        <p>مساحة التخطيط التفاعلية</p>
      </div>
    </div>
  );
}