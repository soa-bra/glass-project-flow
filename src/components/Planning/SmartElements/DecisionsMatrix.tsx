import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Grid3X3, ArrowUpDown, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: string;
  name: string;
}

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface Rating {
  optionId: string;
  criterionId: string;
  value: number;
}

interface DecisionsMatrixData {
  options: Option[];
  criteria: Criterion[];
  ratings: Rating[];
}

interface DecisionsMatrixProps {
  data: DecisionsMatrixData;
  onUpdate: (data: Partial<DecisionsMatrixData>) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const DecisionsMatrix: React.FC<DecisionsMatrixProps> = ({ data, onUpdate }) => {
  const [newOptionName, setNewOptionName] = useState('');
  const [newCriterionName, setNewCriterionName] = useState('');

  const options = data?.options || [];
  const criteria = data?.criteria || [];
  const ratings = data?.ratings || [];

  const addOption = () => {
    if (!newOptionName.trim()) return;
    const newOption: Option = { id: generateId(), name: newOptionName.trim() };
    onUpdate({ options: [...options, newOption] });
    setNewOptionName('');
  };

  const addCriterion = () => {
    if (!newCriterionName.trim()) return;
    const newCriterion: Criterion = { 
      id: generateId(), 
      name: newCriterionName.trim(),
      weight: 1 
    };
    onUpdate({ criteria: [...criteria, newCriterion] });
    setNewCriterionName('');
  };

  const deleteOption = (id: string) => {
    onUpdate({ 
      options: options.filter(o => o.id !== id),
      ratings: ratings.filter(r => r.optionId !== id)
    });
  };

  const deleteCriterion = (id: string) => {
    onUpdate({ 
      criteria: criteria.filter(c => c.id !== id),
      ratings: ratings.filter(r => r.criterionId !== id)
    });
  };

  const updateWeight = (criterionId: string, weight: number) => {
    onUpdate({
      criteria: criteria.map(c => 
        c.id === criterionId ? { ...c, weight: Math.max(1, Math.min(5, weight)) } : c
      )
    });
  };

  const updateRating = (optionId: string, criterionId: string, value: number) => {
    const existingIndex = ratings.findIndex(
      r => r.optionId === optionId && r.criterionId === criterionId
    );
    
    if (existingIndex >= 0) {
      const newRatings = [...ratings];
      newRatings[existingIndex] = { optionId, criterionId, value };
      onUpdate({ ratings: newRatings });
    } else {
      onUpdate({ ratings: [...ratings, { optionId, criterionId, value }] });
    }
  };

  const getRating = (optionId: string, criterionId: string): number => {
    return ratings.find(
      r => r.optionId === optionId && r.criterionId === criterionId
    )?.value || 0;
  };

  const calculateScore = (optionId: string): number => {
    let totalScore = 0;
    let totalWeight = 0;
    
    criteria.forEach(criterion => {
      const rating = getRating(optionId, criterion.id);
      totalScore += rating * criterion.weight;
      totalWeight += criterion.weight * 5; // Max rating is 5
    });
    
    return totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  };

  const sortedOptions = useMemo(() => {
    return [...options].sort((a, b) => calculateScore(b.id) - calculateScore(a.id));
  }, [options, criteria, ratings]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-[#3DBE8B]';
    if (score >= 40) return 'text-[#F6C445]';
    return 'text-[#E5564D]';
  };

  const getBgColor = (score: number) => {
    if (score >= 70) return 'bg-[#3DBE8B]/10';
    if (score >= 40) return 'bg-[#F6C445]/10';
    return 'bg-[#E5564D]/10';
  };

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-lg border border-border overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Grid3X3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">مصفوفة القرارات</h3>
        </div>

        {/* Add Controls */}
        <div className="flex gap-2">
          <div className="flex-1 flex gap-1">
            <Input
              value={newOptionName}
              onChange={(e) => setNewOptionName(e.target.value)}
              placeholder="خيار جديد..."
              className="flex-1 h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
            />
            <Button size="sm" onClick={addOption} className="h-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 flex gap-1">
            <Input
              value={newCriterionName}
              onChange={(e) => setNewCriterionName(e.target.value)}
              placeholder="معيار جديد..."
              className="flex-1 h-8 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addCriterion()}
            />
            <Button size="sm" onClick={addCriterion} className="h-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 overflow-auto p-3">
        {options.length === 0 || criteria.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            أضف خيارات ومعايير للبدء
          </div>
        ) : (
          <table className="w-full border-collapse min-w-max">
            <thead>
              <tr>
                <th className="p-2 text-right text-xs font-medium text-muted-foreground border-b border-border sticky right-0 bg-background z-10">
                  الخيارات
                </th>
                {criteria.map((criterion) => (
                  <th key={criterion.id} className="p-2 text-center border-b border-border min-w-[100px]">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-medium text-foreground">{criterion.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCriterion(criterion.id)}
                          className="h-4 w-4 p-0 opacity-50 hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-[10px] text-muted-foreground">الوزن:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((w) => (
                            <button
                              key={w}
                              onClick={() => updateWeight(criterion.id, w)}
                              className={cn(
                                "w-4 h-4 rounded-full text-[10px] transition-colors",
                                criterion.weight >= w 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted text-muted-foreground hover:bg-muted/80"
                              )}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="p-2 text-center border-b border-border min-w-[80px]">
                  <div className="flex items-center justify-center gap-1 text-xs font-medium text-foreground">
                    <ArrowUpDown className="h-3 w-3" />
                    النتيجة
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedOptions.map((option, idx) => {
                const score = calculateScore(option.id);
                return (
                  <tr key={option.id} className={cn(
                    "transition-colors",
                    idx === 0 && score > 0 && "bg-[#3DBE8B]/5"
                  )}>
                    <td className="p-2 border-b border-border/50 sticky right-0 bg-background z-10">
                      <div className="flex items-center gap-2">
                        {idx === 0 && score > 0 && (
                          <Star className="h-4 w-4 text-[#F6C445] fill-[#F6C445]" />
                        )}
                        <span className="text-sm font-medium text-foreground">{option.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteOption(option.id)}
                          className="h-5 w-5 p-0 opacity-50 hover:opacity-100 mr-auto"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </td>
                    {criteria.map((criterion) => (
                      <td key={criterion.id} className="p-2 border-b border-border/50 text-center">
                        <div className="flex justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((value) => {
                            const currentRating = getRating(option.id, criterion.id);
                            return (
                              <button
                                key={value}
                                onClick={() => updateRating(option.id, criterion.id, value)}
                                className={cn(
                                  "w-6 h-6 rounded transition-all",
                                  currentRating >= value
                                    ? "bg-[#3DA8F5] text-white"
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                )}
                              >
                                <span className="text-xs">{value}</span>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                    <td className={cn(
                      "p-2 border-b border-border/50 text-center",
                      getBgColor(score)
                    )}>
                      <span className={cn("text-sm font-bold", getScoreColor(score))}>
                        {score.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{options.length} خيارات · {criteria.length} معايير</span>
          <span>انقر على الأرقام للتقييم</span>
        </div>
      </div>
    </div>
  );
};
