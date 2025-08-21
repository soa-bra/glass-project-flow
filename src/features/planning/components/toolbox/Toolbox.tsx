// src/features/planning/components/toolbox/Toolbox.tsx
'use client';
import React from 'react';
import { useTools } from '../../store/tools.store';

const Row = ({ id, label }:{id: ReturnType<typeof useTools>['tool'], label:string})=>{
  const { tool, setTool } = useTools();
  const active = tool===id;
  return <button className={active?'active':''} onClick={()=>setTool(id)}>{label}</button>;
};

export default function Toolbox(){
  return (
    <div className="toolbox" role="region" aria-label="Toolbox">
      <Row id="select" label="تحديد (V)"/>
      <Row id="pan" label="تحريك (Space/H)"/>
      <Row id="rect" label="مستطيل (R)"/>
      <Row id="ellipse" label="بيضاوي (O)"/>
      <Row id="pen" label="قلم ذكي (P)"/>
      <Row id="text" label="نص (T)"/>
      <Row id="comment" label="تعليق (C)"/>
      <Row id="zoom" label="تكبير/تصغير (Z)"/>
    </div>
  );
}
