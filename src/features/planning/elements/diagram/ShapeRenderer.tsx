/**
 * @deprecated Use import from '@/features/planning/elements/shared' instead
 * This file is kept for backward compatibility
 */
import React from 'react';
import {
  ShapeRenderer as SharedShapeRenderer,
  type ShapeRendererProps as SharedShapeRendererProps
} from '@/features/planning/elements/shared';

export type DiagramShapeRendererProps = Omit<SharedShapeRendererProps, 'context'> & {
  context?: 'diagram';
};

/**
 * Temporary adapter for legacy diagram imports with explicit diagram context.
 */
export const ShapeRenderer: React.FC<DiagramShapeRendererProps> = (props) => (
  <SharedShapeRenderer {...props} context="diagram" />
);
