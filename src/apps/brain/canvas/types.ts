export type SmartElementType = string;

export interface ViewportInfo {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

export function getViewportCenter(viewport?: ViewportInfo): { x: number; y: number } {
  if (!viewport) {
    return { x: 400, y: 300 }; // Default center
  }
  
  return {
    x: viewport.x + (viewport.width / 2) / viewport.zoom,
    y: viewport.y + (viewport.height / 2) / viewport.zoom
  };
}

export interface CanvasTools {
  select: 'select';
  hand: 'hand';
  rectangle: 'rectangle';
  ellipse: 'ellipse';
  line: 'line';
  arrow: 'arrow';
  text: 'text';
  sticky: 'sticky';
  smart: 'smart';
  connector: 'connector';
}