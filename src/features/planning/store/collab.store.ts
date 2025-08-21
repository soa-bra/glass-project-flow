// src/features/planning/store/collab.store.ts
'use client';
import { create } from 'zustand';
import { LiveEngine } from '../services/collab/live-engine';
import { useCanvasStore } from './canvas.store';

type Delta = { op:'insert'|'update'|'remove'; id:string; patch?: any };

type CollabState = {
  connected: boolean;
  role: 'Owner'|'Editor'|'Commenter'|'Viewer';
  inviteUrl: string|null;
  init: () => Promise<void>;
  broadcastDelta: (d:Delta)=>void;
  makeInvite: ()=>void;
};

export const useCollabStore = create<CollabState>((set,get)=>({
  connected:false,
  role:'Editor',
  inviteUrl:null,
  init: async ()=>{
    const engine = await LiveEngine.instance();
    engine.subscribe('delta', (payload: Delta)=>{
      const { addShape, updateShape, removeShape, scene } = useCanvasStore.getState();
      if (payload.op==='insert' && payload.id==='*') {
        // full scene sync
        useCanvasStore.setState({ scene: payload.patch });
        return;
      }
      if (payload.op==='insert' && payload.patch) {
        // remote insert (full shape)
        addShape(payload.patch);
      } else if (payload.op==='update' && payload.id){
        updateShape(payload.id, payload.patch || {});
      } else if (payload.op==='remove' && payload.id){
        removeShape(payload.id);
      }
    });
    set({ connected:true });
  },
  broadcastDelta: (d)=>{ LiveEngine._emit('delta', d); },
  makeInvite: ()=>{
    const url = `${location.origin}?board=${encodeURIComponent('default')}`;
    navigator.clipboard.writeText(url).catch(()=>{});
    set({ inviteUrl: url });
    alert('تم نسخ رابط الدعوة');
  }
}));
