# API Functions Documentation

## Overview
This document outlines all API functions available in the SoaBra Brain Canvas system, including Supabase Edge Functions and client-side APIs.

## Supabase Edge Functions

### 1. analyze-links
**Purpose**: AI-powered analysis of canvas connections and relationships

**Endpoint**: `POST /functions/v1/analyze-links`

**Input**:
```typescript
{
  boardId: string;
  snapshot: {
    nodes: CanvasNode[];
    links: Connection[];
    metadata: Record<string, any>;
  };
  analysisType?: 'relationships' | 'patterns' | 'suggestions' | 'all';
}
```

**Output**:
```typescript
{
  analysis: {
    relationships: Array<{
      fromId: string;
      toId: string;
      type: 'dependency' | 'association' | 'hierarchy' | 'flow';
      strength: number; // 0-1
      bidirectional: boolean;
    }>;
    patterns: Array<{
      type: 'cluster' | 'chain' | 'hub' | 'cycle';
      nodeIds: string[];
      confidence: number;
    }>;
    suggestions: Array<{
      action: 'connect' | 'group' | 'reorder' | 'split';
      fromId?: string;
      toId?: string;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  metadata: {
    processingTime: number;
    analysisDate: string;
    confidence: number;
  };
}
```

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('analyze-links', {
  body: {
    boardId: 'board-123',
    snapshot: currentSnapshot,
    analysisType: 'all'
  }
});
```

### 2. wf01-map
**Purpose**: Smart project generation from canvas elements

**Endpoint**: `POST /functions/v1/wf01-map`

**Input**:
```typescript
{
  boardId: string;
  snapshot: CanvasSnapshot;
  mappingRules?: {
    sticky: 'task' | 'note' | 'milestone';
    frame: 'phase' | 'group' | 'workstream';
    connector: 'dependency' | 'sequence' | 'association';
  };
  projectSettings?: {
    prioritySystem: 'soabra' | 'agile' | 'custom';
    statusMapping: Record<string, string>;
    timelineGeneration: boolean;
  };
}
```

**Output**:
```typescript
{
  mapping: {
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      priority: 'critical' | 'high' | 'medium' | 'low';
      status: 'todo' | 'in_progress' | 'review' | 'done';
      estimatedHours?: number;
      dependencies: string[];
      phase?: string;
      originalElementId: string;
    }>;
    phases: Array<{
      id: string;
      name: string;
      description?: string;
      startDate?: string;
      endDate?: string;
      tasks: string[];
      originalElementId: string;
    }>;
    dependencies: Array<{
      fromTask: string;
      toTask: string;
      type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
      originalLinkId: string;
    }>;
  };
  statistics: {
    totalElements: number;
    mappedElements: number;
    skippedElements: number;
    mappingAccuracy: number; // percentage
    warnings: string[];
  };
  preview: {
    ganttData: any[]; // For preview visualization
    criticalPath: string[];
    estimatedDuration: number; // days
  };
}
```

**Usage**:
```typescript
const { data, error } = await supabase.functions.invoke('wf01-map', {
  body: {
    boardId: 'board-123',
    snapshot: canvasSnapshot,
    projectSettings: {
      prioritySystem: 'soabra',
      timelineGeneration: true
    }
  }
});
```

## Client-Side APIs

### 1. Canvas API
**Purpose**: Core canvas operations and management

```typescript
interface CanvasAPI {
  // Node operations
  addNode(node: Partial<CanvasNode>): string;
  updateNode(id: string, patch: Partial<CanvasNode>): void;
  removeNode(id: string): void;
  getNode(id: string): CanvasNode | undefined;
  getNodes(): CanvasNode[];
  
  // Selection operations
  selectNode(id: string, multiSelect?: boolean): void;
  clearSelection(): void;
  getSelectedNodes(): CanvasNode[];
  
  // Camera operations
  zoomToFit(): void;
  zoomToNodes(nodeIds: string[]): void;
  panTo(position: Point): void;
  
  // Snapshot operations
  toSnapshot(): CanvasSnapshot;
  fromSnapshot(snapshot: CanvasSnapshot): void;
  
  // Performance operations
  enableVirtualization(enabled: boolean): void;
  getBoundingBox(nodeIds?: string[]): Bounds;
}
```

### 2. Connection API
**Purpose**: Link and connection management

```typescript
interface ConnectionAPI {
  // Connection operations
  createConnection(from: string, to: string, options?: ConnectionOptions): string;
  updateConnection(id: string, options: Partial<ConnectionOptions>): void;
  removeConnection(id: string): void;
  getConnection(id: string): Connection | undefined;
  
  // Anchor operations
  getAnchorPoints(nodeId: string): AnchorPoint[];
  highlightAnchors(nodeId: string, highlight: boolean): void;
  
  // Path operations
  calculatePath(from: AnchorPoint, to: AnchorPoint, type: PathType): Point[];
  optimizePaths(connectionIds?: string[]): void;
}
```

### 3. Telemetry API
**Purpose**: Performance monitoring and analytics

```typescript
interface TelemetryAPI {
  // Event logging
  logEvent(eventType: string, metadata: Record<string, any>): void;
  logPerformanceMetrics(boardId?: string): void;
  logCanvasOperation(operation: string, metadata: Record<string, any>): void;
  logWF01Event(action: string, metadata: Record<string, any>): void;
  logLinkEvent(action: string, metadata: Record<string, any>): void;
  
  // Metrics
  getCurrentMetrics(): PerformanceMetrics;
  startPeriodicReporting(interval?: number): void;
  stopPeriodicReporting(): void;
  
  // Session management
  getSessionId(): string;
  resetSession(): void;
}
```

### 4. Authentication API
**Purpose**: User authentication and authorization

```typescript
interface AuthAPI {
  // Authentication
  signIn(email: string, password: string): Promise<{ error: any }>;
  signUp(email: string, password: string): Promise<{ error: any }>;
  signOut(): Promise<void>;
  
  // User info
  getCurrentUser(): User | null;
  getSession(): Session | null;
  
  // Permissions
  getBoardRole(boardId: string): Promise<BoardRole | null>;
  hasPermission(boardId: string, minRole: BoardRole): Promise<boolean>;
  
  // Board management
  createBoard(title: string, description?: string): Promise<string>;
  getBoardPermissions(boardId: string): Promise<BoardPermission[]>;
  grantPermission(boardId: string, userId: string, role: BoardRole): Promise<void>;
  revokePermission(boardId: string, userId: string): Promise<void>;
}
```

## Database Functions

### 1. get_user_board_role
**Purpose**: Get user's role for a specific board

**SQL**:
```sql
SELECT public.get_user_board_role(board_id UUID, user_id UUID) RETURNS board_role;
```

### 2. user_has_board_role
**Purpose**: Check if user has minimum required role

**SQL**:
```sql
SELECT public.user_has_board_role(
  board_id UUID, 
  user_id UUID, 
  min_role board_role
) RETURNS boolean;
```

### 3. get_widget_data
**Purpose**: Get data for dashboard widgets

**SQL**:
```sql
SELECT public.get_widget_data(
  widget_type TEXT,
  user_id UUID DEFAULT auth.uid(),
  filters JSONB DEFAULT '{}',
  limit_count INTEGER DEFAULT 10
) RETURNS TABLE(data JSONB);
```

## Error Handling

### Standard Error Response
```typescript
{
  error: {
    message: string;
    code: string;
    details?: any;
    timestamp: string;
  };
}
```

### Common Error Codes
- `AUTH_REQUIRED`: Authentication needed
- `PERMISSION_DENIED`: Insufficient permissions
- `VALIDATION_ERROR`: Input validation failed
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limits

### Edge Functions
- **analyze-links**: 60 requests/minute per user
- **wf01-map**: 30 requests/minute per user

### Database Operations
- **Reads**: 1000 requests/minute per user
- **Writes**: 100 requests/minute per user
- **Real-time subscriptions**: 50 active connections per user

## Authentication

All API calls require authentication via Supabase JWT tokens:

```typescript
// Automatic with Supabase client
const { data, error } = await supabase.functions.invoke('function-name', {
  headers: {
    Authorization: `Bearer ${session.access_token}`
  },
  body: requestData
});
```

## Examples

### Complete Canvas Operation Flow
```typescript
// 1. Authenticate
await auth.signIn('user@example.com', 'password');

// 2. Create board
const boardId = await auth.createBoard('My Project Board');

// 3. Add canvas elements
const nodeId = canvas.addNode({
  type: 'sticky',
  position: { x: 100, y: 100 },
  size: { width: 200, height: 100 },
  content: 'Task 1'
});

// 4. Create connections
const linkId = connections.createConnection(nodeId, otherNodeId);

// 5. Generate project
const { data } = await supabase.functions.invoke('wf01-map', {
  body: {
    boardId,
    snapshot: canvas.toSnapshot()
  }
});

// 6. Log telemetry
telemetry.logWF01Event('project_generated', {
  elementCount: data.mapping.tasks.length,
  accuracy: data.statistics.mappingAccuracy
});
```

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Next Review**: March 2025