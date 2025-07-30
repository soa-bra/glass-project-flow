import React from 'react';
import { CanvasBoard } from '@/components/CanvasBoard';

export const CanvasPage: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <CanvasBoard 
        projectId="demo-project"
        userId="user-1"
        userName="مستخدم تجريبي"
      />
    </div>
  );
};