# Planning connector usage audit and adapter design

## Usage inventory

- `VisualConnector` is exported from the visual diagram element barrel and rendered by `CanvasElement` for elements whose type is `visual_connector`.
- `VisualConnector` is created by visual diagram actions when adding a child branch, and visual layout utilities inspect `VisualConnectorData` to arrange diagram trees.
- `MindMapConnector` is exported from the mind map element barrel and rendered by `CanvasElement` for elements whose type is `mindmap_connector`.
- `MindMapConnector` is created by `useMindMapConnectionController` when a user completes a node-to-node drag connection, and mind map store/layout utilities inspect `MindMapConnectorData` for tree movement, collapse, and layout.
- `SmartConnectorManager` owns an in-memory collection of `RootConnectorData`, creates/deletes root connectors, renders `RootConnector`, and exposes `useSmartConnectors` for local smart connector state.
- `RootConnector` defines the smart connector data shape, creator UI, display UI, and AI suggestion flow. It is exported from the smart elements barrel and displayed by `SmartElementRenderer` through `RootConnectorDisplay` for smart elements of type `root_connector`.

## Adapter decision

The canonical canvas geometry remains in `planning_elements`: SVG connector rows keep their position, size, style, and content next to every other canvas element. The adapter in `src/features/planning/integration/connectors/planningConnectorAdapter.ts` projects those rows into a logical edge record with normalized source/target element ids, anchor metadata, connector kind, label, style, and a unified relationship type.

Logical connector persistence uses the new `smart_connectors` table because it references `planning_elements` directly, can cascade when either endpoint or the connector element is deleted, and avoids overloading the central `dependencies` table whose entity enum is scoped to central business entities rather than canvas elements.

## Unified relationship type

Canvas connectors now normalize to one of: `depends_on`, `causes`, `blocks`, `references`, `funds`, `delivers`, `belongs_to`. Legacy root connector values are mapped into the nearest unified value by the adapter.

## Delete semantics

Client deletion expands a node deletion to include dependent `mindmap_connector`, `visual_connector`, and root connector rows. Database deletion cascades logical `smart_connectors` rows through foreign keys to the connector row and both endpoint rows; an `AFTER DELETE` trigger on `smart_connectors` then removes the dependent connector `planning_elements` row when an endpoint delete caused the logical edge to disappear.
