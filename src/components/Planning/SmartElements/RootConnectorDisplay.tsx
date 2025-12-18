import React, { useState } from 'react';
import { Link2, Sparkles, Edit2, Trash2, Save, X, Wand2, ArrowRight, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { RootConnectorData, AISuggestion } from './RootConnector';

interface RootConnectorDisplayProps {
  data: RootConnectorData;
  onUpdate?: (data: Partial<RootConnectorData>) => void;
  onDelete?: () => void;
}

export const RootConnectorDisplay: React.FC<RootConnectorDisplayProps> = ({
  data,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title || '');
  const [editedDescription, setEditedDescription] = useState(data.description || '');

  const handleSave = () => {
    onUpdate?.({
      title: editedTitle,
      description: editedDescription,
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleAISuggest = async () => {
    setIsLoadingAI(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions: AISuggestion[] = [
      {
        id: `s-${Date.now()}-1`,
        type: 'component',
        title: 'إضافة معالج وسيط',
        description: 'مكون لمعالجة البيانات بين العنصرين',
        confidence: 0.92,
      },
      {
        id: `s-${Date.now()}-2`,
        type: 'connector',
        title: 'تحويل لرابط متحرك',
        description: 'إضافة حركة لتوضيح تدفق البيانات',
        confidence: 0.85,
      },
      {
        id: `s-${Date.now()}-3`,
        type: 'action',
        title: 'إضافة نقطة تحقق',
        description: 'التحقق من صحة البيانات',
        confidence: 0.78,
      },
    ];

    onUpdate?.({ aiSuggestions: suggestions });
    setIsLoadingAI(false);
  };

  const handleInsertSuggestion = (suggestion: AISuggestion) => {
    if (suggestion.type === 'connector') {
      onUpdate?.({ style: 'animated' });
    }
    // Remove inserted suggestion
    if (data.aiSuggestions) {
      onUpdate?.({
        aiSuggestions: data.aiSuggestions.filter(s => s.id !== suggestion.id),
      });
    }
  };

  const getConnectionTypeLabel = (type?: string) => {
    switch (type) {
      case 'component-component': return 'مكون ↔ مكون';
      case 'component-frame': return 'مكون ↔ إطار';
      case 'frame-frame': return 'إطار ↔ إطار';
      case 'part-part': return 'جزء ↔ جزء';
      default: return 'رابط ذكي';
    }
  };

  return (
    <div className="w-full h-full bg-card border border-border rounded-xl p-4 overflow-hidden" dir="rtl">
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{data.title || 'رابط ذكي'}</h3>
                  <span className="text-xs text-muted-foreground">
                    {getConnectionTypeLabel(data.connectionType)}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            {data.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {data.description}
              </p>
            )}

            {/* Connection Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
              <div className="flex-1 text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">A</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {data.startPoint?.anchorPoint || 'بداية'}
                </span>
              </div>
              <div className="flex-1 flex justify-center">
                <motion.div
                  className="h-0.5 w-16 bg-primary/50"
                  animate={{ 
                    background: data.style === 'animated' 
                      ? ['hsl(var(--primary) / 0.3)', 'hsl(var(--primary))', 'hsl(var(--primary) / 0.3)']
                      : 'hsl(var(--primary) / 0.5)'
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="flex-1 text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">B</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {data.endPoint?.anchorPoint || 'نهاية'}
                </span>
              </div>
            </div>

            {/* AI Suggestions */}
            {data.aiSuggestions && data.aiSuggestions.length > 0 && (
              <div className="flex-1 space-y-2 p-3 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10 mb-4 overflow-auto">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-medium text-xs text-primary">اقتراحات ذكية</span>
                </div>
                {data.aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between gap-2 p-2 bg-background/80 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{suggestion.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {suggestion.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-primary font-medium">
                        {Math.round(suggestion.confidence * 100)}%
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleInsertSuggestion(suggestion)}
                        className="h-6 w-6 p-0 text-primary hover:text-primary"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAISuggest}
                disabled={isLoadingAI}
                className="flex-1 text-xs h-9 gap-2"
              >
                {isLoadingAI ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.div>
                    جاري التحليل...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    تحليل AI
                  </>
                )}
              </Button>
              {data.aiSuggestions && data.aiSuggestions.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => data.aiSuggestions?.forEach(handleInsertSuggestion)}
                  className="flex-1 text-xs h-9 gap-2 bg-gradient-to-r from-primary to-accent"
                >
                  <Wand2 className="h-4 w-4" />
                  تحويل الكل
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">تحرير الرابط</span>
            </div>

            <div className="space-y-3 flex-1">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">عنوان الرابط</label>
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="أدخل عنوان الرابط"
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">تعليق توضيحي</label>
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="أضف تعليقاً توضيحياً..."
                  className="text-sm min-h-[100px] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={handleSave}
                className="flex-1 h-9 text-xs gap-2"
              >
                <Save className="h-4 w-4" />
                حفظ
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(data.title || '');
                  setEditedDescription(data.description || '');
                }}
                className="flex-1 h-9 text-xs gap-2"
              >
                <X className="h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RootConnectorDisplay;
