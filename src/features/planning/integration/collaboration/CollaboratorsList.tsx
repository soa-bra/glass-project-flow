/**
 * CollaboratorsList Component - Sprint 8
 * قائمة المتعاونين المتصلين
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Circle } from 'lucide-react';
import { CollaboratorPresence } from '@/core/collaborationEngine';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CollaboratorsListProps {
  collaborators: CollaboratorPresence[];
  isConnected: boolean;
  maxVisible?: number;
}

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({
  collaborators,
  isConnected,
  maxVisible = 5,
}) => {
  const visibleCollaborators = collaborators.slice(0, maxVisible);
  const hiddenCount = collaborators.length - maxVisible;

  return (
    <div className="flex items-center gap-2">
      {/* مؤشر الاتصال */}
      <div className="flex items-center gap-1.5">
        <Circle
          className={`h-2 w-2 ${isConnected ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
        />
        <span className="text-xs text-muted-foreground">
          {isConnected ? 'متصل' : 'غير متصل'}
        </span>
      </div>

      {/* عدد المتعاونين */}
      {collaborators.length > 0 && (
        <>
          <div className="h-4 w-px bg-border" />
          
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {collaborators.length}
            </span>
          </div>
        </>
      )}

      {/* صور المتعاونين */}
      <div className="flex -space-x-2 rtl:space-x-reverse">
        <AnimatePresence mode="popLayout">
          {visibleCollaborators.map((collaborator, index) => (
            <TooltipProvider key={collaborator.odId}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {collaborator.avatar ? (
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="h-7 w-7 rounded-full border-2 border-background"
                        style={{ borderColor: collaborator.color }}
                      />
                    ) : (
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-xs font-medium text-white"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    {/* مؤشر الاتصال */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-green-500"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {collaborator.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </AnimatePresence>

        {/* عدد المخفيين */}
        {hiddenCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                  +{hiddenCount}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {collaborators.slice(maxVisible).map(c => c.name).join(', ')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
