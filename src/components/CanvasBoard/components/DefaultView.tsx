import React from 'react';
import { CanvasBoardLauncher } from '../core/CanvasBoardLauncher';

interface DefaultViewProps {
  onStartCanvas: () => void;
}

export const DefaultView: React.FC<DefaultViewProps> = ({ onStartCanvas }) => {
  return (
    <CanvasBoardLauncher
      onStartCanvas={onStartCanvas}
      onOpenTemplate={() => console.log('فتح قالب')}
      onUploadFile={() => console.log('رفع ملف')}
      onBrowseProjects={() => console.log('استعراض المشاريع')}
    />
  );
};