// src/features/planning/components/topbar/ShareButton.tsx
'use client';
import React from 'react';
import { useCollabStore } from '../../store/collab.store';
import { Button } from '@/components/Button';

export default function ShareButton() {
  const { inviteUrl, role, makeInvite } = useCollabStore();
  return (
    <Button onClick={makeInvite} title="مشاركة/صلاحيات">
      مشاركة {inviteUrl ? '✅' : ''} <small style={{opacity:.7}}>({role})</small>
    </Button>
  );
}
