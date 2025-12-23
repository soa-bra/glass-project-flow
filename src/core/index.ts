/**
 * Core Module - Re-exports from Engine
 * @deprecated استخدم @/engine/canvas بدلاً من ذلك
 * 
 * هذا الملف للتوافق العكسي فقط
 */

// Canvas Kernel
export * from '@/engine/canvas/kernel/canvasKernel';

// Graph
export * from '@/engine/canvas/graph/canvasGraph';

// Rendering
export * from '@/engine/canvas/rendering/gridRenderer';

// Math
export * from '@/engine/canvas/math/snapEngine';

// Spatial
export * from '@/engine/canvas/spatial/spatialIndex';

// Interaction
export * from '@/engine/canvas/interaction/selectionCoordinator';
export * from '@/engine/canvas/interaction/interactionStateMachine';

// Routing
export * from '@/engine/canvas/routing/connectorRouter';

// History
export * from '@/engine/canvas/history/historyManager';

// Transform
export * from '@/engine/canvas/transform/operationalTransform';

// Collaboration
export * from '@/engine/canvas/collaboration/collaborationEngine';

// IO
export * from '@/engine/canvas/io/exportEngine';
export * from '@/engine/canvas/io/importEngine';

// Events
export * from '@/engine/canvas/events/eventPipeline';

// Voice
export * from '@/engine/canvas/voice/webrtcVoice';
