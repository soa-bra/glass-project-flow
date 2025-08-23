import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Brain, Send, Eye, EyeOff, Timer, Users } from 'lucide-react';

interface BrainstormIdea {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  reactions: Record<string, string[]>; // reaction -> userIds
}

interface BrainstormingSessionProps {
  sessionName?: string;
  mode?: 'collaborative' | 'silent' | 'rapid' | 'threaded';
  timeLimit?: number; // in minutes
  maxParticipants?: number;
  onSessionEnd?: (ideas: BrainstormIdea[]) => void;
}

const BRAINSTORM_MODES = {
  collaborative: { name: 'تعاوني', description: 'جميع الأفكار مرئية للجميع' },
  silent: { name: 'صامت', description: 'الأفكار مخفية حتى انتهاء الجلسة' },
  rapid: { name: 'سريع', description: 'كلمة واحدة فقط لكل فكرة' },
  threaded: { name: 'تشعبي', description: 'ربط الأفكار بموضوع محدد' }
};

const REACTIONS = ['👍', '💡', '🔥', '❤️', '🤔', '⭐'];

export const BrainstormingSession: React.FC<BrainstormingSessionProps> = ({
  sessionName = "جلسة عصف ذهني",
  mode = 'collaborative',
  timeLimit = 10,
  maxParticipants = 10,
  onSessionEnd
}) => {
  const [ideas, setIdeas] = useState<BrainstormIdea[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60);
  const [participants] = useState(['المستخدم الحالي']); // Mock participants
  const [showIdeas, setShowIdeas] = useState(mode !== 'silent');
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock current user
  const currentUser = 'المستخدم الحالي';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            endSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const startSession = () => {
    setIsActive(true);
    setTimeRemaining(timeLimit * 60);
    inputRef.current?.focus();
  };

  const endSession = () => {
    setIsActive(false);
    setShowIdeas(true);
    onSessionEnd?.(ideas);
  };

  const addIdea = () => {
    if (!newIdea.trim() || !isActive) return;

    // Validate rapid mode (single word only)
    if (mode === 'rapid' && newIdea.trim().split(/\s+/).length > 1) {
      alert('في النمط السريع، يُسمح بكلمة واحدة فقط');
      return;
    }

    const idea: BrainstormIdea = {
      id: `idea_${Date.now()}`,
      text: newIdea.trim(),
      author: currentUser,
      timestamp: Date.now(),
      reactions: {}
    };

    setIdeas([...ideas, idea]);
    setNewIdea('');
    inputRef.current?.focus();
  };

  const addReaction = (ideaId: string, reaction: string) => {
    setIdeas(ideas.map(idea => {
      if (idea.id === ideaId) {
        const currentReactions = idea.reactions[reaction] || [];
        const hasReacted = currentReactions.includes(currentUser);
        
        return {
          ...idea,
          reactions: {
            ...idea.reactions,
            [reaction]: hasReacted 
              ? currentReactions.filter(user => user !== currentUser)
              : [...currentReactions, currentUser]
          }
        };
      }
      return idea;
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getVisibleIdeas = () => {
    if (mode === 'silent' && isActive) {
      return ideas.filter(idea => idea.author === currentUser);
    }
    return ideas;
  };

  return (
    <div className="w-full max-w-4xl bg-white border border-sb-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="text-purple-500" size={24} />
          <div>
            <h3 className="font-semibold text-lg">{sessionName}</h3>
            <p className="text-sm text-sb-color-text-light">
              {BRAINSTORM_MODES[mode].name} - {BRAINSTORM_MODES[mode].description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Timer size={16} />
            <span className={cn(
              "font-mono",
              timeRemaining < 60 && isActive && "text-red-500 font-semibold"
            )}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{participants.length}/{maxParticipants}</span>
          </div>

          {mode === 'silent' && (
            <button
              onClick={() => setShowIdeas(!showIdeas)}
              className="flex items-center gap-1 p-2 hover:bg-sb-panel-bg/50 rounded"
              title={showIdeas ? "إخفاء الأفكار" : "إظهار الأفكار"}
            >
              {showIdeas ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIdea()}
            placeholder={
              mode === 'rapid' 
                ? "كلمة واحدة فقط..." 
                : "شارك فكرتك..."
            }
            disabled={!isActive}
            className="flex-1 px-4 py-3 border border-sb-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button
            onClick={addIdea}
            disabled={!isActive || !newIdea.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Ideas Display */}
      {(showIdeas || !isActive) && (
        <div className="mb-6 max-h-96 overflow-y-auto">
          {getVisibleIdeas().length === 0 ? (
            <div className="text-center py-8 text-sb-color-text-light">
              {isActive ? "ابدأ بإضافة أول فكرة..." : "لا توجد أفكار بعد"}
            </div>
          ) : (
            <div className="grid gap-3">
              {getVisibleIdeas()
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((idea) => (
                  <div 
                    key={idea.id}
                    className="p-4 bg-sb-panel-bg/30 rounded-lg border border-sb-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{idea.text}</p>
                        <div className="flex items-center gap-2 text-xs text-sb-color-text-light">
                          <span>{idea.author}</span>
                          <span>•</span>
                          <span>{new Date(idea.timestamp).toLocaleTimeString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Reactions */}
                    <div className="flex items-center gap-1 mt-3">
                      {REACTIONS.map((reaction) => {
                        const count = (idea.reactions[reaction] || []).length;
                        const hasReacted = (idea.reactions[reaction] || []).includes(currentUser);
                        
                        return (
                          <button
                            key={reaction}
                            onClick={() => addReaction(idea.id, reaction)}
                            className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors",
                              hasReacted 
                                ? "bg-primary/20 text-primary border border-primary/30" 
                                : "hover:bg-sb-panel-bg/50 border border-transparent"
                            )}
                          >
                            <span>{reaction}</span>
                            {count > 0 && <span>{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-sb-color-text-light">
          {ideas.length} فكرة مُضافة
        </div>
        
        <div className="flex gap-2">
          {!isActive ? (
            <button
              onClick={startSession}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              بدء الجلسة
            </button>
          ) : (
            <button
              onClick={endSession}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              إنهاء الجلسة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};