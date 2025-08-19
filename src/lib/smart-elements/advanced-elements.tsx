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
import { CanvasNode } from '../canvas/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { supabase } from '@/integrations/supabase/client';

// ThinkingBoard Element
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

        {/* Hover Bounds */}
        {context.isHovered && node.metadata?.showBounds && (
          <div className="absolute inset-0 border-2 border-primary border-dashed pointer-events-none" />
        )}

        {/* Participants Indicator */}
        {(node.metadata?.participants?.length > 0) && (
          <div className="absolute top-2 left-2 flex -space-x-1">
            {node.metadata.participants.slice(0, 3).map((participant: any, index: number) => (
              <div 
                key={participant.id} 
                className="w-6 h-6 rounded-full border-2 border-white text-xs flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: participant.color }}
                title={participant.name}
              >
                {participant.name?.charAt(0)?.toUpperCase()}
              </div>
            ))}
            {node.metadata.participants.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-white text-xs flex items-center justify-center font-bold">
                +{node.metadata.participants.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
  behaviors: {
    onDoubleClick: (node) => {
      console.log('Opening thinking board editor for:', node.id);
    }
  }
};

// KanbanBoard Element
const KanbanBoardElement: SmartElementDefinition = {
  type: 'kanban_board',
  name: 'Kanban Board',
  icon: <CheckSquare className="w-4 h-4" />,
  category: 'project',
  defaultState: {
    size: { width: 500, height: 350 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'لوحة كانبان',
      columns: [
        { id: 'todo', title: 'قائمة المهام', cards: [], color: '#ef4444' },
        { id: 'progress', title: 'قيد التنفيذ', cards: [], color: '#f59e0b' },
        { id: 'done', title: 'مكتملة', cards: [], color: '#10b981' }
      ],
      hostLocked: false,
      autoCounter: true,
      allowDrag: true
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان اللوحة',
        default: 'لوحة كانبان'
      },
      hostLocked: {
        type: 'boolean',
        title: 'قفل النقل (المضيف فقط)',
        default: false
      },
      autoCounter: {
        type: 'boolean',
        title: 'عداد تلقائي',
        default: true
      },
      allowDrag: {
        type: 'boolean',
        title: 'السماح بالسحب والإفلات',
        default: true
      },
      maxColumns: {
        type: 'number',
        title: 'الحد الأقصى للأعمدة',
        default: 5,
        minimum: 2,
        maximum: 10
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [columns, setColumns] = useState(node.metadata?.columns || []);
    const [draggedCard, setDraggedCard] = useState<any>(null);

    const handleCardDrag = (card: any, fromColumn: string, toColumn: string) => {
      if (node.metadata?.hostLocked) return; // Host only
      
      const updatedColumns = columns.map(col => {
        if (col.id === fromColumn) {
          return { ...col, cards: col.cards.filter((c: any) => c.id !== card.id) };
        }
        if (col.id === toColumn) {
          return { ...col, cards: [...col.cards, card] };
        }
        return col;
      });
      
      setColumns(updatedColumns);
      broadcastKanbanUpdate(node.id, { columns: updatedColumns });
    };

    const addCard = (columnId: string) => {
      const newCard = {
        id: Date.now(),
        title: 'مهمة جديدة',
        description: '',
        assignee: null,
        createdAt: Date.now()
      };
      
      const updatedColumns = columns.map(col => 
        col.id === columnId 
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      );
      
      setColumns(updatedColumns);
      broadcastKanbanUpdate(node.id, { columns: updatedColumns });
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
            {node.metadata?.hostLocked && <Lock className="w-3 h-3 text-amber-500" />}
          </div>
          {node.metadata?.autoCounter && (
            <div className="text-xs text-muted-foreground">
              المجموع: {columns.reduce((sum, col) => sum + (col.cards?.length || 0), 0)}
            </div>
          )}
        </div>

        {/* Kanban Columns */}
        <div className="flex gap-2 p-3 h-[calc(100%-48px)] overflow-x-auto">
          {columns.map((column: any) => (
            <div 
              key={column.id} 
              className="flex-1 min-w-[140px] bg-muted/20 rounded border"
            >
              {/* Column Header */}
              <div 
                className="p-2 text-xs font-medium text-center border-b"
                style={{ backgroundColor: column.color + '20', borderBottomColor: column.color }}
              >
                <div>{column.title}</div>
                <div className="text-muted-foreground">({column.cards?.length || 0})</div>
              </div>
              
              {/* Cards Container */}
              <div 
                className="p-2 space-y-2 min-h-[100px] max-h-[240px] overflow-y-auto"
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedCard) {
                    handleCardDrag(draggedCard.card, draggedCard.fromColumn, column.id);
                    setDraggedCard(null);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
              >
                {(column.cards || []).map((card: any) => (
                  <div
                    key={card.id}
                    className="bg-white p-2 rounded text-xs border cursor-move hover:shadow-md transition-shadow"
                    draggable={node.metadata?.allowDrag}
                    onDragStart={() => setDraggedCard({ card, fromColumn: column.id })}
                  >
                    <div className="font-medium mb-1">{card.title}</div>
                    {card.description && (
                      <div className="text-muted-foreground text-xs">{card.description}</div>
                    )}
                  </div>
                ))}
                
                {/* Add Card Button */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full h-8 border-dashed border text-xs"
                  onClick={() => addCard(column.id)}
                >
                  <Plus className="w-3 h-3 me-1" />
                  إضافة بطاقة
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

// Voting Element
const VotingElement: SmartElementDefinition = {
  type: 'voting_poll',
  name: 'Voting',
  icon: <Vote className="w-4 h-4" />,
  category: 'social',
  defaultState: {
    size: { width: 320, height: 280 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'استطلاع رأي',
      question: 'ما هو اختيارك؟',
      options: [
        { id: 1, text: 'خيار أ', votes: [], color: '#3b82f6' },
        { id: 2, text: 'خيار ب', votes: [], color: '#10b981' }
      ],
      participants: [],
      timer: null,
      isActive: true,
      showResults: true,
      allowMultiple: false
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان الاستطلاع',
        default: 'استطلاع رأي'
      },
      question: {
        type: 'string',
        title: 'السؤال',
        default: 'ما هو اختيارك؟'
      },
      timer: {
        type: 'number',
        title: 'المؤقت (بالدقائق)',
        minimum: 1,
        maximum: 60
      },
      allowMultiple: {
        type: 'boolean',
        title: 'السماح بخيارات متعددة',
        default: false
      },
      showResults: {
        type: 'boolean',
        title: 'إظهار النتائج فوراً',
        default: true
      },
      isAnonymous: {
        type: 'boolean',
        title: 'تصويت مجهول',
        default: false
      }
    },
    required: ['title', 'question']
  },
  renderer: (node, context) => {
    const [options, setOptions] = useState(node.metadata?.options || []);
    const [timeLeft, setTimeLeft] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    const totalVotes = options.reduce((sum, option) => sum + (option.votes?.length || 0), 0);

    const handleVote = (optionId: number) => {
      if (!node.metadata?.isActive || hasVoted) return;
      
      const userId = 'current-user'; // Get from auth context
      const updatedOptions = options.map(opt => 
        opt.id === optionId 
          ? { ...opt, votes: [...(opt.votes || []), userId] }
          : opt
      );
      
      setOptions(updatedOptions);
      setHasVoted(true);
      broadcastVotingUpdate(node.id, { options: updatedOptions });
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-primary/5 border-b">
          <div className="flex items-center gap-2 mb-2">
            <Vote className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
            {timeLeft && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Timer className="w-3 h-3" />
                {timeLeft}
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{node.metadata?.question}</div>
        </div>

        {/* Options */}
        <div className="p-3 space-y-2 max-h-[160px] overflow-y-auto">
          {options.map((option: any) => {
            const percentage = totalVotes > 0 ? ((option.votes?.length || 0) / totalVotes) * 100 : 0;
            
            return (
              <div key={option.id} className="space-y-1">
                <Button
                  variant="outline"
                  className="w-full justify-between text-xs h-auto p-2"
                  onClick={() => handleVote(option.id)}
                  disabled={!node.metadata?.isActive || hasVoted}
                >
                  <span>{option.text}</span>
                  {node.metadata?.showResults && (
                    <span className="font-medium">{option.votes?.length || 0}</span>
                  )}
                </Button>
                
                {node.metadata?.showResults && (
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: option.color 
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-muted/30 border-t text-xs text-muted-foreground text-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              <span>{totalVotes} صوت</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              <span>النتائج {node.metadata?.showResults ? 'مرئية' : 'مخفية'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

// Brainstorming Element
const BrainstormingElement: SmartElementDefinition = {
  type: 'brainstorming_board',
  name: 'Brainstorming',
  icon: <Lightbulb className="w-4 h-4" />,
  category: 'basic',
  defaultState: {
    size: { width: 450, height: 320 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'عصف ذهني',
      mode: 'collaborative', // collaborative, silent, rapid, divergent
      ideas: [],
      aiSuggestions: [],
      participants: [],
      timeLimit: null,
      allowAI: true,
      categories: ['أفكار', 'حلول', 'مشاكل']
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان الجلسة',
        default: 'عصف ذهني'
      },
      mode: {
        type: 'string',
        title: 'نمط العصف الذهني',
        enum: ['collaborative', 'silent', 'rapid', 'divergent'],
        enumNames: ['تعاوني', 'صامت', 'سريع', 'تشعبي'],
        default: 'collaborative'
      },
      timeLimit: {
        type: 'number',
        title: 'الحد الزمني (بالدقائق)',
        minimum: 1,
        maximum: 120
      },
      allowAI: {
        type: 'boolean',
        title: 'السماح بمساعدة الذكاء الاصطناعي',
        default: true
      },
      maxIdeas: {
        type: 'number',
        title: 'الحد الأقصى للأفكار',
        default: 50,
        minimum: 10,
        maximum: 200
      },
      autoGenerate: {
        type: 'boolean',
        title: 'توليد أفكار تلقائي',
        default: false
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [ideas, setIdeas] = useState(node.metadata?.ideas || []);
    const [currentMode, setCurrentMode] = useState(node.metadata?.mode || 'collaborative');
    const [aiSuggestions, setAiSuggestions] = useState(node.metadata?.aiSuggestions || []);
    const [isGenerating, setIsGenerating] = useState(false);

    const modeIcons = {
      collaborative: <Users className="w-3 h-3" />,
      silent: <Target className="w-3 h-3" />,
      rapid: <Zap className="w-3 h-3" />,
      divergent: <Network className="w-3 h-3" />
    };

    const modeColors = {
      collaborative: '#3b82f6',
      silent: '#6366f1',
      rapid: '#f59e0b',
      divergent: '#10b981'
    };

    const generateAIIdeas = async () => {
      if (!node.metadata?.allowAI) return;
      
      setIsGenerating(true);
      try {
        // Simulate AI idea generation
        const newSuggestions = [
          { id: Date.now(), text: 'فكرة مولدة بالذكاء الاصطناعي', confidence: 0.8, type: 'ai' },
          { id: Date.now() + 1, text: 'اقتراح ذكي جديد', confidence: 0.7, type: 'ai' }
        ];
        
        setAiSuggestions([...aiSuggestions, ...newSuggestions]);
        broadcastBrainstormingUpdate(node.id, { 
          aiSuggestions: [...aiSuggestions, ...newSuggestions],
          mode: currentMode
        });
      } catch (error) {
        console.error('فشل في توليد الأفكار:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    const switchMode = (newMode: string) => {
      setCurrentMode(newMode);
      broadcastBrainstormingUpdate(node.id, { mode: newMode });
    };

    const addIdea = () => {
      const newIdea = {
        id: Date.now(),
        text: 'فكرة جديدة',
        author: 'مستخدم', // Get from auth
        timestamp: Date.now(),
        category: 'أفكار',
        type: 'manual'
      };
      
      const updatedIdeas = [...ideas, newIdea];
      setIdeas(updatedIdeas);
      broadcastBrainstormingUpdate(node.id, { ideas: updatedIdeas });
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="font-medium text-sm">{node.metadata?.title}</span>
            </div>
            <div className="flex items-center gap-1">
              {['collaborative', 'silent', 'rapid', 'divergent'].map((mode) => (
                <Button
                  key={mode}
                  size="sm"
                  variant={currentMode === mode ? "default" : "ghost"}
                  className="w-6 h-6 p-0"
                  onClick={() => switchMode(mode)}
                  style={currentMode === mode ? { backgroundColor: modeColors[mode] } : {}}
                >
                  {modeIcons[mode]}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            النمط: {currentMode === 'collaborative' ? 'تعاوني' : 
                   currentMode === 'silent' ? 'صامت' :
                   currentMode === 'rapid' ? 'سريع' : 'تشعبي'}
          </div>
        </div>

        {/* Ideas Area */}
        <div className="p-2 h-[calc(100%-100px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {ideas.concat(aiSuggestions).map((idea: any) => (
              <div 
                key={idea.id}
                className={`p-2 text-xs rounded border ${
                  idea.type === 'ai' 
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="font-medium mb-1">{idea.text}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{idea.author || 'AI'}</span>
                  {idea.type === 'ai' && (
                    <Badge variant="secondary" className="text-xs">
                      AI {Math.round(idea.confidence * 100)}%
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {ideas.length === 0 && aiSuggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs">
              <Lightbulb className="w-8 h-8 mb-2 opacity-50" />
              <p>لا توجد أفكار بعد</p>
              <p>ابدأ العصف الذهني!</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-2 bg-muted/30 border-t">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={addIdea}>
              <Plus className="w-3 h-3 me-1" />
              فكرة
            </Button>
            {node.metadata?.allowAI && (
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs"
                onClick={generateAIIdeas}
                disabled={isGenerating}
              >
                <Wand2 className="w-3 h-3 me-1" />
                {isGenerating ? 'جاري...' : 'AI'}
              </Button>
            )}
            <Button size="sm" variant="outline" className="w-8 h-8 p-0">
              <Shuffle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

// Timeline Element
const TimelineElement: SmartElementDefinition = {
  type: 'timeline',
  name: 'Timeline',
  icon: <Calendar className="w-4 h-4" />,
  category: 'project',
  defaultState: {
    size: { width: 600, height: 280 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'الخط الزمني',
      timeUnit: 'day', // day, week, month
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // +30 days
      events: [],
      layers: 3, // prevent overlap
      autoArrange: true,
      showGrid: true
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان الخط الزمني',
        default: 'الخط الزمني'
      },
      timeUnit: {
        type: 'string',
        title: 'وحدة الزمن',
        enum: ['day', 'week', 'month'],
        enumNames: ['يوم', 'أسبوع', 'شهر'],
        default: 'day'
      },
      layers: {
        type: 'number',
        title: 'عدد الطبقات',
        default: 3,
        minimum: 1,
        maximum: 10
      },
      autoArrange: {
        type: 'boolean',
        title: 'ترتيب تلقائي لمنع التداخل',
        default: true
      },
      showGrid: {
        type: 'boolean',
        title: 'إظهار الشبكة',
        default: true
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [currentDate, setCurrentDate] = useState(new Date(node.metadata?.startDate || new Date()));
    const [events, setEvents] = useState(node.metadata?.events || []);
    const [timeUnit, setTimeUnit] = useState(node.metadata?.timeUnit || 'day');
    
    const timeUnits = {
      day: { label: 'يوم', step: 1, format: 'dd/MM' },
      week: { label: 'أسبوع', step: 7, format: 'dd/MM' },
      month: { label: 'شهر', step: 30, format: 'MM/yyyy' }
    };

    const navigateTime = (direction: 'prev' | 'next') => {
      const step = timeUnits[timeUnit].step;
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? step : -step));
      setCurrentDate(newDate);
      
      broadcastTimelineUpdate(node.id, { 
        currentDate: newDate.toISOString(), 
        timeUnit 
      });
    };

    const addEvent = () => {
      const newEvent = {
        id: Date.now(),
        title: 'حدث جديد',
        date: currentDate.toISOString(),
        layer: Math.floor(Math.random() * (node.metadata?.layers || 3)),
        color: '#3b82f6',
        elementId: null // can link to other canvas elements
      };
      
      const updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      broadcastTimelineUpdate(node.id, { events: updatedEvents });
    };

    const changeTimeUnit = (unit: string) => {
      setTimeUnit(unit);
      broadcastTimelineUpdate(node.id, { timeUnit: unit });
    };

    // Calculate visible time range
    const getTimeMarkers = () => {
      const markers = [];
      const start = new Date(currentDate);
      const step = timeUnits[timeUnit].step;
      
      for (let i = -2; i <= 2; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i * step);
        markers.push({
          date,
          position: (i + 2) * 100, // distribute across 500px width
          label: date.toLocaleDateString('ar-SA', { 
            day: timeUnit === 'month' ? undefined : '2-digit', 
            month: timeUnit === 'day' ? '2-digit' : 'short',
            year: timeUnit === 'month' ? 'numeric' : undefined
          })
        });
      }
      return markers;
    };

    const timeMarkers = getTimeMarkers();

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Time Unit Selector */}
            <div className="flex items-center gap-1">
              {Object.entries(timeUnits).map(([unit, config]) => (
                <Button
                  key={unit}
                  size="sm"
                  variant={timeUnit === unit ? "default" : "ghost"}
                  className="text-xs h-6 px-2"
                  onClick={() => changeTimeUnit(unit)}
                >
                  {config.label}
                </Button>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="w-6 h-6 p-0" onClick={() => navigateTime('prev')}>
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="w-6 h-6 p-0" onClick={() => navigateTime('next')}>
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Timeline Area */}
        <div className="relative p-3 h-[calc(100%-48px)] overflow-hidden">
          {/* Time Axis */}
          <div className="relative h-8 mb-4 border-b border-border">
            {timeMarkers.map((marker, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{ left: `${marker.position}px`, transform: 'translateX(-50%)' }}
              >
                <div className="w-px h-4 bg-border mb-1" />
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {marker.label}
                </div>
              </div>
            ))}
          </div>

          {/* Events Layers */}
          <div className="relative" style={{ height: `${(node.metadata?.layers || 3) * 40}px` }}>
            {/* Grid Lines */}
            {node.metadata?.showGrid && (
              <div className="absolute inset-0">
                {Array.from({ length: node.metadata?.layers || 3 }).map((_, layerIndex) => (
                  <div
                    key={layerIndex}
                    className="absolute w-full border-t border-dashed border-border/50"
                    style={{ top: `${layerIndex * 40 + 20}px` }}
                  />
                ))}
              </div>
            )}
            
            {/* Events */}
            {events.map((event: any) => {
              const eventDate = new Date(event.date);
              const daysDiff = Math.floor((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
              const position = 200 + (daysDiff * (100 / timeUnits[timeUnit].step));
              
              if (position < 0 || position > 500) return null;
              
              return (
                <div
                  key={event.id}
                  className="absolute flex items-center cursor-pointer group"
                  style={{ 
                    left: `${position}px`, 
                    top: `${event.layer * 40 + 10}px`,
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="ms-2 text-xs bg-white px-2 py-1 rounded shadow-sm border group-hover:shadow-md transition-shadow whitespace-nowrap">
                    {event.title}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Event Button */}
          <div className="absolute bottom-2 right-2">
            <Button size="sm" onClick={addEvent} className="w-8 h-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Empty State */}
          {events.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs">
              <div className="text-center">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد أحداث على الخط الزمني</p>
                <p>انقر + لإضافة حدث</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

// Decisions/Objectives Matrix Element
const DecisionsMatrixElement: SmartElementDefinition = {
  type: 'decisions_matrix',
  name: 'Decisions Matrix',
  icon: <Grid3X3 className="w-4 h-4" />,
  category: 'analytics',
  defaultState: {
    size: { width: 500, height: 400 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'مصفوفة القرارات',
      type: 'decisions', // decisions, objectives
      criteria: [
        { id: 1, name: 'التكلفة', weight: 30, color: '#ef4444' },
        { id: 2, name: 'الجودة', weight: 40, color: '#3b82f6' },
        { id: 3, name: 'الوقت', weight: 30, color: '#f59e0b' }
      ],
      options: [
        { id: 1, name: 'خيار أ', scores: { 1: 7, 2: 8, 3: 6 }, total: 0 },
        { id: 2, name: 'خيار ب', scores: { 1: 9, 2: 6, 3: 8 }, total: 0 }
      ],
      autoSort: true,
      showWeights: true,
      colorCoding: true
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان المصفوفة',
        default: 'مصفوفة القرارات'
      },
      type: {
        type: 'string',
        title: 'نوع المصفوفة',
        enum: ['decisions', 'objectives'],
        enumNames: ['قرارات', 'أهداف'],
        default: 'decisions'
      },
      autoSort: {
        type: 'boolean',
        title: 'ترتيب تلقائي حسب النتيجة',
        default: true
      },
      showWeights: {
        type: 'boolean',
        title: 'إظهار الأوزان',
        default: true
      },
      colorCoding: {
        type: 'boolean',
        title: 'التلوين حسب النتيجة',
        default: true
      },
      maxOptions: {
        type: 'number',
        title: 'الحد الأقصى للخيارات',
        default: 10,
        minimum: 2,
        maximum: 20
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [criteria, setCriteria] = useState(node.metadata?.criteria || []);
    const [options, setOptions] = useState(node.metadata?.options || []);
    const [selectedCell, setSelectedCell] = useState<{optionId: number, criteriaId: number} | null>(null);

    // Calculate weighted scores
    const calculateTotals = () => {
      const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
      
      return options.map(option => {
        const weightedScore = criteria.reduce((sum, criterion) => {
          const score = option.scores[criterion.id] || 0;
          const normalizedWeight = criterion.weight / totalWeight;
          return sum + (score * normalizedWeight);
        }, 0);
        
        return {
          ...option,
          total: Math.round(weightedScore * 10) / 10
        };
      }).sort((a, b) => node.metadata?.autoSort ? b.total - a.total : 0);
    };

    const sortedOptions = calculateTotals();

    const updateScore = (optionId: number, criteriaId: number, newScore: number) => {
      const updatedOptions = options.map(option => 
        option.id === optionId 
          ? { ...option, scores: { ...option.scores, [criteriaId]: Math.max(0, Math.min(10, newScore)) }}
          : option
      );
      
      setOptions(updatedOptions);
      broadcastDecisionsMatrixUpdate(node.id, { options: updatedOptions });
    };

    const updateWeight = (criteriaId: number, newWeight: number) => {
      const updatedCriteria = criteria.map(criterion =>
        criterion.id === criteriaId 
          ? { ...criterion, weight: Math.max(0, Math.min(100, newWeight)) }
          : criterion
      );
      
      setCriteria(updatedCriteria);
      broadcastDecisionsMatrixUpdate(node.id, { criteria: updatedCriteria });
    };

    const addOption = () => {
      const newOption = {
        id: Date.now(),
        name: `خيار ${options.length + 1}`,
        scores: Object.fromEntries(criteria.map(c => [c.id, 5])),
        total: 0
      };
      
      const updatedOptions = [...options, newOption];
      setOptions(updatedOptions);
      broadcastDecisionsMatrixUpdate(node.id, { options: updatedOptions });
    };

    const getScoreColor = (score: number) => {
      if (!node.metadata?.colorCoding) return 'hsl(var(--muted))';
      
      if (score >= 8) return '#10b981'; // Green
      if (score >= 6) return '#f59e0b'; // Yellow  
      if (score >= 4) return '#f97316'; // Orange
      return '#ef4444'; // Red
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
            {node.metadata?.autoSort && (
              <Badge variant="secondary" className="text-xs">
                ترتيب تلقائي
              </Badge>
            )}
          </div>
          <Button size="sm" variant="outline" className="text-xs" onClick={addOption}>
            <Plus className="w-3 h-3 me-1" />
            خيار
          </Button>
        </div>

        {/* Matrix Content */}
        <div className="p-2 h-[calc(100%-48px)] overflow-auto">
          <div className="min-w-max">
            {/* Criteria Headers */}
            <div className="flex mb-2">
              <div className="w-24 text-xs font-medium p-2">الخيارات</div>
              {criteria.map(criterion => (
                <div key={criterion.id} className="w-20 text-center">
                  <div 
                    className="text-xs font-medium p-1 rounded"
                    style={{ backgroundColor: criterion.color + '20', borderColor: criterion.color }}
                  >
                    {criterion.name}
                  </div>
                  {node.metadata?.showWeights && (
                    <input
                      type="number"
                      value={criterion.weight}
                      onChange={(e) => updateWeight(criterion.id, parseInt(e.target.value) || 0)}
                      className="w-full text-xs text-center mt-1 p-1 border rounded"
                      min="0"
                      max="100"
                    />
                  )}
                </div>
              ))}
              <div className="w-16 text-xs font-medium p-2 text-center">النتيجة</div>
            </div>

            {/* Options Rows */}
            {sortedOptions.map((option, index) => (
              <div key={option.id} className="flex items-center mb-1">
                {/* Option Name */}
                <div className="w-24 text-xs p-2 font-medium flex items-center gap-1">
                  {node.metadata?.autoSort && (
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span className="text-xs">#{index + 1}</span>
                    </div>
                  )}
                  <span>{option.name}</span>
                </div>
                
                {/* Score Cells */}
                {criteria.map(criterion => (
                  <div
                    key={criterion.id}
                    className="w-20 p-1"
                  >
                    <input
                      type="number"
                      value={option.scores[criterion.id] || 0}
                      onChange={(e) => updateScore(option.id, criterion.id, parseInt(e.target.value) || 0)}
                      className="w-full text-xs text-center p-1 rounded border"
                      style={{ 
                        backgroundColor: getScoreColor(option.scores[criterion.id] || 0) + '20',
                        borderColor: getScoreColor(option.scores[criterion.id] || 0)
                      }}
                      min="0"
                      max="10"
                    />
                  </div>
                ))}
                
                {/* Total Score */}
                <div className="w-16 text-center">
                  <div 
                    className="text-xs font-bold p-2 rounded"
                    style={{ 
                      backgroundColor: getScoreColor(option.total) + '30',
                      color: getScoreColor(option.total)
                    }}
                  >
                    {option.total}
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {options.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-xs">
                <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد خيارات للمقارنة</p>
                <p>انقر + خيار لإضافة خيار جديد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};

// Gantt Chart Element
const GanttChartElement: SmartElementDefinition = {
  type: 'gantt_chart',
  name: 'Gantt Chart',
  icon: <BarChart className="w-4 h-4" />,
  category: 'analytics',
  defaultState: {
    size: { width: 700, height: 400 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'مخطط جانت',
      tasks: [
        {
          id: 1,
          name: 'المرحلة الأولى',
          startDate: new Date().toISOString(),
          duration: 7, // days
          progress: 30,
          dependencies: [],
          assignee: 'فريق أ',
          color: '#3b82f6'
        },
        {
          id: 2,
          name: 'المرحلة الثانية',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          duration: 5,
          progress: 0,
          dependencies: [1],
          assignee: 'فريق ب',
          color: '#10b981'
        }
      ],
      timeScale: 'days', // days, weeks, months
      showDependencies: true,
      allowDrag: true,
      showProgress: true
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان المشروع',
        default: 'مخطط جانت'
      },
      timeScale: {
        type: 'string',
        title: 'مقياس الزمن',
        enum: ['days', 'weeks', 'months'],
        enumNames: ['أيام', 'أسابيع', 'شهور'],
        default: 'days'
      },
      showDependencies: {
        type: 'boolean',
        title: 'إظهار العلاقات',
        default: true
      },
      allowDrag: {
        type: 'boolean',
        title: 'السماح بالسحب لتعديل المدد',
        default: true
      },
      showProgress: {
        type: 'boolean',
        title: 'إظهار التقدم',
        default: true
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [tasks, setTasks] = useState(node.metadata?.tasks || []);
    const [draggedTask, setDraggedTask] = useState<any>(null);
    const [timeScale, setTimeScale] = useState(node.metadata?.timeScale || 'days');

    const timeScales = {
      days: { unit: 'يوم', multiplier: 1, format: 'dd/MM' },
      weeks: { unit: 'أسبوع', multiplier: 7, format: 'dd/MM' },
      months: { unit: 'شهر', multiplier: 30, format: 'MM/yyyy' }
    };

    const updateTaskDuration = (taskId: number, newDuration: number) => {
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, duration: Math.max(1, newDuration) }
          : task
      );
      setTasks(updatedTasks);
      broadcastGanttUpdate(node.id, { tasks: updatedTasks });
    };

    const updateTaskProgress = (taskId: number, newProgress: number) => {
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? { ...task, progress: Math.max(0, Math.min(100, newProgress)) }
          : task
      );
      setTasks(updatedTasks);
      broadcastGanttUpdate(node.id, { tasks: updatedTasks });
    };

    const addTask = () => {
      const newTask = {
        id: Date.now(),
        name: 'مهمة جديدة',
        startDate: new Date().toISOString(),
        duration: 5,
        progress: 0,
        dependencies: [],
        assignee: 'غير محدد',
        color: '#' + Math.floor(Math.random() * 16777215).toString(16)
      };
      
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      broadcastGanttUpdate(node.id, { tasks: updatedTasks });
    };

    // Calculate task positions
    const getTaskPosition = (task: any, index: number) => {
      const startDate = new Date(task.startDate);
      const today = new Date();
      const daysDiff = Math.floor((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const left = 150 + Math.max(0, daysDiff * 20);
      const width = task.duration * 20;
      const top = 60 + index * 40;
      
      return { left, width, top };
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <BarChart className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={timeScale} 
              onChange={(e) => setTimeScale(e.target.value)}
              className="text-xs border rounded px-2 py-1"
            >
              {Object.entries(timeScales).map(([key, config]) => (
                <option key={key} value={key}>{config.unit}</option>
              ))}
            </select>
            <Button size="sm" variant="outline" className="text-xs" onClick={addTask}>
              <Plus className="w-3 h-3 me-1" />
              مهمة
            </Button>
          </div>
        </div>

        {/* Timeline Header */}
        <div className="relative bg-muted/10 border-b h-8">
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="w-36 px-3 border-e">المهام</div>
            <div className="flex-1 px-2">
              {Array.from({ length: 15 }).map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);
                return (
                  <div 
                    key={index}
                    className="inline-block w-20 text-center border-e border-dashed"
                    style={{ width: '20px' }}
                  >
                    {index % 3 === 0 && date.getDate()}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tasks Area */}
        <div className="relative h-[calc(100%-96px)] overflow-auto">
          {/* Task Rows */}
          {tasks.map((task, index) => {
            const position = getTaskPosition(task, index);
            
            return (
              <div key={task.id} className="relative border-b border-border/50">
                {/* Task Name */}
                <div className="absolute left-0 w-36 p-2 text-xs font-medium bg-card border-e">
                  <div className="truncate" title={task.name}>{task.name}</div>
                  <div className="text-muted-foreground text-xs">{task.assignee}</div>
                </div>
                
                {/* Task Bar */}
                <div
                  className="absolute cursor-pointer rounded border shadow-sm flex items-center"
                  style={{
                    left: `${position.left}px`,
                    width: `${position.width}px`,
                    top: `${position.top - 50}px`,
                    height: '24px',
                    backgroundColor: task.color + '40',
                    borderColor: task.color
                  }}
                  draggable={node.metadata?.allowDrag}
                  onDragStart={() => setDraggedTask(task)}
                >
                  {/* Progress Bar */}
                  {node.metadata?.showProgress && (
                    <div
                      className="h-full rounded-s"
                      style={{
                        width: `${task.progress}%`,
                        backgroundColor: task.color
                      }}
                    />
                  )}
                  
                  {/* Progress Text */}
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white mix-blend-difference">
                    {task.progress}%
                  </div>
                  
                  {/* Resize Handle */}
                  <div
                    className="absolute right-0 w-2 h-full cursor-ew-resize bg-black/20 opacity-0 hover:opacity-100"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startX = e.clientX;
                      const startWidth = position.width;
                      
                      const handleMouseMove = (e: MouseEvent) => {
                        const deltaX = e.clientX - startX;
                        const newDuration = Math.max(1, Math.round((startWidth + deltaX) / 20));
                        updateTaskDuration(task.id, newDuration);
                      };
                      
                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };
                      
                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </div>

                {/* Dependencies Lines */}
                {node.metadata?.showDependencies && task.dependencies?.map(depId => {
                  const depTask = tasks.find(t => t.id === depId);
                  if (!depTask) return null;
                  
                  const depIndex = tasks.findIndex(t => t.id === depId);
                  const depPos = getTaskPosition(depTask, depIndex);
                  
                  return (
                    <svg
                      key={depId}
                      className="absolute pointer-events-none"
                      style={{ 
                        left: `${depPos.left + depPos.width}px`,
                        top: `${depPos.top - 40}px`,
                        width: `${position.left - (depPos.left + depPos.width)}px`,
                        height: `${position.top - depPos.top + 20}px`
                      }}
                    >
                      <path
                        d={`M 0 12 L ${position.left - (depPos.left + depPos.width) - 10} 12 L ${position.left - (depPos.left + depPos.width) - 10} ${position.top - depPos.top + 8} L ${position.left - (depPos.left + depPos.width)} ${position.top - depPos.top + 8}`}
                        stroke="#6b7280"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                        </marker>
                      </defs>
                    </svg>
                  );
                })}
              </div>
            );
          })}
          
          {/* Empty State */}
          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
              <div className="text-center">
                <BarChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد مهام في المخطط</p>
                <p>انقر + مهمة لإضافة مهمة جديدة</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

// Interactive Sheet Element  
const InteractiveSheetElement: SmartElementDefinition = {
  type: 'interactive_sheet',
  name: 'Interactive Sheet',
  icon: <Table className="w-4 h-4" />,
  category: 'data',
  defaultState: {
    size: { width: 600, height: 400 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'جدول البيانات التفاعلي',
      rows: 15,
      cols: 10,
      cells: {
        'A1': { value: 'الاسم', type: 'text', formula: null },
        'B1': { value: 'العدد', type: 'text', formula: null },
        'C1': { value: 'المجموع', type: 'text', formula: null },
        'A2': { value: 'عنصر 1', type: 'text', formula: null },
        'B2': { value: 10, type: 'number', formula: null },
        'A3': { value: 'عنصر 2', type: 'text', formula: null },
        'B3': { value: 20, type: 'number', formula: null },
        'C2': { value: '=B2*2', type: 'formula', formula: 'B2*2' },
        'C3': { value: '=B3*2', type: 'formula', formula: 'B3*2' },
        'C4': { value: '=SUM(C2:C3)', type: 'formula', formula: 'SUM(C2:C3)' }
      },
      linkedElements: {}, // {cellId: elementId}
      autoRecalc: true,
      showFormulas: false,
      allowEdit: true
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان الجدول',
        default: 'جدول البيانات التفاعلي'
      },
      rows: {
        type: 'number',
        title: 'عدد الصفوف',
        default: 15,
        minimum: 5,
        maximum: 50
      },
      cols: {
        type: 'number',
        title: 'عدد الأعمدة',
        default: 10,
        minimum: 3,
        maximum: 26
      },
      autoRecalc: {
        type: 'boolean',
        title: 'إعادة حساب تلقائي',
        default: true
      },
      showFormulas: {
        type: 'boolean',
        title: 'إظهار الصيغ',
        default: false
      },
      allowEdit: {
        type: 'boolean',
        title: 'السماح بالتحرير',
        default: true
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [cells, setCells] = useState(node.metadata?.cells || {});
    const [selectedCell, setSelectedCell] = useState<string | null>(null);
    const [editingCell, setEditingCell] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const getColumnName = (index: number): string => {
      return String.fromCharCode(65 + index); // A, B, C...
    };

    const getCellId = (row: number, col: number): string => {
      return `${getColumnName(col)}${row + 1}`;
    };

    const evaluateFormula = (formula: string, allCells: any): number => {
      try {
        // Simple formula evaluation
        let expression = formula.replace(/([A-Z]\d+)/g, (match) => {
          const cell = allCells[match];
          if (cell && cell.type === 'number') {
            return cell.value.toString();
          }
          if (cell && cell.type === 'formula') {
            return evaluateFormula(cell.formula, allCells).toString();
          }
          return '0';
        });

        // Handle SUM function
        expression = expression.replace(/SUM\(([A-Z]\d+):([A-Z]\d+)\)/g, (match, start, end) => {
          const startCol = start.charCodeAt(0) - 65;
          const startRow = parseInt(start.slice(1)) - 1;
          const endCol = end.charCodeAt(0) - 65;
          const endRow = parseInt(end.slice(1)) - 1;
          
          let sum = 0;
          for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
              const cellId = getCellId(r, c);
              const cell = allCells[cellId];
              if (cell && cell.type === 'number') {
                sum += parseFloat(cell.value) || 0;
              }
            }
          }
          return sum.toString();
        });

        // Handle AVG function
        expression = expression.replace(/AVG\(([A-Z]\d+):([A-Z]\d+)\)/g, (match, start, end) => {
          const startCol = start.charCodeAt(0) - 65;
          const startRow = parseInt(start.slice(1)) - 1;
          const endCol = end.charCodeAt(0) - 65;
          const endRow = parseInt(end.slice(1)) - 1;
          
          let sum = 0;
          let count = 0;
          for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
              const cellId = getCellId(r, c);
              const cell = allCells[cellId];
              if (cell && cell.type === 'number') {
                sum += parseFloat(cell.value) || 0;
                count++;
              }
            }
          }
          return count > 0 ? (sum / count).toString() : '0';
        });

        // Evaluate simple mathematical expressions
        return eval(expression) || 0;
      } catch (error) {
        return 0;
      }
    };

    const updateCell = (cellId: string, value: any) => {
      const newCells = { ...cells };
      
      if (typeof value === 'string' && value.startsWith('=')) {
        // Formula cell
        const formula = value.slice(1);
        newCells[cellId] = {
          value: value,
          type: 'formula',
          formula: formula
        };
      } else if (!isNaN(value) && value !== '') {
        // Number cell
        newCells[cellId] = {
          value: parseFloat(value),
          type: 'number',
          formula: null
        };
      } else {
        // Text cell
        newCells[cellId] = {
          value: value,
          type: 'text',
          formula: null
        };
      }

      // Recalculate formulas if auto-recalc is enabled
      if (node.metadata?.autoRecalc) {
        Object.keys(newCells).forEach(id => {
          const cell = newCells[id];
          if (cell.type === 'formula') {
            const result = evaluateFormula(cell.formula, newCells);
            newCells[id] = { ...cell, calculatedValue: result };
          }
        });
      }

      setCells(newCells);
      broadcastSheetUpdate(node.id, { cells: newCells });
    };

    const getCellValue = (cellId: string) => {
      const cell = cells[cellId];
      if (!cell) return '';
      
      if (cell.type === 'formula') {
        if (node.metadata?.showFormulas) {
          return cell.value; // Show formula
        }
        return cell.calculatedValue !== undefined ? cell.calculatedValue : evaluateFormula(cell.formula, cells);
      }
      
      return cell.value;
    };

    const startEdit = (cellId: string) => {
      if (!node.metadata?.allowEdit) return;
      
      setEditingCell(cellId);
      const cell = cells[cellId];
      setEditValue(cell ? cell.value : '');
    };

    const finishEdit = () => {
      if (editingCell) {
        updateCell(editingCell, editValue);
        setEditingCell(null);
        setEditValue('');
      }
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-muted/30 border-b">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
            {selectedCell && (
              <Badge variant="secondary" className="text-xs">
                {selectedCell}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs"
              onClick={() => {
                const newCells = { ...cells };
                Object.keys(newCells).forEach(id => {
                  const cell = newCells[id];
                  if (cell.type === 'formula') {
                    const result = evaluateFormula(cell.formula, newCells);
                    newCells[id] = { ...cell, calculatedValue: result };
                  }
                });
                setCells(newCells);
              }}
            >
              <Calculator className="w-3 h-3 me-1" />
              حساب
            </Button>
          </div>
        </div>

        {/* Sheet Grid */}
        <div className="overflow-auto h-[calc(100%-48px)]">
          <table className="w-full text-xs">
            <thead className="bg-muted/20 sticky top-0">
              <tr>
                <th className="w-8 h-6 border border-border text-center font-medium">#</th>
                {Array.from({ length: node.metadata?.cols || 10 }).map((_, colIndex) => (
                  <th key={colIndex} className="w-16 h-6 border border-border text-center font-medium">
                    {getColumnName(colIndex)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: node.metadata?.rows || 15 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="w-8 h-6 border border-border bg-muted/20 text-center font-medium">
                    {rowIndex + 1}
                  </td>
                  {Array.from({ length: node.metadata?.cols || 10 }).map((_, colIndex) => {
                    const cellId = getCellId(rowIndex, colIndex);
                    const isSelected = selectedCell === cellId;
                    const isEditing = editingCell === cellId;
                    const cellValue = getCellValue(cellId);
                    
                    return (
                      <td
                        key={colIndex}
                        className={`w-16 h-6 border border-border cursor-cell ${
                          isSelected ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedCell(cellId)}
                        onDoubleClick={() => startEdit(cellId)}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={finishEdit}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') finishEdit();
                              if (e.key === 'Escape') {
                                setEditingCell(null);
                                setEditValue('');
                              }
                            }}
                            className="w-full h-full px-1 text-xs border-none outline-none bg-white"
                            autoFocus
                          />
                        ) : (
                          <div className="px-1 truncate">
                            {cellValue}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

// Smart Mind Maps Element
const SmartMindMapsElement: SmartElementDefinition = {
  type: 'smart_mind_maps',
  name: 'Smart Mind Maps',
  icon: <GitBranch className="w-4 h-4" />,
  category: 'basic',
  defaultState: {
    size: { width: 600, height: 450 },
    style: {
      fill: 'hsl(var(--card))',
      stroke: 'hsl(var(--border))',
      strokeWidth: 1
    },
    metadata: {
      title: 'خريطة ذهنية ذكية',
      centralNode: {
        id: 'central',
        text: 'الفكرة المركزية',
        x: 300,
        y: 225,
        color: '#3b82f6',
        level: 0
      },
      nodes: [
        {
          id: '1',
          text: 'فرع رئيسي 1',
          x: 150,
          y: 150,
          color: '#10b981',
          level: 1,
          parentId: 'central'
        },
        {
          id: '2', 
          text: 'فرع رئيسي 2',
          x: 450,
          y: 150,
          color: '#f59e0b',
          level: 1,
          parentId: 'central'
        }
      ],
      connections: [
        { from: 'central', to: '1' },
        { from: 'central', to: '2' }
      ],
      autoArrange: true,
      allowAI: true,
      maxLevels: 4
    }
  },
  settingsSchema: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'عنوان الخريطة الذهنية',
        default: 'خريطة ذهنية ذكية'
      },
      autoArrange: {
        type: 'boolean',
        title: 'ترتيب تلقائي لمنع التداخل',
        default: true
      },
      allowAI: {
        type: 'boolean',
        title: 'السماح بالتوليد بالذكاء الاصطناعي',
        default: true
      },
      maxLevels: {
        type: 'number',
        title: 'أقصى عدد مستويات',
        default: 4,
        minimum: 2,
        maximum: 8
      },
      centralIdea: {
        type: 'string',
        title: 'الفكرة المركزية',
        default: 'الفكرة المركزية'
      }
    },
    required: ['title']
  },
  renderer: (node, context) => {
    const [centralNode, setCentralNode] = useState(node.metadata?.centralNode);
    const [nodes, setNodes] = useState(node.metadata?.nodes || []);
    const [connections, setConnections] = useState(node.metadata?.connections || []);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const levelColors = [
      '#3b82f6', // Central - Blue
      '#10b981', // Level 1 - Green  
      '#f59e0b', // Level 2 - Yellow
      '#ef4444', // Level 3 - Red
      '#8b5cf6', // Level 4 - Purple
    ];

    const calculateNodePosition = (parentNode: any, childIndex: number, totalChildren: number, level: number) => {
      if (!node.metadata?.autoArrange) return { x: 100, y: 100 };
      
      const radius = 100 + (level * 50);
      const angleStep = (2 * Math.PI) / Math.max(totalChildren, 1);
      const angle = angleStep * childIndex - Math.PI / 2; // Start from top
      
      const x = parentNode.x + Math.cos(angle) * radius;
      const y = parentNode.y + Math.sin(angle) * radius;
      
      return { x, y };
    };

    const addChildNode = (parentId: string) => {
      const parent = parentId === 'central' ? centralNode : nodes.find(n => n.id === parentId);
      if (!parent || parent.level >= (node.metadata?.maxLevels || 4)) return;
      
      const newLevel = parent.level + 1;
      const siblings = nodes.filter(n => n.parentId === parentId);
      const position = calculateNodePosition(parent, siblings.length, siblings.length + 1, newLevel);
      
      const newNode = {
        id: Date.now().toString(),
        text: 'فرع جديد',
        x: position.x,
        y: position.y,
        color: levelColors[newLevel] || '#6b7280',
        level: newLevel,
        parentId: parentId
      };

      const updatedNodes = [...nodes, newNode];
      const updatedConnections = [...connections, { from: parentId, to: newNode.id }];
      
      setNodes(updatedNodes);
      setConnections(updatedConnections);
      
      broadcastMindMapUpdate(node.id, {
        nodes: updatedNodes,
        connections: updatedConnections
      });
    };

    const generateAIBranches = async () => {
      if (!node.metadata?.allowAI) return;
      
      setIsGenerating(true);
      try {
        // Simulate AI generation of related ideas
        const centralIdea = centralNode.text;
        const aiSuggestions = [
          `تطبيق ${centralIdea}`,
          `فوائد ${centralIdea}`,
          `تحديات ${centralIdea}`,
          `مستقبل ${centralIdea}`
        ];

        const newNodes = aiSuggestions.map((suggestion, index) => {
          const position = calculateNodePosition(centralNode, index, aiSuggestions.length, 1);
          return {
            id: `ai_${Date.now()}_${index}`,
            text: suggestion,
            x: position.x,
            y: position.y,
            color: levelColors[1],
            level: 1,
            parentId: 'central'
          };
        });

        const newConnections = newNodes.map(newNode => ({
          from: 'central',
          to: newNode.id
        }));

        const updatedNodes = [...nodes, ...newNodes];
        const updatedConnections = [...connections, ...newConnections];
        
        setNodes(updatedNodes);
        setConnections(updatedConnections);
        
        broadcastMindMapUpdate(node.id, {
          nodes: updatedNodes,
          connections: updatedConnections
        });
      } catch (error) {
        console.error('فشل في توليد الأفكار:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    const updateNodeText = (nodeId: string, newText: string) => {
      if (nodeId === 'central') {
        setCentralNode({ ...centralNode, text: newText });
      } else {
        const updatedNodes = nodes.map(n =>
          n.id === nodeId ? { ...n, text: newText } : n
        );
        setNodes(updatedNodes);
        broadcastMindMapUpdate(node.id, { nodes: updatedNodes });
      }
    };

    return (
      <div className="w-full h-full bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm">{node.metadata?.title}</span>
          </div>
          <div className="flex items-center gap-2">
            {node.metadata?.allowAI && (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs"
                onClick={generateAIBranches}
                disabled={isGenerating}
              >
                <Sparkles className="w-3 h-3 me-1" />
                {isGenerating ? 'جاري...' : 'AI توليد'}
              </Button>
            )}
          </div>
        </div>

        {/* Mind Map Canvas */}
        <div className="relative w-full h-[calc(100%-48px)] overflow-hidden bg-gradient-to-br from-blue-50/30 to-purple-50/30">
          <svg className="w-full h-full">
            {/* Connections */}
            {connections.map((conn, index) => {
              const fromNode = conn.from === 'central' ? centralNode : nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              
              if (!fromNode || !toNode) return null;
              
              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#6b7280"
                  strokeWidth="2"
                  className="opacity-60"
                />
              );
            })}
          </svg>

          {/* Central Node */}
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ 
              left: centralNode.x, 
              top: centralNode.y
            }}
            onClick={() => setSelectedNode('central')}
            onDoubleClick={() => addChildNode('central')}
          >
            <div 
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white text-center p-2 group-hover:scale-110 transition-transform"
              style={{ backgroundColor: centralNode.color }}
            >
              {centralNode.text}
            </div>
            {selectedNode === 'central' && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <input
                  type="text"
                  value={centralNode.text}
                  onChange={(e) => updateNodeText('central', e.target.value)}
                  className="text-xs text-center bg-white border rounded px-2 py-1 w-32"
                  autoFocus
                  onBlur={() => setSelectedNode(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setSelectedNode(null);
                  }}
                />
              </div>
            )}
          </div>

          {/* Branch Nodes */}
          {nodes.map((mapNode) => (
            <div
              key={mapNode.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ 
                left: mapNode.x, 
                top: mapNode.y
              }}
              onClick={() => setSelectedNode(mapNode.id)}
              onDoubleClick={() => addChildNode(mapNode.id)}
            >
              <div 
                className="w-16 h-16 rounded-lg border-2 border-white shadow-md flex items-center justify-center text-xs font-medium text-white text-center p-1 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: mapNode.color }}
              >
                {mapNode.text}
              </div>
              
              {selectedNode === mapNode.id && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <input
                    type="text"
                    value={mapNode.text}
                    onChange={(e) => updateNodeText(mapNode.id, e.target.value)}
                    className="text-xs text-center bg-white border rounded px-2 py-1 w-24"
                    autoFocus
                    onBlur={() => setSelectedNode(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setSelectedNode(null);
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Instructions Overlay */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-xs pointer-events-none">
              <div className="text-center bg-white/80 p-4 rounded-lg">
                <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>انقر مزدوج على العقدة المركزية لإضافة فروع</p>
                <p>انقر على أي عقدة لتحريرها</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

// Realtime broadcast functions
const broadcastThinkingBoardUpdate = async (boardId: string, updates: any) => {
  const channel = supabase.channel(`thinking_board:${boardId}`);
  await channel.send({
    type: 'broadcast',
    event: 'thinking_board_update',
    payload: { boardId, ...updates }
  });
};

const broadcastKanbanUpdate = async (boardId: string, updates: any) => {
  const channel = supabase.channel(`kanban_board:${boardId}`);
  await channel.send({
    type: 'broadcast',
    event: 'kanban_update',
    payload: { boardId, ...updates }
  });
};

const broadcastVotingUpdate = async (pollId: string, updates: any) => {
  const channel = supabase.channel(`voting_poll:${pollId}`);
  await channel.send({
    type: 'broadcast',
    event: 'voting_update',
    payload: { pollId, ...updates }
  });
};

const broadcastBrainstormingUpdate = async (sessionId: string, updates: any) => {
  const channel = supabase.channel(`brainstorming:${sessionId}`);
  await channel.send({
    type: 'broadcast',
    event: 'brainstorming_update',
    payload: { sessionId, ...updates }
  });
};

const broadcastTimelineUpdate = async (timelineId: string, updates: any) => {
  const channel = supabase.channel(`timeline:${timelineId}`);
  await channel.send({
    type: 'broadcast',
    event: 'timeline_update',
    payload: { timelineId, ...updates }
  });
};

const broadcastDecisionsMatrixUpdate = async (matrixId: string, updates: any) => {
  const channel = supabase.channel(`decisions_matrix:${matrixId}`);
  await channel.send({
    type: 'broadcast',
    event: 'matrix_update',
    payload: { matrixId, ...updates }
  });
};

const broadcastGanttUpdate = async (ganttId: string, updates: any) => {
  const channel = supabase.channel(`gantt_chart:${ganttId}`);
  await channel.send({
    type: 'broadcast',
    event: 'gantt_update',
    payload: { ganttId, ...updates }
  });
};

const broadcastSheetUpdate = async (sheetId: string, updates: any) => {
  const channel = supabase.channel(`interactive_sheet:${sheetId}`);
  await channel.send({
    type: 'broadcast',
    event: 'sheet_update',
    payload: { sheetId, ...updates }
  });
};

const broadcastMindMapUpdate = async (mapId: string, updates: any) => {
  const channel = supabase.channel(`smart_mind_maps:${mapId}`);
  await channel.send({
    type: 'broadcast',
    event: 'mindmap_update',
    payload: { mapId, ...updates }
  });
};

// Register advanced elements
export function registerAdvancedSmartElements() {
  try {
    smartElementsRegistry.registerSmartElement(ThinkingBoardElement);
    smartElementsRegistry.registerSmartElement(KanbanBoardElement);
    smartElementsRegistry.registerSmartElement(VotingElement);
    smartElementsRegistry.registerSmartElement(BrainstormingElement);
    smartElementsRegistry.registerSmartElement(TimelineElement);
    smartElementsRegistry.registerSmartElement(DecisionsMatrixElement);
    smartElementsRegistry.registerSmartElement(GanttChartElement);
    smartElementsRegistry.registerSmartElement(InteractiveSheetElement);
    smartElementsRegistry.registerSmartElement(SmartMindMapsElement);
    
    console.log('✅ Advanced smart elements registered successfully');
  } catch (error) {
    console.error('❌ Failed to register advanced smart elements:', error);
  }
}