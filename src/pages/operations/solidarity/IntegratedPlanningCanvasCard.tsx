// Integrated Planning Canvas Card
import React from 'react';
import CollaborativeCanvas from '@/apps/brain/canvas/CollaborativeCanvas';
import { AuthProvider } from '@/lib/auth/auth-provider';

export default function IntegratedPlanningCanvasCard() {
  return (
    <AuthProvider>
      <div 
        className="relative w-full h-[calc(100vh-180px)] min-h-[640px] rounded-2xl overflow-hidden bg-white/90"
        data-test-id="integrated-planning-canvas"
      >
        <CollaborativeCanvas
          boardAlias="integrated-planning-default"
          data-test-id="integrated-planning-canvas"
        />
      </div>
    </AuthProvider>
  );
}