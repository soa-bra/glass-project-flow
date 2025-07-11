import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid, Move, Settings } from 'lucide-react';
import { CanvasElement } from '../types';
import { CANVAS_TOOLS } from '../constants';
interface CanvasStatusBarProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  zoom: number;
  selectedTool: string;
  showGrid: boolean;
  snapEnabled: boolean;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}
export const CanvasStatusBar: React.FC<CanvasStatusBarProps> = ({
  elements,
  selectedElementId,
  zoom,
  selectedTool,
  showGrid,
  snapEnabled,
  onToggleGrid,
  onToggleSnap
}) => {
  return;
};