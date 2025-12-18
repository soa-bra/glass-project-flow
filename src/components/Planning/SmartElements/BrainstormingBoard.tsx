import React, { useState, useMemo } from 'react';
import { 
  Plus, Play, Pause, Check, Lightbulb, ThumbsUp, 
  Users, Timer, Layers, Trash2, Tag, Shuffle, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/BaseBadge';
import { Textarea } from '@/components/ui/textarea';
import type { BrainstormingData, BrainstormIdea, BrainstormGroup } from '@/types/smart-elements';

interface BrainstormingBoardProps {
  data?: Partial<BrainstormingData>;
  onUpdate?: (data: BrainstormingData) => void;
  userId?: string;
  userName?: string;
}

const GROUP_COLORS = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9B59B6', '#1ABC9C'];

export const BrainstormingBoard: React.FC<BrainstormingBoardProps> = ({
  data = {},
  onUpdate,
  userId = 'current-user',
  userName = 'أنا',
}) => {
  const [topic, setTopic] = useState(data.topic || 'موضوع العصف الذهني');
  const [mode, setMode] = useState<'collaborative' | 'silent' | 'rapid' | 'branching'>(
    data.mode || 'collaborative'
  );
  const [ideas, setIdeas] = useState<BrainstormIdea[]>(data.ideas || []);
  const [groups, setGroups] = useState<BrainstormGroup[]>(data.groups || []);
  const [status, setStatus] = useState<'setup' | 'active' | 'reviewing' | 'completed'>(
    data.status || 'setup'
  );
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupLabel, setNewGroupLabel] = useState('');
  const [isEditingTopic, setIsEditingTopic] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [votingEnabled, setVotingEnabled] = useState(data.allowVoting ?? true);

  const sortedIdeas = useMemo(() => 
    [...ideas].sort((a, b) => b.votes - a.votes),
    [ideas]
  );

  const updateData = () => {
    onUpdate?.({
      topic,
      mode,
      ideas,
      groups,
      duration: data.duration,
      maxIdeasPerUser: data.maxIdeasPerUser,
      allowVoting: votingEnabled,
      status,
      linkedElementId: data.linkedElementId,
      revealIdeasOnEnd: data.revealIdeasOnEnd ?? true,
      rapidModeWordLimit: data.rapidModeWordLimit ?? 5,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
    });
  };

  const addIdea = () => {
    if (!newIdeaContent.trim()) return;
    
    const newIdea: BrainstormIdea = {
      id: `idea-${Date.now()}`,
      content: newIdeaContent,
      authorId: userId,
      authorName: userName,
      createdAt: new Date().toISOString(),
      groupId: selectedGroup || undefined,
      votes: 0,
      isSelected: false,
      color: selectedGroup ? groups.find(g => g.id === selectedGroup)?.color : undefined,
    };
    
    setIdeas([...ideas, newIdea]);
    setNewIdeaContent('');

    if (selectedGroup) {
      setGroups(groups.map(g => 
        g.id === selectedGroup 
          ? { ...g, ideaIds: [...g.ideaIds, newIdea.id] }
          : g
      ));
    }
  };

  const deleteIdea = (ideaId: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    setIdeas(ideas.filter(i => i.id !== ideaId));
    
    if (idea?.groupId) {
      setGroups(groups.map(g => 
        g.id === idea.groupId
          ? { ...g, ideaIds: g.ideaIds.filter(id => id !== ideaId) }
          : g
      ));
    }
  };

  const voteIdea = (ideaId: string) => {
    if (!votingEnabled || status === 'setup') return;
    setIdeas(ideas.map(i => 
      i.id === ideaId 
        ? { ...i, votes: i.votes + 1 }
        : i
    ));
  };

  const toggleSelectIdea = (ideaId: string) => {
    setIdeas(ideas.map(i => 
      i.id === ideaId 
        ? { ...i, isSelected: !i.isSelected }
        : i
    ));
  };

  const addGroup = () => {
    if (!newGroupLabel.trim()) return;
    const newGroup: BrainstormGroup = {
      id: `group-${Date.now()}`,
      label: newGroupLabel,
      color: GROUP_COLORS[groups.length % GROUP_COLORS.length],
      ideaIds: [],
    };
    setGroups([...groups, newGroup]);
    setNewGroupLabel('');
    setIsAddingGroup(false);
  };

  const assignToGroup = (ideaId: string, groupId: string | null) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (!idea) return;

    // Remove from old group
    if (idea.groupId) {
      setGroups(prev => prev.map(g => 
        g.id === idea.groupId 
          ? { ...g, ideaIds: g.ideaIds.filter(id => id !== ideaId) }
          : g
      ));
    }

    // Add to new group
    if (groupId) {
      setGroups(prev => prev.map(g => 
        g.id === groupId 
          ? { ...g, ideaIds: [...g.ideaIds, ideaId] }
          : g
      ));
    }

    // Update idea
    setIdeas(prev => prev.map(i => 
      i.id === ideaId 
        ? { ...i, groupId: groupId || undefined, color: groupId ? groups.find(g => g.id === groupId)?.color : undefined }
        : i
    ));
  };

  const shuffleIdeas = () => {
    setIdeas(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const startSession = () => setStatus('active');
  const pauseSession = () => setStatus('setup');
  const reviewSession = () => setStatus('reviewing');
  const completeSession = () => setStatus('completed');

  const getGroupById = (groupId?: string) => groups.find(g => g.id === groupId);

  const selectedIdeasCount = ideas.filter(i => i.isSelected).length;

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
        <div className="flex-1 flex items-center gap-3">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          {isEditingTopic ? (
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onBlur={() => { setIsEditingTopic(false); updateData(); }}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTopic(false)}
              className="text-lg font-semibold flex-1"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary"
              onClick={() => status === 'setup' && setIsEditingTopic(true)}
            >
              {topic}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={
            status === 'active' ? 'default' : 
            status === 'reviewing' ? 'secondary' :
            status === 'completed' ? 'outline' : 'outline'
          }>
            {status === 'setup' && 'الإعداد'}
            {status === 'active' && 'نشط'}
            {status === 'reviewing' && 'المراجعة'}
            {status === 'completed' && 'مكتمل'}
          </Badge>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>{ideas.length}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {status === 'setup' && (
            <Button size="sm" onClick={startSession}>
              <Play className="h-4 w-4 ml-1" />
              بدء الجلسة
            </Button>
          )}
          {status === 'active' && (
            <>
              <Button size="sm" variant="outline" onClick={pauseSession}>
                <Pause className="h-4 w-4 ml-1" />
                إيقاف
              </Button>
              <Button size="sm" onClick={reviewSession}>
                مراجعة الأفكار
              </Button>
            </>
          )}
          {status === 'reviewing' && (
            <>
              <Button size="sm" variant="outline" onClick={startSession}>
                <Play className="h-4 w-4 ml-1" />
                المزيد من الأفكار
              </Button>
              <Button size="sm" onClick={completeSession}>
                <Check className="h-4 w-4 ml-1" />
                إنهاء ({selectedIdeasCount} محددة)
              </Button>
            </>
          )}
          {status === 'completed' && (
            <Button size="sm" variant="outline" onClick={() => setStatus('setup')}>
              جلسة جديدة
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={shuffleIdeas}>
            <Shuffle className="h-4 w-4" />
          </Button>
          <Badge variant="outline" className="gap-1">
            <Layers className="h-3 w-3" />
            {groups.length} مجموعات
          </Badge>
        </div>
      </div>

      {/* Groups Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/20 flex-wrap">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <Badge
          variant={selectedGroup === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSelectedGroup(null)}
        >
          الكل
        </Badge>
        {groups.map(group => (
          <Badge
            key={group.id}
            variant={selectedGroup === group.id ? "default" : "outline"}
            className="cursor-pointer"
            style={{ 
              backgroundColor: selectedGroup === group.id ? group.color : 'transparent',
              borderColor: group.color,
              color: selectedGroup === group.id ? '#fff' : group.color,
            }}
            onClick={() => setSelectedGroup(selectedGroup === group.id ? null : group.id)}
          >
            {group.label} ({group.ideaIds.length})
          </Badge>
        ))}
        {isAddingGroup ? (
          <div className="flex items-center gap-1">
            <Input
              value={newGroupLabel}
              onChange={(e) => setNewGroupLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGroup()}
              placeholder="اسم المجموعة"
              className="h-6 w-24 text-xs"
              autoFocus
            />
            <Button size="sm" onClick={addGroup} className="h-6 px-2 text-xs">
              إضافة
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingGroup(true)}
            className="h-6 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Ideas Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(status === 'reviewing' ? sortedIdeas : ideas)
            .filter(idea => !selectedGroup || idea.groupId === selectedGroup)
            .map((idea, index) => {
              const group = getGroupById(idea.groupId);
              return (
                <div
                  key={idea.id}
                  className={`p-3 rounded-lg border transition-all ${
                    idea.isSelected 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                  style={{ borderTopColor: group?.color || 'hsl(var(--border))', borderTopWidth: '3px' }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm flex-1">{idea.content}</p>
                    {status === 'reviewing' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSelectIdea(idea.id)}
                        className={`h-6 w-6 p-0 ${idea.isSelected ? 'text-primary' : ''}`}
                      >
                        <Star className={`h-4 w-4 ${idea.isSelected ? 'fill-primary' : ''}`} />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mode !== 'silent' && (
                        <span className="text-xs text-muted-foreground">
                          {idea.authorName}
                        </span>
                      )}
                      {group && (
                        <Badge 
                          className="text-xs"
                          style={{ backgroundColor: group.color, color: '#fff' }}
                        >
                          {group.label}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {votingEnabled && status !== 'setup' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => voteIdea(idea.id)}
                          className="h-6 px-2 gap-1"
                        >
                          <ThumbsUp className="h-3 w-3" />
                          <span className="text-xs">{idea.votes}</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteIdea(idea.id)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {ideas.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-3 text-yellow-500/50" />
              <p className="text-sm">ابدأ بإضافة أفكارك</p>
              <p className="text-xs mt-1">شارك كل ما يخطر ببالك حول الموضوع</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {(status === 'active' || status === 'setup') && (
        <div className="p-4 border-t border-border bg-surface/50">
          <div className="flex gap-2">
            <Textarea
              value={newIdeaContent}
              onChange={(e) => setNewIdeaContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  addIdea();
                }
              }}
              placeholder={mode === 'rapid' ? `أدخل فكرة قصيرة (${data.rapidModeWordLimit || 5} كلمات كحد أقصى)` : 'اكتب فكرتك هنا...'}
              className="resize-none"
              rows={2}
            />
            <Button onClick={addIdea} className="self-end">
              <Plus className="h-4 w-4 ml-1" />
              إضافة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
