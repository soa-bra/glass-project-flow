/**
 * Interaction Module - وحدة التفاعل
 * @module engine/canvas/interaction
 */

// Selection Coordinator
export {
  selectionCoordinator,
  type SelectionEventType,
  type SelectionEvent,
} from './selectionCoordinator';

// Interaction State Machine
export {
  canTransition,
  createInteractionEvent,
  type InteractionMode,
  type IdleMode,
  type PanningMode,
  type DraggingMode,
  type BoxSelectMode,
  type TypingMode,
  type DrawingMode,
  type ConnectingMode,
  type ResizingMode,
  type RotatingMode,
  type InternalDragMode,
} from './interactionStateMachine';

// Snap Engine
export {
  snapEngine,
  type SnapConfig,
  type SnapLine,
  type SnapResult,
} from './snapEngine';
