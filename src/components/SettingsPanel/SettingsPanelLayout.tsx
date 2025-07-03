import React from 'react';

interface SettingsPanelLayoutProps {
  children: React.ReactNode;
}

export const SettingsPanelLayout: React.FC<SettingsPanelLayoutProps> = ({ children }) => {
  return (
    <div 
      className="w-full h-full rounded-3xl overflow-hidden"
      style={{
        background: 'var(--backgrounds-workspace-bg)',
        transition: 'all var(--animation-duration-main) var(--animation-easing)'
      }}
    >
      {children}
    </div>
  );
};