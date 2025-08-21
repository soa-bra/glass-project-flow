// src/features/planning/store/canvas.store.ts
'use client';
import { create } from 'zustand';
import type { Scene, BaseShape } from '../types/canvas';

type CanvasState = {
  scene: Scene;
  transform: { x:number; y:number; scale:number };
  setTransform: (t: Partial<{x:number;y:number;scale:number}>) => void;

  addShape: (s: Omit<BaseShape,'id'|'z'>) => string;
  updateShape: (id: string, patch: Partial<BaseShape>) => void;
  removeShape: (id: string) => void;
  duplicate: (id: string) => string|null;

  setSelected: (id: string|null) => void;
  selectedId: string|null;

  clear: () => void;
};

export const useCanvasStore = create<CanvasState>((set, get)=>({
  scene: { shapes: [], nextId: 1, grid: { show:true, snap:true, size:16, type:'dots' } },
  transform: { x: 0, y: 0, scale: 1 },
  setTransform: (t)=>set(({transform})=>({transform:{...transform, ...t}})),

  addShape: (s)=>{
    const id = `n${get().scene.nextId}`;
    set(({scene})=>{
      const z = scene.shapes.length ? Math.max(...scene.shapes.map(x=>x.z))+1 : 1;
      return { scene: { ...scene, nextId: scene.nextId+1, shapes:[...scene.shapes, {...s, id, z}] } };
    });
    return id;
  },
  updateShape: (id, patch)=>set(({scene})=>({
    scene:{...scene, shapes: scene.shapes.map(sh=> sh.id===id? {...sh, ...patch}: sh)}
  })),
  removeShape: (id)=>set(({scene, ...rest})=>({
    ...rest, scene:{...scene, shapes: scene.shapes.filter(s=>s.id!==id)}
  })),
  duplicate: (id)=>{
    const sh = get().scene.shapes.find(s=>s.id===id); if (!sh) return null;
    const copy = {...sh, id: '', x: sh.x+16, y: sh.y+16, selected:false};
    const nid = get().addShape(copy as any);
    return nid;
  },

  setSelected: (id)=>set(({scene})=>({
    selectedId: id,
    scene: {...scene, shapes: scene.shapes.map(sh=>({...sh, selected: id? sh.id===id : false}))}
  })),
  selectedId: null,

  clear: ()=>set({ scene: { shapes: [], nextId: 1, grid: { show:true, snap:true, size:16, type:'dots' } } })
}));
