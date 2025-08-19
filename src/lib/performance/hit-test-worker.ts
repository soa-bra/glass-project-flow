// Web Worker for Hit Testing
// This file will be loaded as a worker

interface HitTestMessage {
  type: 'hitTest';
  point: { x: number; y: number };
  nodes: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  }>;
}

interface HitTestResult {
  type: 'hitTestResult';
  nodeIds: string[];
  point: { x: number; y: number };
}

// Worker message handler
self.onmessage = (event: MessageEvent<HitTestMessage>) => {
  const { type, point, nodes } = event.data;

  if (type === 'hitTest') {
    const hitNodes: string[] = [];

    // Perform hit testing calculations
    for (const node of nodes) {
      if (isPointInNode(point, node)) {
        hitNodes.push(node.id);
      }
    }

    // Sort by z-index (assuming last in array is on top)
    hitNodes.reverse();

    const result: HitTestResult = {
      type: 'hitTestResult',
      nodeIds: hitNodes,
      point
    };

    self.postMessage(result);
  }
};

function isPointInNode(
  point: { x: number; y: number },
  node: { id: string; x: number; y: number; width: number; height: number; rotation?: number }
): boolean {
  let { x, y } = point;

  // Handle rotation if present
  if (node.rotation) {
    const centerX = node.x + node.width / 2;
    const centerY = node.y + node.height / 2;
    
    // Translate to center
    const translatedX = x - centerX;
    const translatedY = y - centerY;
    
    // Rotate point back by negative rotation
    const cos = Math.cos(-node.rotation);
    const sin = Math.sin(-node.rotation);
    
    x = translatedX * cos - translatedY * sin + centerX;
    y = translatedX * sin + translatedY * cos + centerY;
  }

  // Simple AABB test
  return x >= node.x && 
         x <= node.x + node.width && 
         y >= node.y && 
         y <= node.y + node.height;
}