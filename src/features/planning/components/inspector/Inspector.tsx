// src/features/planning/components/inspector/Inspector.tsx
'use client';
import React from 'react';
import SelectionPanel from './panels/SelectionPanel';
import SmartPenPanel from './panels/SmartPenPanel';
import TextPanel from './panels/TextPanel';
import ShapesPanel from './panels/ShapesPanel';
import FileUploadPanel from './panels/FileUploadPanel';
import SmartElementsPanel from './panels/SmartElementsPanel';
import FramePanel from './panels/FramePanel';

export default function Inspector(){
  return (
    <div className="inspector">
      <h3>الخصائص</h3>
      <SelectionPanel />
      <SmartPenPanel />
      <TextPanel />
      <ShapesPanel />
      <FileUploadPanel />
      <SmartElementsPanel />
      <FramePanel />
    </div>
  );
}
