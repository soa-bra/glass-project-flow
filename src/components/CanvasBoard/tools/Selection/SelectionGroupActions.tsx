import React from 'react';
import { Button } from '@/components/ui/button';
import { Group, Ungroup, Lock, Unlock } from 'lucide-react';

interface GroupAction {
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  disabled: boolean;
}

interface SelectionGroupActionsProps {
  hasSelection: boolean;
  multipleSelection: boolean;
  onGroup: () => void;
  onUngroup: () => void;
  onLock: () => void;
  onUnlock: () => void;
}

export const SelectionGroupActions: React.FC<SelectionGroupActionsProps> = ({
  hasSelection,
  multipleSelection,
  onGroup,
  onUngroup,
  onLock,
  onUnlock
}) => {
  const groupActions: GroupAction[] = [
    {
      label: 'تجميع',
      icon: Group,
      action: onGroup,
      disabled: !multipleSelection
    },
    {
      label: 'إلغاء التجميع',
      icon: Ungroup,
      action: onUngroup,
      disabled: !hasSelection
    },
    {
      label: 'قفل',
      icon: Lock,
      action: onLock,
      disabled: !hasSelection
    },
    {
      label: 'إلغاء القفل',
      icon: Unlock,
      action: onUnlock,
      disabled: !hasSelection
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium font-arabic">تجميع وقفل</label>
      <div className="grid grid-cols-2 gap-2">
        {groupActions.map(action => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              onClick={action.action}
              disabled={action.disabled}
              variant="outline"
              size="sm"
              className="text-xs font-arabic"
            >
              <Icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};