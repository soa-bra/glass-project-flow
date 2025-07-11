
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Users, Eye, Clock, AlertTriangle, Zap, Brain } from 'lucide-react';

interface SmartStatusIndicatorProps {
  isOnline: boolean;
  collaborators: number;
  viewers: number;
  lastSaved: Date;
  hasUnsavedChanges: boolean;
  performanceScore: number;
  aiSuggestions: number;
}

export const SmartStatusIndicator: React.FC<SmartStatusIndicatorProps> = ({
  isOnline,
  collaborators,
  viewers,
  lastSaved,
  hasUnsavedChanges,
  performanceScore,
  aiSuggestions
}) => {
  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    return `منذ ${hours} ساعة`;
  };

  return (
    <Card className="fixed top-4 left-4 bg-background/95 backdrop-blur-sm border shadow-lg z-40 animate-fade-in">
      <div className="flex items-center gap-3 p-3">
        {/* Connection Status */}
        <div className="flex items-center gap-1">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs text-muted-foreground">
            {isOnline ? 'متصل' : 'غير متصل'}
          </span>
        </div>

        <span className="text-muted-foreground">•</span>

        {/* Collaboration */}
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-muted-foreground">
            {collaborators}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-purple-600" />
          <span className="text-xs text-muted-foreground">
            {viewers}
          </span>
        </div>

        <span className="text-muted-foreground">•</span>

        {/* Save Status */}
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-muted-foreground">
            {formatTime(lastSaved)}
          </span>
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              غير محفوظ
            </Badge>
          )}
        </div>

        <span className="text-muted-foreground">•</span>

        {/* Performance */}
        <div className="flex items-center gap-1">
          <Zap className={`w-4 h-4 ${getPerformanceColor(performanceScore)}`} />
          <span className={`text-xs ${getPerformanceColor(performanceScore)}`}>
            {performanceScore}%
          </span>
        </div>

        {/* AI Suggestions */}
        {aiSuggestions > 0 && (
          <>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Brain className="w-4 h-4 text-blue-600" />
              <Badge variant="outline" className="text-xs px-1 py-0">
                {aiSuggestions}
              </Badge>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
