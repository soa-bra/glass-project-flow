// src/features/planning/store/ai.store.ts
'use client';
import { create } from 'zustand';
import type { Scene } from '../types/canvas';
import { assist } from '../services/ai/assist.api';

type AIState = {
  generating: boolean;
  generateFromScene: (scene: Scene)=>Promise<void>;
};
export const useAIStore = create<AIState>((set)=>({
  generating:false,
  generateFromScene: async (scene)=>{
    set({generating:true});
    try { await assist({ context: scene, prompt: 'generate-project' }); }
    finally { set({generating:false}); }
  }
}));
