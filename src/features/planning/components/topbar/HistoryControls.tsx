// src/features/planning/components/topbar/HistoryControls.tsx
'use client';
import React from 'react';
import { useHistory } from '../../store/history.store';

export default function HistoryControls(){
  const { undo, redo, canUndo, canRedo } = useHistory();
  return (
    <>
      <button onClick={undo} disabled={!canUndo} title="Ctrl+Z">↩ تراجع</button>
      <button onClick={redo} disabled={!canRedo} title="Ctrl+Y">↪ إعادة</button>
    </>
  );
}
