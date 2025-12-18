import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlignLeft, AlignRight, AlignCenterHorizontal, 
  AlignStartVertical, AlignEndVertical, AlignCenterVertical,
  LayoutGrid, Sparkles, Maximize2, ArrowRightLeft, ArrowUpDown,
  GitBranch, Magnet, Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  useLayoutManager, 
  LayoutNode, 
  LayoutEdge, 
  AlignmentGuide,
  DEFAULT_FORCE_CONFIG,
  DEFAULT_SNAP_CONFIG,
} from './LayoutEngine';

interface LayoutToolbarProps {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
  selectedNodeIds: string[];
  onNodesChange: (nodes: LayoutNode[]) => void;
  onEdgesChange?: (edges: LayoutEdge[]) => void;
  onGuidesChange?: (guides: AlignmentGuide[]) => void;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  nodes,
  edges,
  selectedNodeIds,
  onNodesChange,
  onEdgesChange,
  onGuidesChange,
}) => {
  const {
    applyForceLayout,
    resolveOverlaps,
    distributeHorizontally,
    distributeVertically,
    alignNodes,
    findAutoConnections,
  } = useLayoutManager();

  const [isApplyingLayout, setIsApplyingLayout] = useState(false);
  const [showAutoConnect, setShowAutoConnect] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [forceStrength, setForceStrength] = useState(50);

  const selectedNodes = nodes.filter(n => selectedNodeIds.includes(n.id));
  const hasSelection = selectedNodes.length > 0;
  const hasMultipleSelection = selectedNodes.length > 1;

  // Apply force-directed layout
  const handleApplyForceLayout = useCallback(async () => {
    setIsApplyingLayout(true);
    try {
      const { nodes: newNodes, potentialEdges } = await applyForceLayout(
        nodes,
        edges,
        true
      );
      onNodesChange(newNodes);
      
      if (showAutoConnect && onEdgesChange) {
        onEdgesChange([...edges, ...potentialEdges]);
      }
    } finally {
      setIsApplyingLayout(false);
    }
  }, [nodes, edges, applyForceLayout, onNodesChange, showAutoConnect, onEdgesChange]);

  // Resolve overlaps
  const handleResolveOverlaps = useCallback(() => {
    const nodesToProcess = hasSelection ? selectedNodes : nodes;
    const resolvedNodes = resolveOverlaps(nodesToProcess);
    
    const newNodes = nodes.map(n => {
      const resolved = resolvedNodes.find(rn => rn.id === n.id);
      return resolved || n;
    });
    
    onNodesChange(newNodes);
  }, [nodes, selectedNodes, hasSelection, resolveOverlaps, onNodesChange]);

  // Distribute horizontally
  const handleDistributeHorizontally = useCallback(() => {
    if (!hasMultipleSelection) return;
    const distributed = distributeHorizontally(selectedNodes);
    
    const newNodes = nodes.map(n => {
      const dist = distributed.find(dn => dn.id === n.id);
      return dist || n;
    });
    
    onNodesChange(newNodes);
  }, [nodes, selectedNodes, hasMultipleSelection, distributeHorizontally, onNodesChange]);

  // Distribute vertically
  const handleDistributeVertically = useCallback(() => {
    if (!hasMultipleSelection) return;
    const distributed = distributeVertically(selectedNodes);
    
    const newNodes = nodes.map(n => {
      const dist = distributed.find(dn => dn.id === n.id);
      return dist || n;
    });
    
    onNodesChange(newNodes);
  }, [nodes, selectedNodes, hasMultipleSelection, distributeVertically, onNodesChange]);

  // Align nodes
  const handleAlign = useCallback((alignment: 'left' | 'right' | 'top' | 'bottom' | 'center-h' | 'center-v') => {
    if (!hasMultipleSelection) return;
    const aligned = alignNodes(selectedNodes, alignment);
    
    const newNodes = nodes.map(n => {
      const al = aligned.find(an => an.id === n.id);
      return al || n;
    });
    
    onNodesChange(newNodes);
  }, [nodes, selectedNodes, hasMultipleSelection, alignNodes, onNodesChange]);

  // Find and show auto-connections
  const handleFindAutoConnections = useCallback(() => {
    const potentialEdges = findAutoConnections(nodes, edges);
    if (onEdgesChange && potentialEdges.length > 0) {
      onEdgesChange([...edges, ...potentialEdges]);
    }
  }, [nodes, edges, findAutoConnections, onEdgesChange]);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 p-2 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg"
        dir="rtl"
      >
        {/* Force Layout */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              disabled={isApplyingLayout || nodes.length < 2}
              className="gap-2"
            >
              {isApplyingLayout ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <LayoutGrid className="h-4 w-4" />
              )}
              <span className="text-xs">توزيع تلقائي</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" dir="rtl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">قوة التوزيع</span>
                <span className="text-xs text-muted-foreground">{forceStrength}%</span>
              </div>
              <Slider
                value={[forceStrength]}
                onValueChange={([v]) => setForceStrength(v)}
                min={10}
                max={100}
                step={10}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">الربط التلقائي</span>
                <Switch
                  checked={showAutoConnect}
                  onCheckedChange={setShowAutoConnect}
                />
              </div>
              <Button
                size="sm"
                onClick={handleApplyForceLayout}
                disabled={isApplyingLayout}
                className="w-full"
              >
                تطبيق التوزيع
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border" />

        {/* Alignment buttons */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('right')}
                className="h-8 w-8 p-0"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>محاذاة لليمين</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('center-h')}
                className="h-8 w-8 p-0"
              >
                <AlignCenterHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>محاذاة للوسط أفقياً</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('left')}
                className="h-8 w-8 p-0"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>محاذاة لليسار</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border" />

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('top')}
                className="h-8 w-8 p-0"
              >
                <AlignStartVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>محاذاة للأعلى</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('center-v')}
                className="h-8 w-8 p-0"
              >
                <AlignCenterVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>محاذاة للوسط عمودياً</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={!hasMultipleSelection}
                onClick={() => handleAlign('bottom')}
                className="h-8 w-8 p-0"
              >
                <AlignEndVertical className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>محاذاة للأسفل</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Distribution */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={selectedNodes.length < 3}
                onClick={handleDistributeHorizontally}
                className="h-8 w-8 p-0"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>توزيع أفقي متساوي</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                disabled={selectedNodes.length < 3}
                onClick={handleDistributeVertically}
                className="h-8 w-8 p-0"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>توزيع عمودي متساوي</TooltipContent>
          </Tooltip>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Overlap & Snap */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleResolveOverlaps}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>منع التداخل</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant={snapEnabled ? 'secondary' : 'ghost'}
              onClick={() => setSnapEnabled(!snapEnabled)}
              className="h-8 w-8 p-0"
            >
              <Magnet className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>الانجذاب للشبكة</TooltipContent>
        </Tooltip>

        <div className="w-px h-6 bg-border" />

        {/* Auto Connect */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleFindAutoConnections}
              disabled={nodes.length < 2}
              className="gap-2"
            >
              <GitBranch className="h-4 w-4" />
              <span className="text-xs">ربط تلقائي</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>اكتشاف وربط العناصر القريبة</TooltipContent>
        </Tooltip>
      </motion.div>
    </TooltipProvider>
  );
};

// ============= Alignment Guides Overlay =============
interface AlignmentGuidesOverlayProps {
  guides: AlignmentGuide[];
  canvasWidth: number;
  canvasHeight: number;
}

export const AlignmentGuidesOverlay: React.FC<AlignmentGuidesOverlayProps> = ({
  guides,
  canvasWidth,
  canvasHeight,
}) => {
  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50"
      width={canvasWidth}
      height={canvasHeight}
    >
      <AnimatePresence>
        {guides.map((guide, index) => (
          <motion.line
            key={`${guide.type}-${guide.position}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            x1={guide.type === 'vertical' ? guide.position : 0}
            y1={guide.type === 'horizontal' ? guide.position : 0}
            x2={guide.type === 'vertical' ? guide.position : canvasWidth}
            y2={guide.type === 'horizontal' ? guide.position : canvasHeight}
            stroke="hsl(var(--primary))"
            strokeWidth={1}
            strokeDasharray="4,4"
            opacity={0.7}
          />
        ))}
      </AnimatePresence>
    </svg>
  );
};

// ============= Grid Overlay =============
interface GridOverlayProps {
  gridSize: number;
  canvasWidth: number;
  canvasHeight: number;
  visible?: boolean;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
  gridSize,
  canvasWidth,
  canvasHeight,
  visible = true,
}) => {
  if (!visible) return null;

  const verticalLines = Math.ceil(canvasWidth / gridSize);
  const horizontalLines = Math.ceil(canvasHeight / gridSize);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ opacity: 0.1 }}
    >
      {/* Vertical lines */}
      {Array.from({ length: verticalLines + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * gridSize}
          y1={0}
          x2={i * gridSize}
          y2={canvasHeight}
          stroke="hsl(var(--foreground))"
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
        />
      ))}
      
      {/* Horizontal lines */}
      {Array.from({ length: horizontalLines + 1 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * gridSize}
          x2={canvasWidth}
          y2={i * gridSize}
          stroke="hsl(var(--foreground))"
          strokeWidth={i % 5 === 0 ? 1 : 0.5}
        />
      ))}
    </svg>
  );
};

export default LayoutToolbar;
