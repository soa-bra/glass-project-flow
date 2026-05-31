import React, { useState, useMemo } from 'react';
import { 
  Plus, Play, Pause, RotateCcw, Check, Users, 
  BarChart3, Eye, EyeOff, Trash2, Edit2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/BaseBadge';
import type { VotingData, VotingOption } from '@/types/smart-elements';

interface VotingBoardProps {
  data?: Partial<VotingData>;
  onUpdate?: (data: VotingData) => void;
  userId?: string;
}

const OPTION_COLORS = ['#3DBE8B', '#3DA8F5', '#F6C445', '#E5564D', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E'];

export const VotingBoard: React.FC<VotingBoardProps> = ({
  data = {},
  onUpdate,
  userId = 'current-user',
}) => {
  const [question, setQuestion] = useState(data.question || 'ما رأيك؟');
  const [options, setOptions] = useState<VotingOption[]>(data.options || []);
  const [status, setStatus] = useState<'draft' | 'active' | 'paused' | 'ended'>(data.status || 'draft');
  const [showResults, setShowResults] = useState(data.showResultsBeforeEnd ?? false);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [allowMultiple, setAllowMultiple] = useState(data.allowMultipleSelection ?? false);

  const totalVotes = useMemo(() => 
    options.reduce((sum, opt) => sum + opt.votes, 0), 
    [options]
  );

  const userVotedOptions = useMemo(() => 
    options.filter(opt => opt.voters.includes(userId)).map(opt => opt.id),
    [options, userId]
  );

  const updateData = () => {
    onUpdate?.({
      question,
      options,
      maxVotesPerUser: data.maxVotesPerUser ?? 1,
      allowMultipleSelection: allowMultiple,
      showResultsAs: data.showResultsAs ?? 'both',
      showResultsBeforeEnd: showResults,
      anonymous: data.anonymous ?? false,
      duration: data.duration,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      status,
      allowChangeVote: data.allowChangeVote ?? true,
    });
  };

  const addOption = () => {
    if (!newOptionLabel.trim()) return;
    const newOption: VotingOption = {
      id: `opt-${Date.now()}`,
      label: newOptionLabel,
      votes: 0,
      voters: [],
      color: OPTION_COLORS[options.length % OPTION_COLORS.length],
    };
    setOptions([...options, newOption]);
    setNewOptionLabel('');
    setIsAddingOption(false);
  };

  const deleteOption = (optionId: string) => {
    if (status !== 'draft') return;
    setOptions(options.filter(opt => opt.id !== optionId));
  };

  const vote = (optionId: string) => {
    if (status !== 'active') return;
    
    const hasVoted = userVotedOptions.includes(optionId);
    
    if (hasVoted) {
      // Remove vote
      setOptions(options.map(opt => 
        opt.id === optionId 
          ? { ...opt, votes: opt.votes - 1, voters: opt.voters.filter(v => v !== userId) }
          : opt
      ));
    } else {
      // Add vote
      if (!allowMultiple && userVotedOptions.length > 0) {
        // Remove previous vote first
        setOptions(prev => prev.map(opt => {
          if (userVotedOptions.includes(opt.id)) {
            return { ...opt, votes: opt.votes - 1, voters: opt.voters.filter(v => v !== userId) };
          }
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1, voters: [...opt.voters, userId] };
          }
          return opt;
        }));
      } else {
        setOptions(options.map(opt => 
          opt.id === optionId 
            ? { ...opt, votes: opt.votes + 1, voters: [...opt.voters, userId] }
            : opt
        ));
      }
    }
  };

  const startVoting = () => {
    if (options.length < 2) return;
    setStatus('active');
  };

  const pauseVoting = () => setStatus('paused');
  const resumeVoting = () => setStatus('active');
  const endVoting = () => setStatus('ended');
  
  const resetVoting = () => {
    setOptions(options.map(opt => ({ ...opt, votes: 0, voters: [] })));
    setStatus('draft');
  };

  const getPercentage = (votes: number) => 
    totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

  const canShowResults = status === 'ended' || showResults;

  return (
    <div className="w-full h-full bg-background rounded-lg border border-border overflow-hidden flex flex-col" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-surface/50">
        <div className="flex-1">
          {isEditingQuestion ? (
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onBlur={() => { setIsEditingQuestion(false); updateData(); }}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingQuestion(false)}
              className="text-lg font-semibold"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-foreground cursor-pointer hover:text-primary flex items-center gap-2"
              onClick={() => status === 'draft' && setIsEditingQuestion(true)}
            >
              {question}
              {status === 'draft' && <Edit2 className="h-4 w-4 text-muted-foreground" />}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={
            status === 'active' ? 'default' : 
            status === 'ended' ? 'secondary' : 
            'outline'
          }>
            {status === 'draft' && 'مسودة'}
            {status === 'active' && 'نشط'}
            {status === 'paused' && 'متوقف'}
            {status === 'ended' && 'منتهي'}
          </Badge>
          
          {totalVotes > 0 && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{totalVotes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          {status === 'draft' && (
            <Button size="sm" onClick={startVoting} disabled={options.length < 2}>
              <Play className="h-4 w-4 ml-1" />
              بدء التصويت
            </Button>
          )}
          {status === 'active' && (
            <>
              <Button size="sm" variant="outline" onClick={pauseVoting}>
                <Pause className="h-4 w-4 ml-1" />
                إيقاف مؤقت
              </Button>
              <Button size="sm" variant="destructive" onClick={endVoting}>
                إنهاء
              </Button>
            </>
          )}
          {status === 'paused' && (
            <>
              <Button size="sm" onClick={resumeVoting}>
                <Play className="h-4 w-4 ml-1" />
                استئناف
              </Button>
              <Button size="sm" variant="destructive" onClick={endVoting}>
                إنهاء
              </Button>
            </>
          )}
          {status === 'ended' && (
            <Button size="sm" variant="outline" onClick={resetVoting}>
              <RotateCcw className="h-4 w-4 ml-1" />
              إعادة التصويت
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowResults(!showResults)}
          >
            {showResults ? <EyeOff className="h-4 w-4 ml-1" /> : <Eye className="h-4 w-4 ml-1" />}
            {showResults ? 'إخفاء النتائج' : 'عرض النتائج'}
          </Button>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        {options.map((option, index) => {
          const percentage = getPercentage(option.votes);
          const isVoted = userVotedOptions.includes(option.id);
          
          return (
            <div
              key={option.id}
              className={`relative p-4 rounded-lg border transition-all cursor-pointer ${
                isVoted 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 bg-card'
              }`}
              onClick={() => vote(option.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="font-medium">{option.label}</span>
                  {isVoted && <Check className="h-4 w-4 text-primary" />}
                </div>
                
                {status === 'draft' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); deleteOption(option.id); }}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {canShowResults && (
                <>
                  <Progress 
                    value={percentage} 
                    className="h-2 mb-1"
                    style={{ 
                      '--progress-color': option.color 
                    } as React.CSSProperties}
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{option.votes} صوت</span>
                    <span>{percentage}%</span>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Add Option */}
        {status === 'draft' && (
          isAddingOption ? (
            <div className="p-3 border border-dashed border-border rounded-lg">
              <Input
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addOption()}
                placeholder="اسم الخيار"
                className="mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={addOption} className="flex-1">
                  إضافة
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setIsAddingOption(false); setNewOptionLabel(''); }}
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsAddingOption(true)}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 ml-1" />
              إضافة خيار
            </Button>
          )
        )}
      </div>

      {/* Footer Stats */}
      {canShowResults && totalVotes > 0 && (
        <div className="p-3 border-t border-border bg-muted/30 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>إجمالي الأصوات: {totalVotes}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span>المشاركين: {new Set(options.flatMap(o => o.voters)).size}</span>
          </div>
        </div>
      )}
    </div>
  );
};
