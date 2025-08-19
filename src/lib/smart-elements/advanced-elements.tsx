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
  Network
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

// Register advanced elements
export function registerAdvancedSmartElements() {
  try {
    smartElementsRegistry.registerSmartElement(ThinkingBoardElement);
    smartElementsRegistry.registerSmartElement(KanbanBoardElement);
    smartElementsRegistry.registerSmartElement(VotingElement);
    smartElementsRegistry.registerSmartElement(BrainstormingElement);
    
    console.log('✅ Advanced smart elements registered successfully');
  } catch (error) {
    console.error('❌ Failed to register advanced smart elements:', error);
  }
}