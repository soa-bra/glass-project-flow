import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/BaseBadge';
import { VotingElement, VotingOption } from '../../../types/smartElements.types';
import { Vote, Plus, Play, Pause, BarChart3, Users, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VotingSystemProps {
  element: VotingElement;
  isSelected?: boolean;
  onUpdate?: (updates: Partial<VotingElement>) => void;
  currentUserId?: string;
}

export const VotingSystem: React.FC<VotingSystemProps> = ({
  element,
  isSelected = false,
  onUpdate,
  currentUserId = 'current_user'
}) => {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editQuestion, setEditQuestion] = useState(element.data.question);
  const [newOptionText, setNewOptionText] = useState('');

  const totalVotes = element.data.options.reduce((sum, option) => sum + option.votes, 0);
  const userVotes = element.data.options.filter(option => 
    option.voters.includes(currentUserId)
  ).length;

  const canVote = element.data.isActive && userVotes < element.data.maxVotesPerUser;

  const handleVote = (optionId: string) => {
    if (!canVote || !onUpdate) return;

    const updatedOptions = element.data.options.map(option => {
      if (option.id === optionId) {
        const alreadyVoted = option.voters.includes(currentUserId);
        
        if (alreadyVoted) {
          // Remove vote
          return {
            ...option,
            votes: Math.max(0, option.votes - 1),
            voters: option.voters.filter(id => id !== currentUserId)
          };
        } else {
          // Add vote
          return {
            ...option,
            votes: option.votes + 1,
            voters: [...option.voters, currentUserId]
          };
        }
      }
      return option;
    });

    onUpdate({
      data: {
        ...element.data,
        options: updatedOptions
      }
    });
  };

  const handleToggleActive = () => {
    if (!onUpdate) return;
    
    onUpdate({
      data: {
        ...element.data,
        isActive: !element.data.isActive,
        startTime: !element.data.isActive ? Date.now() : element.data.startTime
      }
    });
  };

  const handleAddOption = () => {
    if (!newOptionText.trim() || !onUpdate) return;

    const newOption: VotingOption = {
      id: `opt_${Date.now()}`,
      title: newOptionText.trim(),
      votes: 0,
      voters: []
    };

    onUpdate({
      data: {
        ...element.data,
        options: [...element.data.options, newOption]
      }
    });

    setNewOptionText('');
  };

  const handleQuestionSave = () => {
    if (onUpdate) {
      onUpdate({
        data: {
          ...element.data,
          question: editQuestion
        }
      });
    }
    setIsEditingQuestion(false);
  };

  const getTimeRemaining = () => {
    if (!element.data.endTime) return null;
    
    const remaining = element.data.endTime - Date.now();
    if (remaining <= 0) return 'انتهى الوقت';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      className={`w-full h-full ${isSelected ? 'ring-2 ring-primary' : ''} transition-all duration-200`}
      style={{ 
        minWidth: element.size.width,
        minHeight: element.size.height
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="h-5 w-5 text-primary" />
            {isEditingQuestion ? (
              <Input
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                onBlur={handleQuestionSave}
                onKeyPress={(e) => e.key === 'Enter' && handleQuestionSave()}
                className="text-lg font-bold bg-transparent border-none p-0 h-auto"
                autoFocus
              />
            ) : (
              <CardTitle 
                className="text-lg cursor-pointer hover:text-primary"
                onClick={() => setIsEditingQuestion(true)}
              >
                {element.data.question || 'سؤال التصويت'}
              </CardTitle>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge 
              variant={element.data.isActive ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {element.data.isActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {element.data.isActive ? 'نشط' : 'متوقف'}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleActive}
              className="h-8"
            >
              {element.data.isActive ? 'إيقاف' : 'بدء'}
            </Button>
          </div>
        </div>

        {/* Voting Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            إجمالي الأصوات: {totalVotes}
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            أصواتك: {userVotes}/{element.data.maxVotesPerUser}
          </div>
          {element.data.endTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {getTimeRemaining()}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Voting Options */}
        <div className="space-y-3">
          {element.data.options.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const hasUserVoted = option.voters.includes(currentUserId);
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant={hasUserVoted ? "default" : "outline"}
                    className={`flex-1 justify-start h-auto p-3 ${
                      canVote || hasUserVoted ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                    onClick={() => handleVote(option.id)}
                    disabled={!element.data.isActive && !hasUserVoted}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-right">{option.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="ml-2">
                          {option.votes}
                        </Badge>
                        {hasUserVoted && <Vote className="h-4 w-4 text-primary" />}
                      </div>
                    </div>
                  </Button>
                </div>
                
                {/* Progress Bar */}
                <div className="px-3">
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>{percentage.toFixed(1)}%</span>
                    <span>{option.votes} أصوات</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Option */}
        {element.data.isActive && (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="خيار جديد..."
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
              />
              <Button onClick={handleAddOption} disabled={!newOptionText.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="allow-multiple" className="text-sm">
              السماح بالتصويت المتعدد
            </Label>
            <Switch
              id="allow-multiple"
              checked={element.data.allowMultiple}
              onCheckedChange={(checked) => {
                if (onUpdate) {
                  onUpdate({
                    data: {
                      ...element.data,
                      allowMultiple: checked,
                      maxVotesPerUser: checked ? element.data.maxVotesPerUser : 1
                    }
                  });
                }
              }}
            />
          </div>
          
          <div className="text-xs text-muted-foreground">
            الحد الأقصى للأصوات لكل مستخدم: {element.data.maxVotesPerUser}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};