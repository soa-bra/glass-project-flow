// src/features/planning/components/topbar/FileMenu.tsx
'use client';
import React from 'react';
import { exportPNG } from '../../services/export/export-png';
import { exportSVG } from '../../services/export/export-svg';
import { exportPDF } from '../../services/export/export-pdf';
import { useCanvasStore } from '../../store/canvas.store';
import { useHistory } from '../../store/history.store';

export default function FileMenu(){
  const { snapshot } = useHistory();
  const { clear } = useCanvasStore.getState();
  return (
    <div className="file-menu" role="group" aria-label="File">
      <button onClick={()=>{ snapshot(); clear(); }}>جديد</button>
      <button onClick={()=>exportPNG({ background:'#fff', scale:2 })}>PNG</button>
      <button onClick={()=>exportSVG()}>SVG</button>
      <button onClick={()=>exportPDF()}>PDF</button>
    </div>
  );
}
