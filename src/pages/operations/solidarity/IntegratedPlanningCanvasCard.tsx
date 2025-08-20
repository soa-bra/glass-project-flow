// Integrated Planning Canvas Card
import React from 'react';
import CollaborativeCanvas from '@/apps/brain/canvas/CollaborativeCanvas';
import { AuthProvider } from '@/lib/auth/auth-provider';

export default function IntegratedPlanningCanvasCard() {
  return (
    <AuthProvider>
      <div 
        id="solidarity-planning-canvas" 
        className="h-full w-full rounded-2xl overflow-hidden bg-white shadow-lg"
        data-test-id="integrated-planning-canvas"
      >
        <CollaborativeCanvas boardId="integrated-planning-default" />
      </div>
    </AuthProvider>
  );
}