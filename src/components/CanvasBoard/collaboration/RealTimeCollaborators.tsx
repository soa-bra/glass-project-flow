import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface Collaborator {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  cursor?: { x: number; y: number };
  lastActivity?: Date;
  isTyping?: boolean;
  currentElement?: string;
}

interface RealTimeCollaboratorsProps {
  collaborators: Collaborator[];
  currentUserId: string;
  maxVisible?: number;
}

export const RealTimeCollaborators: React.FC<RealTimeCollaboratorsProps> = ({
  collaborators,
  currentUserId,
  maxVisible = 5
}) => {
  const activeCollaborators = collaborators.filter(c => c.isOnline && c.id !== currentUserId);
  const visibleCollaborators = activeCollaborators.slice(0, maxVisible);
  const hiddenCount = Math.max(0, activeCollaborators.length - maxVisible);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getActivityStatus = (collaborator: Collaborator) => {
    if (collaborator.isTyping) {
      return collaborator.currentElement ? 'يكتب في عنصر' : 'يكتب...';
    }
    if (collaborator.lastActivity) {
      return `نشط ${formatDistanceToNow(collaborator.lastActivity, { 
        addSuffix: true, 
        locale: ar 
      })}`;
    }
    return 'نشط الآن';
  };

  if (activeCollaborators.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-muted"></div>
        لا يوجد متعاونون نشطون
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {visibleCollaborators.map((collaborator) => (
            <Tooltip key={collaborator.id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar 
                    className="w-8 h-8 border-2 transition-all hover:scale-110"
                    style={{ 
                      borderColor: collaborator.isTyping ? collaborator.color : 'hsl(var(--background))',
                      boxShadow: `0 0 0 2px ${collaborator.color}`
                    }}
                  >
                    <AvatarFallback 
                      className="text-xs font-semibold text-white"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {getInitials(collaborator.name)}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Online indicator */}
                  <div 
                    className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background"
                    style={{ backgroundColor: collaborator.color }}
                  />
                  
                  {/* Typing indicator */}
                  {collaborator.isTyping && (
                    <div className="absolute -top-1 -right-1 w-3 h-3">
                      <div className="w-full h-full rounded-full animate-pulse bg-amber-400" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-right">
                <div className="space-y-1">
                  <p className="font-semibold">{collaborator.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {getActivityStatus(collaborator)}
                  </p>
                  {collaborator.cursor && (
                    <p className="text-xs text-muted-foreground">
                      المؤشر: ({Math.round(collaborator.cursor.x)}, {Math.round(collaborator.cursor.y)})
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {hiddenCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="text-xs">
                +{hiddenCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{hiddenCount} متعاونون آخرون</p>
            </TooltipContent>
          </Tooltip>
        )}

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: '#10b981' }}
          />
          <span>{activeCollaborators.length} نشط</span>
        </div>
      </div>
    </TooltipProvider>
  );
};