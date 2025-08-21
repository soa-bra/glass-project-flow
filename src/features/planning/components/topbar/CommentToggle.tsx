// src/features/planning/components/topbar/CommentToggle.tsx
'use client';
import React from 'react';
import { useTools } from '../../store/tools.store';

export default function CommentToggle(){
  const { tool, setTool } = useTools();
  const active = tool==='comment';
  return (
    <button className={active?'active':''} onClick={()=>setTool(active?'select':'comment')} title="C">
      تعليق {active?'🟢':'💬'}
    </button>
  );
}
