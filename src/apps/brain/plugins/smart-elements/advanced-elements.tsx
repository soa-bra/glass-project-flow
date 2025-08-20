import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  CheckSquare, 
  Vote, 
  Lightbulb,
  Plus,
  X,
  Lock,
  Unlock,
  Users,
  Timer,
  BarChart3,
  Wand2,
  Shuffle,
  Target,
  Zap,
  Network,
  Calendar,
  Clock,
  Grid3X3,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Circle,
  BarChart,
  Table,
  GitBranch,
  Play,
  Pause,
  Link,
  Calculator,
  Sparkles,
  Grip
} from 'lucide-react';
import { SmartElementDefinition, smartElementsRegistry } from './smart-elements-registry';
import { CanvasNode } from '../../../../lib/canvas/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { supabase } from '@/lib/supabase/client';

// Thinking Board Element
const ThinkingBoardElement: SmartElementDefinition = {
  type: 'thinking_board',
  name: 'Thinking Board',
  icon: <Brain className="w-4 h-4" />,
  category: 'basic',
  defaultState: {
    size: { width: 400, height: 300 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'لوحة التفكير',
      elements: [],
      background: 'transparent',
      tags: [],
      locked: false,
      showBounds: true,
      participants: []
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان اللوحة',
        default: 'لوحة التفكير'
      },
      background: {
        type: 'string',
        title: 'لون الخلفية',
        enum: ['transparent', 'white', 'gray', 'blue', 'green', 'yellow'],
        enumNames: ['شفاف', 'أبيض', 'رمادي', 'أزرق', 'أخضر', 'أصفر'],
        default: 'transparent'
      },
      locked: {
        type: 'boolean',
        title: 'قفل اللوحة',
        default: false
      },
      showBounds: {
        type: 'boolean',
        title: 'إظهار الحدود عند التمرير',
        default: true
      },
      maxElements: {
        type: 'number',
        title: 'الحد الأقصى للعناصر',
        default: 20,
        minimum: 1,
        maximum: 100
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [hoveredElement, setHoveredElement] = useState<number | null>(null);
    const [elements, setElements] = useState(node.metadata?.elements || []);
    
    const backgroundColors = {
      transparent: 'transparent',
      white: '#ffffff',
      gray: '#f3f4f6',
      blue: '#dbeafe',
      green: '#dcfce7',
      yellow: '#fef3c7'
    };

    const handleAddElement = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (node.metadata?.locked) return;
      
      const newElement = {
        id: Date.now(),
        type: 'idea',
        content: 'فكرة جديدة',
        position: { x: Math.random() * 300, y: Math.random() * 200 },
        color: '#3b82f6'
      };
      
      const updatedElements = [...elements, newElement];
      setElements(updatedElements);
      
      // Broadcast to realtime
      broadcastThinkingBoardUpdate(node.id, { elements: updatedElements });
    };

    return (
      <div 
        className="w-full h-full border border-border rounded-lg overflow-hidden relative group"
        style={{ backgroundColor: backgroundColors[node.metadata?.background || 'transparent'] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-card/50 border-b border-border">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
            {node.metadata?.locked && <Lock className="w-3 h-3 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-1">
            {(node.metadata?.tags || []).map((tag: string, index: number) => (
              <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                {tag}
              </Badge>
            ))}
            <Button 
              size="sm" 
              variant="ghost" 
              className="w-6 h-6 p-0"
              onClick={handleAddElement}
              disabled={node.metadata?.locked}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative h-[calc(100%-48px)] overflow-hidden">
          {elements.map((element: any, index: number) => (
            <div
              key={element.id}
              className={`absolute text-xs p-2 bg-white rounded shadow-sm border cursor-move transition-all ${
                hoveredElement === index ? 'ring-2 ring-primary' : ''
              }`}
              style={{
                left: element.position.x,
                top: element.position.y,
                borderLeftColor: element.color,
                borderLeftWidth: '3px'
              }}
              onMouseEnter={() => setHoveredElement(index)}
              onMouseLeave={() => setHoveredElement(null)}
            >
              {element.content}
            </div>
          ))}
          
          {elements.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              انقر + لإضافة عناصر
            </div>
          )}
        </div>
      </div>
    );
  },
  behaviors: {
    onDoubleClick: (node) => {
      console.log('Opening thinking board editor for:', node.id);
    }
  }
};

// Helper functions
const broadcastThinkingBoardUpdate = (nodeId: string, data: any) => {
  // Placeholder for realtime functionality
  console.log('Broadcasting thinking board update:', nodeId, data);
};

const broadcastKanbanUpdate = (nodeId: string, data: any) => {
  // Placeholder for realtime functionality
  console.log('Broadcasting kanban update:', nodeId, data);
};

const broadcastVotingUpdate = (nodeId: string, data: any) => {
  // Placeholder for realtime functionality
  console.log('Broadcasting voting update:', nodeId, data);
};

// Register advanced elements
export function registerAdvancedSmartElements() {
  try {
    smartElementsRegistry.registerSmartElement(ThinkingBoardElement);
    
    console.log('✅ Advanced smart elements registered successfully');
  } catch (error) {
    console.error('❌ Failed to register advanced smart elements:', error);
  }
}