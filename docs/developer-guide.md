# Developer Guide - سـوبــرا Brain Canvas

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Environment](#development-environment)
4. [Core Concepts](#core-concepts)
5. [API Integration](#api-integration)
6. [Testing Strategy](#testing-strategy)
7. [Performance Guidelines](#performance-guidelines)
8. [Security Considerations](#security-considerations)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git
- Supabase account

### Quick Setup
```bash
# Clone repository
git clone <repository-url>
cd soabra-brain-canvas

# Install dependencies
pnpm install

# Environment setup
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Environment Variables
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# OpenAI (for AI features)
OPENAI_API_KEY=your_openai_key

# Development
NODE_ENV=development
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn)
│   ├── canvas/         # Canvas-specific components
│   ├── wf01/          # WF-01 Smart Generator components
│   └── demo/          # Demo and example components
├── hooks/              # Custom React hooks
├── lib/                # Core libraries and utilities
│   ├── auth/          # Authentication logic
│   ├── canvas/        # Canvas engine and types
│   ├── performance/   # Performance optimization
│   └── telemetry/     # Analytics and monitoring
├── pages/             # Route components
├── integrations/      # External service integrations
│   └── supabase/     # Supabase client and types
├── utils/            # Utility functions
└── types/            # TypeScript type definitions

supabase/
├── functions/        # Edge Functions
├── migrations/       # Database migrations
└── config.toml      # Supabase configuration

docs/                # Documentation
tests/               # Test files
e2e/                # End-to-end tests
```

## Development Environment

### Code Style
We use ESLint and Prettier for code formatting:

```bash
# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check
```

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Run tests and ensure they pass
4. Create pull request
5. Code review and merge

### Commit Convention
```bash
# Format: type(scope): description

feat(canvas): add new node selection system
fix(auth): resolve login redirect issue
docs(api): update function documentation
test(wf01): add unit tests for project generator
perf(render): optimize canvas rendering pipeline
```

## Core Concepts

### 1. Canvas System
The canvas is built on a virtual coordinate system with infinite scroll and zoom capabilities.

```typescript
// Core types
interface CanvasNode {
  id: string;
  type: NodeType;
  transform: Transform;
  size: Size;
  style: NodeStyle;
  // ... other properties
}

// Usage
const canvas = new CanvasEngine(container);
canvas.addNode({
  type: 'sticky',
  transform: { position: { x: 100, y: 100 }, rotation: 0, scale: { x: 1, y: 1 } },
  size: { width: 200, height: 100 }
});
```

### 2. Performance Architecture
The system uses multiple optimization strategies:

- **Virtualization**: Only render visible elements
- **Batching**: Group operations for efficiency
- **Web Workers**: Offload heavy computations
- **Texture Atlasing**: Optimize graphics rendering

```typescript
// Enable performance optimizations
const performanceManager = new PerformanceManager({
  enableVirtualization: true,
  batchOperations: true,
  useWebWorkers: true
});
```

### 3. Real-time Collaboration
Built on Supabase real-time subscriptions:

```typescript
// Subscribe to board changes
const subscription = supabase
  .channel(`board:${boardId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'board_objects'
  }, handleChange)
  .subscribe();
```

### 4. Authentication & Authorization
Role-based access control with three levels:

```typescript
type BoardRole = 'host' | 'editor' | 'viewer';

// Check permissions
const hasPermission = await auth.hasPermission(boardId, 'editor');
if (hasPermission) {
  // Perform editor-level operations
}
```

## API Integration

### Supabase Edge Functions
```typescript
// Call edge function
const { data, error } = await supabase.functions.invoke('analyze-links', {
  body: {
    boardId: 'board-123',
    snapshot: currentSnapshot
  }
});

if (error) {
  console.error('Analysis failed:', error);
  return;
}

// Process results
const { relationships, suggestions } = data.analysis;
```

### Canvas Operations
```typescript
// Using the canvas API
import { useCanvas } from '@/hooks/useCanvas';

function CanvasComponent() {
  const { canvas, addNode, updateNode, selectNode } = useCanvas();

  const handleAddSticky = () => {
    const nodeId = addNode({
      type: 'sticky',
      content: 'New Note',
      position: { x: 100, y: 100 }
    });
    selectNode(nodeId);
  };

  return <canvas ref={canvas.containerRef} />;
}
```

### Telemetry Integration
```typescript
// Track user interactions
import { useTelemetry } from '@/hooks/useTelemetry';

function MyComponent() {
  const { logCanvasOperation, logCustomEvent } = useTelemetry({
    boardId: 'board-123'
  });

  const handleNodeMove = (nodeId: string, position: Point) => {
    // Update node position
    updateNode(nodeId, { position });
    
    // Log telemetry
    logCanvasOperation('node_move', {
      nodeId,
      position,
      timestamp: Date.now()
    });
  };
}
```

## Testing Strategy

### Unit Tests
Using Vitest for fast unit testing:

```typescript
// Example test
import { describe, it, expect } from 'vitest';
import { CanvasEngine } from '@/lib/canvas/engine';

describe('CanvasEngine', () => {
  it('should add nodes correctly', () => {
    const engine = new CanvasEngine();
    const nodeId = engine.addNode({
      type: 'sticky',
      position: { x: 0, y: 0 }
    });
    
    expect(engine.getNode(nodeId)).toBeDefined();
  });
});
```

### Integration Tests
```typescript
// Test Supabase integration
describe('Board Operations', () => {
  it('should create board with proper permissions', async () => {
    const { data, error } = await supabase
      .from('boards')
      .insert({ title: 'Test Board' })
      .select();
      
    expect(error).toBeNull();
    expect(data[0].title).toBe('Test Board');
  });
});
```

### E2E Tests
Using Playwright for end-to-end testing:

```typescript
// e2e/canvas-operations.spec.ts
import { test, expect } from '@playwright/test';

test('should create and connect nodes', async ({ page }) => {
  await page.goto('/');
  
  // Create first node
  await page.click('[data-testid=add-sticky]');
  await page.fill('[data-testid=sticky-content]', 'Node 1');
  
  // Create second node
  await page.click('[data-testid=add-sticky]');
  await page.fill('[data-testid=sticky-content]', 'Node 2');
  
  // Connect nodes
  await page.click('[data-testid=connect-tool]');
  await page.click('[data-testid=node-1]');
  await page.click('[data-testid=node-2]');
  
  // Verify connection
  await expect(page.locator('[data-testid=connection]')).toBeVisible();
});
```

## Performance Guidelines

### Canvas Optimization
1. **Virtualization**: Only render visible nodes
2. **Batching**: Group multiple operations
3. **Throttling**: Limit high-frequency events
4. **Memory Management**: Clean up unused resources

```typescript
// Good: Batch operations
const batchProcessor = new BatchProcessor((operations) => {
  operations.forEach(op => applyOperation(op));
});

// Bad: Individual operations
nodes.forEach(node => updateNode(node.id, node.changes));
```

### Rendering Performance
```typescript
// Use RAF for smooth animations
const animateNode = (nodeId: string, targetPos: Point) => {
  const animate = () => {
    const currentPos = getNodePosition(nodeId);
    const newPos = lerp(currentPos, targetPos, 0.1);
    
    updateNodePosition(nodeId, newPos);
    
    if (distance(newPos, targetPos) > 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};
```

### Memory Management
```typescript
// Use object pools for frequently created objects
const nodePool = new ObjectPool(() => createNode(), node => resetNode(node));

// Acquire from pool instead of creating new
const node = nodePool.acquire();
// ... use node
nodePool.release(node);
```

## Security Considerations

### Authentication
- Always validate JWT tokens
- Implement proper session management
- Use secure redirect URLs

### Authorization
```typescript
// Always check permissions before operations
const checkPermission = async (boardId: string, action: string) => {
  const minRole = getRequiredRole(action);
  return await auth.hasPermission(boardId, minRole);
};
```

### Data Validation
```typescript
// Validate all inputs
import { z } from 'zod';

const NodeSchema = z.object({
  type: z.enum(['sticky', 'frame', 'text']),
  position: z.object({
    x: z.number().min(-10000).max(10000),
    y: z.number().min(-10000).max(10000)
  }),
  content: z.string().max(1000).optional()
});

// Use schema validation
const validateNode = (data: unknown) => {
  return NodeSchema.parse(data);
};
```

### RLS Policies
Ensure Row-Level Security is properly configured:

```sql
-- Example RLS policy
CREATE POLICY "Users can only access their boards"
ON boards FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());
```

## Deployment

### Production Build
```bash
# Create production build
pnpm build

# Preview production build
pnpm preview

# Deploy to Supabase (if using Supabase hosting)
supabase deploy
```

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Edge Functions Deployment
```bash
# Deploy individual function
supabase functions deploy analyze-links

# Deploy all functions
supabase functions deploy
```

## Contributing

### Development Process
1. **Issue Creation**: Create detailed issue with requirements
2. **Branch Creation**: Create feature branch with descriptive name
3. **Development**: Follow coding standards and write tests
4. **Testing**: Ensure all tests pass
5. **Documentation**: Update relevant documentation
6. **Pull Request**: Create PR with clear description
7. **Review**: Address review comments
8. **Merge**: Merge after approval

### Code Quality Standards
- **TypeScript**: Use strict type checking
- **Testing**: Maintain >80% code coverage
- **Performance**: Profile critical paths
- **Accessibility**: Follow WCAG guidelines
- **Documentation**: Document public APIs

### Release Process
```bash
# Version bump
pnpm version patch|minor|major

# Build packages
pnpm release

# Publish to registry
pnpm publish --access public
```

## Troubleshooting

### Common Issues

**Canvas Performance Issues**:\
```typescript
// Enable performance monitoring
const telemetry = useTelemetry();
telemetry.startPeriodicReporting();

// Check metrics
const metrics = telemetry.getCurrentMetrics();
console.log('FPS:', metrics.fps);
```

**Authentication Problems**:\
```typescript
// Debug auth state
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

**RLS Policy Errors**:\
```sql
-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test policy
SELECT public.user_has_board_role('board-id', 'user-id', 'editor');
```

### Performance Monitoring
```typescript
// Monitor performance in production
if (process.env.NODE_ENV === 'production') {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 100) {
        console.warn('Slow operation:', entry.name, entry.duration);
      }
    });
  });
  observer.observe({ entryTypes: ['measure'] });
}
```

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)

---

**Version**: 1.0  
**Last Updated**: January 2025  
**Maintainers**: SoaBra Development Team
