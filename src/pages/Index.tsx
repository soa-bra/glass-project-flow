
import React from 'react';
import { SimpleCollaborativeWhiteboard } from '@/components/CanvasBoard/components';

const Index = () => {
  return (
    <div className="w-full h-screen">
      <SimpleCollaborativeWhiteboard 
        projectId="demo-project" 
        userId="demo-user" 
      />
    </div>
  );
};

export default Index;
