import React, { useState } from 'react';
import { Link2, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { RootConnectorData, AISuggestion } from './RootConnector';
import { audit } from '@/services/audit';

interface RootConnectorDisplayProps {
  data: RootConnectorData;
  onUpdate?: (data: Partial<RootConnectorData>) => void;
}

export const RootConnectorDisplay: React.FC<RootConnectorDisplayProps> = ({
  data,
  onUpdate,
}) => {
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isPreviewingAI, setIsPreviewingAI] = useState(false);

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
      onUpdate?.({
        style: 'animated',
        status: 'approved',
        source: data.source ?? 'ai',
        aiConfidence: suggestion.confidence,
        requiresReview: false,
        approvedByUser: true,
      });
      void audit({
        resource_type: 'smart_connector',
        action: 'canvas.connector.ai_suggestion.approved',
        resource_id: data.id,
        metadata: {
          suggestionId: suggestion.id,
          suggestionType: suggestion.type,
          aiConfidence: suggestion.confidence,
        },
      });
    }
    // Remove approved suggestion
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">{data.title || 'رابط ذكي'}</h3>
              <span className="text-xs text-muted-foreground">
                {getConnectionTypeLabel(data.connectionType)}
              </span>
            </div>
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

        {data.status === 'suggested' && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            هذا الموصل مقترح من AI ويحتاج اعتماداً بشرياً قبل إنشاء أي علاقة تشغيلية.
          </div>
        )}

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
                    variant="outline"
                    onClick={() => handleInsertSuggestion(suggestion)}
                    className="h-6 px-2 text-[10px] text-primary hover:text-primary"
                  >
                    اعتماد
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
              variant="secondary"
              onClick={() => setIsPreviewingAI((current) => !current)}
              className="flex-1 text-xs h-9 gap-2"
            >
              <Wand2 className="h-4 w-4" />
              {isPreviewingAI ? 'إخفاء المعاينة' : 'معاينة قبل الاعتماد'}
            </Button>
          )}
        </div>

        {isPreviewingAI && data.aiSuggestions && data.aiSuggestions.length > 0 && (
          <div className="mt-3 rounded-lg border border-primary/15 bg-primary/5 p-3 text-xs">
            <p className="mb-2 font-medium text-primary">اختر اقتراحاً واحداً لاعتماده:</p>
            <div className="space-y-2">
              {data.aiSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleInsertSuggestion(suggestion)}
                  className="w-full rounded-md border border-border bg-background p-2 text-right hover:border-primary/40"
                >
                  <span className="block font-medium">{suggestion.title}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    الثقة {Math.round(suggestion.confidence * 100)}% — {suggestion.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RootConnectorDisplay;
