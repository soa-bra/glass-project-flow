// src/features/planning/components/topbar/SmartProjectGenerator.tsx
'use client';
import React from 'react';
import { useAIStore } from '../../store/ai.store';
import { useCanvasStore } from '../../store/canvas.store';

export default function SmartProjectGenerator(){
  const { generating, generateFromScene } = useAIStore();
  const scene = useCanvasStore(state=>state.scene);
  return (
    <button onClick={()=>generateFromScene(scene)} disabled={generating} title="AI: Smart Project">
      {generating ? 'AI…' : 'توليد مشروع ذكي'}
    </button>
  );
}
