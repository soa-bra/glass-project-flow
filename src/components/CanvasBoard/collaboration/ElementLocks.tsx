import React from 'react';
import { Lock, User } from 'lucide-react';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';

interface ElementLocksProps {
  projectId: string;
  currentUserId: string;
  elementId: string;
  isSelected: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onLockElement?: (elementId: string) => void;
  onUnlockElement?: (elementId: string) => void;
}

export const ElementLocks: React.FC<ElementLocksProps> = ({
  projectId,
  currentUserId,
  elementId,
  isSelected,
  position,
  size,
  onLockElement,
  onUnlockElement
}) => {
  const { 
    collaborators,
    isElementLockedByOther,
    isElementLockedByMe,
    lockElement,
    unlockElement,
    lockedElements
  } = useCanvasCollaboration({
    projectId,
    userId: currentUserId,
    enable: true
  });

  const isLockedByOther = isElementLockedByOther(elementId);
  const isLockedByMe = isElementLockedByMe(elementId);
  const isLocked = lockedElements.includes(elementId);

  // Find who has locked this element
  const lockedBy = collaborators.find(collab => 
    // This would be determined by the actual lock data from the collaboration system
    isLockedByOther && collab.id !== currentUserId
  );

  React.useEffect(() => {
    if (isSelected && !isLocked) {
      lockElement(elementId);
      onLockElement?.(elementId);
    } else if (!isSelected && isLockedByMe) {
      unlockElement(elementId);
      onUnlockElement?.(elementId);
    }
  }, [isSelected, elementId, isLocked, isLockedByMe, lockElement, unlockElement, onLockElement, onUnlockElement]);

  if (!isLocked) return null;

  return (
    <>
      {/* Lock indicator overlay */}
      {isLockedByOther && (
        <div
          className="absolute inset-0 border-2 border-dashed pointer-events-none z-30"
          style={{
            borderColor: lockedBy?.color || '#ef4444',
            backgroundColor: `${lockedBy?.color || '#ef4444'}10`
          }}
        >
          {/* Lock icon */}
          <div
            className="absolute -top-8 -left-1 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg whitespace-nowrap"
            style={{ backgroundColor: lockedBy?.color || '#ef4444' }}
          >
            <Lock className="w-3 h-3" />
            <span>{lockedBy?.name || 'مستخدم آخر'}</span>
          </div>
        </div>
      )}

      {/* My lock indicator */}
      {isLockedByMe && isSelected && (
        <div className="absolute -top-8 -left-1 flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-md text-xs font-medium shadow-lg whitespace-nowrap">
          <User className="w-3 h-3" />
          <span>أنت تقوم بالتحرير</span>
        </div>
      )}
    </>
  );
};