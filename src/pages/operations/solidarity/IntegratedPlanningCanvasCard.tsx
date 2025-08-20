import React from 'react';
import CollaborativeCanvas from '@/apps/brain/canvas/CollaborativeCanvas';
import { AuthProvider } from '@/lib/auth/auth-provider';

interface Props {
  className?: string;
  'data-test-id'?: string;
  boardAlias?: string;
}

export default function IntegratedPlanningCanvasCard({
  className = '',
  'data-test-id': dataTestId = 'integrated-planning-canvas',
  boardAlias = 'integrated-planning-default',
}: Props) {
  return (
    <AuthProvider>
      <div
        className={`relative w-full h-full rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm ${className}`}
        data-test-id={dataTestId}
      >
        <CollaborativeCanvas boardAlias={boardAlias} />
      </div>
    </AuthProvider>
  );
}
