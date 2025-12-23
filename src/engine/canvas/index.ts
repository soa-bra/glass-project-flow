/**
 * Canvas Engine - محرك الكانفاس الموحد
 * @module engine/canvas
 */

// Kernel
export * from './kernel/canvasKernel';

// Rendering
export * from './rendering/gridRenderer';

// Math
export * from './math/snapEngine';

// Spatial
export * from './spatial/spatialIndex';

// Interaction
export * from './interaction/selectionCoordinator';
export * from './interaction/interactionStateMachine';

// Routing
export * from './routing/connectorRouter';

// History
export * from './history/historyManager';

// Graph (specific exports to avoid EdgeEndpoint conflict with connectorRouter)
export { 
  type NodeType,
  type NodeAnchor,
  type GraphNode,
  type EdgeType,
  type EdgeEndStyle,
  type EdgeControlPoint,
  type GraphEdge,
  type CanvasGraph,
  type GraphQuery
} from './graph/canvasGraph';

// Collaboration
export { CollaborationEngine, collaborationEngine } from './collaboration/collaborationEngine';
export type { CollaboratorPresence, CollaborationEvent, CollaborationEventType } from './collaboration/collaborationEngine';
export * from './transform/operationalTransform';

// IO (Import/Export)
export * from './io/exportEngine';
export * from './io/importEngine';

// Events
export * from './events';

// Voice
export * from './voice/webrtcVoice';
