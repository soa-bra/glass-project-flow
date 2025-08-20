import React from 'react';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface WF01ButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
  canvasInfo: {
    totalElements: number;
    totalConnections: number;
    estimatedMappable: number;
  };
  validation: {
    isValid: boolean;
    issues: string[];
  };
}

export function WF01Button({
  onGenerate,
  isGenerating,
  canvasInfo,
  validation
}: WF01ButtonProps) {
  const { totalElements, totalConnections, estimatedMappable } = canvasInfo;
  const { isValid, issues } = validation;

  const getStatusIcon = () => {
    if (isGenerating) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (!isValid) return <AlertCircle className="w-4 h-4 text-destructive" />;
    if (estimatedMappable > 0) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Wand2 className="w-4 h-4" />;
  };

  const getButtonVariant = () => {
    if (!isValid) return "outline" as const;
    if (estimatedMappable > 0) return "default" as const;
    return "secondary" as const;
  };

  const getTooltipContent = () => {
    if (isGenerating) return "جاري تحليل العناصر وإنشاء المشروع...";
    
    if (!isValid) {
      return (
        <div className="space-y-2 text-right">
          <div className="font-medium text-destructive">مشاكل في اللوح:</div>
          <ul className="space-y-1 text-xs">
            {issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="space-y-2 text-right">
        <div className="font-medium">معلومات اللوح:</div>
        <div className="space-y-1 text-xs">
          <div>العناصر: {totalElements}</div>
          <div>الروابط: {totalConnections}</div>
          <div>قابل للتطبيق: {estimatedMappable}</div>
        </div>
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Button
              onClick={onGenerate}
              disabled={isGenerating || totalElements === 0}
              variant={getButtonVariant()}
              size="sm"
              className="relative"
            >
              {getStatusIcon()}
              <span className="mr-2">
                {isGenerating ? 'جاري الإنشاء...' : 'Generate Project (WF-01)'}
              </span>
              
              {/* Success Rate Indicator */}
              {estimatedMappable > 0 && !isGenerating && (
                <Badge 
                  variant="secondary" 
                  className="mr-1 h-5 text-xs bg-green-100 text-green-700"
                >
                  ~{Math.round((estimatedMappable / (totalElements + totalConnections)) * 100)}%
                </Badge>
              )}
            </Button>

            {/* Element Count Badge */}
            {totalElements > 0 && (
              <Badge variant="outline" className="text-xs">
                {totalElements + totalConnections} عنصر
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}