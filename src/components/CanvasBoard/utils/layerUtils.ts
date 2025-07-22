/**
 * @fileoverview Layer transformation utilities for CanvasBoard
 * @author AI Assistant
 * @version 1.0.0
 */

import { Layer } from '@/types/canvas';

export interface EnhancedLayer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  elements: string[];
  type: 'layer' | 'folder';
  parentId?: string;
  children?: string[];
  isOpen?: boolean;
  color?: string;
  depth?: number;
}

export const transformLayersForEnhancedPanel = (layers: Layer[]): EnhancedLayer[] => {
  return layers.map(layer => ({
    ...layer,
    type: 'layer' as const,
    parentId: layer.parentId || undefined,
    children: layer.children?.map(child => child.id) || [],
    isOpen: layer.isOpen || true,
    color: '#3b82f6',
    depth: 0
  }));
};