/**
 * Snap Worker - حسابات المحاذاة في خيط منفصل
 */

interface SnapMessage {
  type: 'CALCULATE_GUIDES' | 'SNAP_POINT' | 'SNAP_BOUNDS';
  payload: {
    elements: any[];
    point?: { x: number; y: number };
    bounds?: { x: number; y: number; width: number; height: number };
    config: { gridSize: number; snapThreshold: number; gridEnabled: boolean; elementSnapEnabled: boolean };
    excludeIds?: string[];
  };
  id: string;
}

self.onmessage = (event: MessageEvent<SnapMessage>) => {
  const { type, payload, id } = event.data;

  try {
    let result: any;
    switch (type) {
      case 'CALCULATE_GUIDES': result = calculateSnapGuides(payload); break;
      case 'SNAP_POINT': result = snapPoint(payload); break;
      case 'SNAP_BOUNDS': result = snapBounds(payload); break;
    }
    postMessage({ id, type, result, success: true });
  } catch (error) {
    postMessage({ id, type, error: error instanceof Error ? error.message : 'Unknown error', success: false });
  }
};

function calculateSnapGuides(payload: any) {
  const { elements, excludeIds = [] } = payload;
  const guides: any[] = [];
  
  elements.filter((el: any) => !excludeIds.includes(el.id)).forEach((el: any) => {
    guides.push(
      { type: 'vertical', position: el.position.x, elementId: el.id },
      { type: 'vertical', position: el.position.x + el.size.width, elementId: el.id },
      { type: 'horizontal', position: el.position.y, elementId: el.id },
      { type: 'horizontal', position: el.position.y + el.size.height, elementId: el.id },
      { type: 'vertical', position: el.position.x + el.size.width / 2, elementId: el.id, isCenter: true },
      { type: 'horizontal', position: el.position.y + el.size.height / 2, elementId: el.id, isCenter: true }
    );
  });
  
  return guides;
}

function snapPoint(payload: any) {
  const { point, config } = payload;
  let snappedX = point.x, snappedY = point.y, didSnapX = false, didSnapY = false;
  
  if (config.gridEnabled) {
    const gridX = Math.round(point.x / config.gridSize) * config.gridSize;
    const gridY = Math.round(point.y / config.gridSize) * config.gridSize;
    if (Math.abs(point.x - gridX) < config.snapThreshold) { snappedX = gridX; didSnapX = true; }
    if (Math.abs(point.y - gridY) < config.snapThreshold) { snappedY = gridY; didSnapY = true; }
  }
  
  return { snappedPoint: { x: snappedX, y: snappedY }, didSnap: didSnapX || didSnapY };
}

function snapBounds(payload: any) {
  const { bounds, config, elements, excludeIds = [] } = payload;
  const guides = calculateSnapGuides({ elements, excludeIds });
  let dx = 0, dy = 0;
  
  const edges = [bounds.x, bounds.x + bounds.width, bounds.x + bounds.width / 2];
  const vGuides = guides.filter((g: any) => g.type === 'vertical').map((g: any) => g.position);
  
  for (const edge of edges) {
    for (const guide of vGuides) {
      if (Math.abs(edge - guide) < config.snapThreshold) { dx = guide - edge; break; }
    }
    if (dx !== 0) break;
  }
  
  return { snappedBounds: { ...bounds, x: bounds.x + dx, y: bounds.y + dy }, didSnap: dx !== 0 || dy !== 0 };
}

export {};
