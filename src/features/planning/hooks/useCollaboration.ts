// src/features/planning/hooks/useCollaboration.ts
'use client';
import { useEffect } from 'react';
import { useCollabStore } from '../store/collab.store';

export function useCollab(){
  const { init, connected } = useCollabStore();
  useEffect(()=>{ if (!connected) init(); }, [connected, init]);
}
