import React from 'react';
interface SettingsPanelLayoutProps {
  children: React.ReactNode;
}
export const SettingsPanelLayout: React.FC<SettingsPanelLayoutProps> = ({
  children
}) => {
  return <div style={{
    background: 'var(--backgrounds-admin-ops-board-bg)'
  }} className="h-full rounded-3xl overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto px-0 mx-0 bg-[#b7cccc]">
          <div className="h-full mx-6 my-6 rounded-2xl overflow-hidden bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>;
};