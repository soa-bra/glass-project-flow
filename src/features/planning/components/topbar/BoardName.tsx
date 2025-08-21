// src/features/planning/components/topbar/BoardName.tsx
'use client';
import React from 'react';
import { usePanelsStore } from '../../store/panels.store';

export default function BoardName() {
  const { boardName, setBoardName } = usePanelsStore();
  React.useEffect(()=>{ document.title = boardName; }, [boardName]);
  return (
    <input
      aria-label="اسم اللوحة"
      value={boardName}
      onChange={(e)=>setBoardName(e.target.value)}
      className="board-name"
      placeholder="لوحتي"
    />
  );
}
