import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Vote, Plus, X, Users, Clock } from 'lucide-react';

interface VotingOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

interface VotingSystemProps {
  title?: string;
  allowMultipleVotes?: boolean;
  maxVotesPerUser?: number;
  timeLimit?: number; // in minutes
  onVotingEnd?: (results: VotingOption[]) => void;
}

export const VotingSystem: React.FC<VotingSystemProps> = ({
  title = "جلسة تصويت",
  allowMultipleVotes = false,
  maxVotesPerUser = 1,
  timeLimit,
  onVotingEnd
}) => {
  const [options, setOptions] = useState<VotingOption[]>([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [userVotes, setUserVotes] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : null);
  
  // Mock current user ID
  const currentUserId = 'current-user';

  const addOption = () => {
    if (!newOptionText.trim()) return;
    
    const newOption: VotingOption = {
      id: `option_${Date.now()}`,
      text: newOptionText.trim(),
      votes: 0,
      voters: []
    };
    
    setOptions([...options, newOption]);
    setNewOptionText('');
  };

  const removeOption = (optionId: string) => {
    setOptions(options.filter(opt => opt.id !== optionId));
  };

  const vote = (optionId: string) => {
    if (!isActive) return;
    
    const hasVoted = userVotes.includes(optionId);
    
    if (hasVoted) {
      // Remove vote
      setUserVotes(userVotes.filter(id => id !== optionId));
      setOptions(options.map(opt => 
        opt.id === optionId 
          ? { 
              ...opt, 
              votes: opt.votes - 1,
              voters: opt.voters.filter(id => id !== currentUserId)
            }
          : opt
      ));
    } else {
      // Add vote
      const canVote = allowMultipleVotes 
        ? userVotes.length < maxVotesPerUser
        : userVotes.length === 0;
        
      if (canVote) {
        setUserVotes([...userVotes, optionId]);
        setOptions(options.map(opt => 
          opt.id === optionId 
            ? { 
                ...opt, 
                votes: opt.votes + 1,
                voters: [...opt.voters, currentUserId]
              }
            : opt
        ));
      }
    }
  };

  const startVoting = () => {
    if (options.length === 0) return;
    setIsActive(true);
    
    if (timeLimit && timeRemaining) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev <= 1) {
            clearInterval(timer);
            endVoting();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);
    }
  };

  const endVoting = () => {
    setIsActive(false);
    onVotingEnd?.(options);
  };

  const getTotalVotes = () => options.reduce((sum, opt) => sum + opt.votes, 0);

  const getVotePercentage = (votes: number) => {
    const total = getTotalVotes();
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl bg-white border border-sb-border rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Vote className="text-blue-500" size={24} />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-sb-color-text-light">
          {timeRemaining !== null && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span className={cn(
                "font-mono",
                timeRemaining < 60 && "text-red-500 font-semibold"
              )}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{getTotalVotes()}</span>
          </div>
        </div>
      </div>

      {/* Add Option Input */}
      {!isActive && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              placeholder="أضف خيار جديد..."
              className="flex-1 px-3 py-2 border border-sb-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={addOption}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="space-y-3 mb-6">
        {options.map((option) => {
          const percentage = getVotePercentage(option.votes);
          const hasUserVoted = userVotes.includes(option.id);
          
          return (
            <div key={option.id} className="relative">
              <button
                onClick={() => vote(option.id)}
                disabled={!isActive}
                className={cn(
                  "w-full p-4 text-right rounded-lg border transition-all",
                  "hover:bg-sb-panel-bg/50",
                  hasUserVoted && "ring-2 ring-primary bg-primary/5",
                  !isActive && "cursor-not-allowed opacity-75"
                )}
              >
                {/* Background Bar */}
                <div 
                  className="absolute inset-0 bg-primary/10 rounded-lg transition-all"
                  style={{ width: `${percentage}%` }}
                />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{option.votes}</span>
                    <span className="text-xs text-sb-color-text-light">
                      ({percentage.toFixed(1)}%)
                    </span>
                    {hasUserVoted && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span>{option.text}</span>
                    {!isActive && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOption(option.id);
                        }}
                        className="text-red-500 hover:bg-red-50 p-1 rounded"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-sb-color-text-light">
          {allowMultipleVotes 
            ? `يمكنك اختيار حتى ${maxVotesPerUser} خيارات`
            : "يمكنك اختيار خيار واحد فقط"
          }
        </div>
        
        <div className="flex gap-2">
          {!isActive ? (
            <button
              onClick={startVoting}
              disabled={options.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              بدء التصويت
            </button>
          ) : (
            <button
              onClick={endVoting}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              إنهاء التصويت
            </button>
          )}
        </div>
      </div>
    </div>
  );
};