import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';

interface PresenceIndicatorsProps {
  projectId: string;
  currentUserId: string;
  className?: string;
}

export const PresenceIndicators: React.FC<PresenceIndicatorsProps> = ({
  projectId,
  currentUserId,
  className = ''
}) => {
  const { collaborators, isConnected } = useCanvasCollaboration({
    projectId,
    userId: currentUserId,
    enable: true
  });

  const onlineCollaborators = collaborators.filter(collab => collab.isOnline);

  if (!isConnected || onlineCollaborators.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Status indicator */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-gray-700">
          {onlineCollaborators.length} متصل
        </span>
      </div>

      {/* User avatars */}
      <div className="flex items-center -space-x-2">
        {onlineCollaborators.slice(0, 5).map((collab, index) => (
          <div
            key={collab.id}
            className="relative"
            style={{ zIndex: 10 - index }}
          >
            <Avatar 
              className="w-8 h-8 border-2 border-white shadow-sm"
              style={{ borderColor: collab.color }}
            >
              <AvatarFallback 
                className="text-white text-xs font-bold"
                style={{ backgroundColor: collab.color }}
              >
                {collab.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        ))}
        
        {/* Show more indicator */}
        {onlineCollaborators.length > 5 && (
          <div className="w-8 h-8 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
            <span className="text-xs font-medium text-gray-600">
              +{onlineCollaborators.length - 5}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};