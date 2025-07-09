import React from 'react';
import { CleanCanvasPanelLayout } from './CleanCanvasPanelLayout';
import { CanvasPanelLayoutProps } from './CanvasPanelTypes';


export const CanvasPanelLayout: React.FC<CanvasPanelLayoutProps> = (props) => {
  return <CleanCanvasPanelLayout {...props} />;
};