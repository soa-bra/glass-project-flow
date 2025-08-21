// src/features/planning/components/topbar/GridMenu.tsx
'use client';
import React from 'react';
import { useCanvasStore } from '../../store/canvas.store';

export default function GridMenu(){
  const { scene } = useCanvasStore();
  const grid = scene.grid;
  return (
    <div className="grid-menu" role="group" aria-label="Grid">
      <label><input type="checkbox" checked={grid.show}
        onChange={e=>useCanvasStore.setState(s=>({scene:{...s.scene, grid:{...s.scene.grid, show:e.target.checked}}}))}/> شبكة</label>
      <label><input type="checkbox" checked={grid.snap}
        onChange={e=>useCanvasStore.setState(s=>({scene:{...s.scene, grid:{...s.scene.grid, snap:e.target.checked}}}))}/> سناب</label>
      <select value={grid.size} onChange={e=>useCanvasStore.setState(s=>({scene:{...s.scene, grid:{...s.scene.grid, size: Number(e.target.value) as any}}}))}>
        <option value={8}>8</option><option value={16}>16</option><option value={32}>32</option><option value={64}>64</option>
      </select>
      <select value={grid.type} onChange={e=>useCanvasStore.setState(s=>({scene:{...s.scene, grid:{...s.scene.grid, type: e.target.value as any}}}))}>
        <option value="dots">Dots</option><option value="grid">Grid</option><option value="iso">Isometric</option><option value="hex">Hex</option>
      </select>
    </div>
  );
}
