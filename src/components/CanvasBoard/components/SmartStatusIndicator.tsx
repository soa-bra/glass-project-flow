
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Wifi, 
  WifiOff, 
  Users, 
  Eye, 
  Save, 
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartStatusIndicatorProps {
  isOnline?: boolean;
  collaborators?: number;
  viewers?: number;
  lastSaved?: Date;
  hasUnsavedChanges?: boolean;
  performanceScore?: number;
  aiSuggestions?: number;
}

export const SmartStatusIndicator: React.FC<SmartStatusIndicatorProps> = ({
  isOnline = true,
  collaborators = 0,
  viewers = 0,
  lastSaved,
  hasUnsavedChanges = false,
  performanceScore = 95,
  aiSuggestions = 0
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLastSavedText = () => {
    if (!lastSaved) return 'لم يتم الحفظ';
    
    const diff = Math.floor((currentTime.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return `حُفظ منذ ${diff}ث`;
    if (diff < 3600) return `حُفظ منذ ${Math.floor(diff / 60)}د`;
    return `حُفظ منذ ${Math.floor(diff / 3600)}س`;
  };

  const getPerformanceColor = () => {
    if (performanceScore >= 90) return 'text-green-600 bg-green-100';
    if (performanceScore >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      {/* Main status bar */}
      <div className="flex items-center gap-2 p-2 bg-background/95 backdrop-blur-lg rounded-lg border shadow-sm animate-fade-in">
        {/* Connection status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600 animate-pulse" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-muted-foreground">
            {isOnline ? 'متصل' : 'غير متصل'}
          </span>
        </div>

        {/* Collaborators */}
        {collaborators > 0 && (
          <>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">{collaborators}</span>
            </div>
          </>
        )}

        {/* Viewers */}
        {viewers > 0 && (
          <>
            <div className="w-px h-4 bg-border"></div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-xs text-muted-foreground">{viewers}</span>
            </div>
          </>
        )}

        {/* Save status */}
        <div className="w-px h-4 bg-border"></div>
        <div className="flex items-center gap-1">
          {hasUnsavedChanges ? (
            <AlertCircle className="w-4 h-4 text-orange-600 animate-pulse" />
          ) : (
            <CheckCircle className="w-4 h-4 text-green-600" />
          )}
          <span className="text-xs text-muted-foreground">
            {getLastSavedText()}
          </span>
        </div>
      </div>

      {/* Performance indicator */}
      <div className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-all duration-300",
        getPerformanceColor(),
        "animate-slide-in-right"
      )}>
        <Zap className="w-3 h-3" />
        <span>الأداء: {performanceScore}%</span>
      </div>

      {/* AI suggestions indicator */}
      {aiSuggestions > 0 && (
        <div className="flex items-center gap-2 px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs animate-bounce">
          <Sparkles className="w-3 h-3" />
          <span>{aiSuggestions} اقتراح ذكي</span>
        </div>
      )}

      {/* Unsaved changes warning */}
      {hasUnsavedChanges && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-md animate-pulse">
          <Clock className="w-4 h-4 text-orange-600" />
          <span className="text-xs text-orange-800">تغييرات غير محفوظة</span>
          <Button size="sm" variant="outline" className="h-6 text-xs">
            حفظ الآن
          </Button>
        </div>
      )}
    </div>
  );
};
