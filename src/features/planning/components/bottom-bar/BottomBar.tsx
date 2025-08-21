// src/features/planning/components/bottom-bar/BottomBar.tsx
'use client';
import React from 'react';
import { useCanvasStore } from '../../store/canvas.store';
import { useHistory } from '../../store/history.store';

export default function BottomBar(){
  const { transform, setTransform } = useCanvasStore();
  const { undo, redo } = useHistory();
  const pct = Math.round(transform.scale*100);
  return (
    <div className="toolbar bottom">
      <button onClick={()=>setTransform({ scale: Math.max(.2, transform.scale*0.9) })}>-</button>
      <span>{pct}%</span>
      <button onClick={()=>setTransform({ scale: Math.min(4, transform.scale*1.1) })}>+</button>
      <button onClick={()=>setTransform({ x:0, y:0, scale:1 })}>ملاءمة</button>
      <span style={{flex:1}} />
      <button onClick={undo} title="Ctrl+Z">↩</button>
      <button onClick={redo} title="Ctrl+Y">↪</button>
    </div>
  );
}
