import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Scissors, Clipboard, Trash2 } from 'lucide-react';

interface ActionItem {
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  disabled: boolean;
  shortcut: string;
}

interface SelectionActionsProps {
  hasSelection: boolean;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onDelete: () => void;
}

export const SelectionActions: React.FC<SelectionActionsProps> = ({
  hasSelection,
  onCopy,
  onCut,
  onPaste,
  onDelete
}) => {
  const actions: ActionItem[] = [
    {
      label: 'نسخ',
      icon: Copy,
      action: onCopy,
      disabled: !hasSelection,
      shortcut: 'Ctrl+C'
    },
    {
      label: 'قص',
      icon: Scissors,
      action: onCut,
      disabled: !hasSelection,
      shortcut: 'Ctrl+X'
    },
    {
      label: 'لصق',
      icon: Clipboard,
      action: onPaste,
      disabled: false,
      shortcut: 'Ctrl+V'
    },
    {
      label: 'حذف',
      icon: Trash2,
      action: onDelete,
      disabled: !hasSelection,
      shortcut: 'Delete'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium font-arabic">عمليات أساسية</label>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => {
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