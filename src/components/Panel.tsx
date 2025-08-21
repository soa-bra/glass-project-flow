// src/components/Panel.tsx
'use client';
import React from 'react';
export const Panel = ({title, children}:{title?:string;children:React.ReactNode})=>(
  <section aria-label={title} style={{padding:8}}>{children}</section>
);
