// src/features/planning/components/topbar/TopToolbar.tsx
'use client';
import React from 'react';
import BoardName from './BoardName';
import ShareButton from './ShareButton';
import CommentToggle from './CommentToggle';
import HistoryControls from './HistoryControls';
import FileMenu from './FileMenu';
import GridMenu from './GridMenu';
import SmartProjectGenerator from './SmartProjectGenerator';
import { Panel } from '@/components/Panel';

export default function TopToolbar() {
  return (
    <div role="toolbar" aria-label="App Bar" className="toolbar">
      <BoardName />
      <div className="sep" />
      <ShareButton />
      <CommentToggle />
      <div className="sep" />
      <HistoryControls />
      <div className="sep" />
      <FileMenu />
      <GridMenu />
      <div style={{flex:1}} />
      <SmartProjectGenerator />
    </div>
  );
}
