// src/features/planning/PlanningWorkspace.tsx
'use client';
import React from 'react';
import { PlanningPanel } from './PlanningPanel';
import styles from './styles/planning.css?inline';
import { useCollab } from './hooks/useCollaboration';
import { Panel } from '@/components/Panel';

export function PlanningWorkspace() {
  useInjectStyle(styles);
  useCollab(); // يفعّل presence + sync

  return (
    <div style={{display:'grid', gridTemplateRows:'auto 1fr auto', height:'100vh'}}>
      <PlanningPanel />
      <footer style={{fontSize:12, padding:'6px 10px', borderTop:'1px solid var(--line)', background:'var(--surface)'}}>
        سـوبــرا — لوحة التخطيط التضامني · Realtime + Undo/Redo · RTL/A11y جاهز
      </footer>
    </div>
  );
}

function useInjectStyle(css: string) {
  React.useEffect(() => {
    const el = document.createElement('style');
    el.dataset['planningCss'] = '1';
    el.textContent = css;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, [css]);
}
