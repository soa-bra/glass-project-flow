import React from 'react';
import { cn } from '@/lib/utils';
import { UnifiedSystemBadge } from './UnifiedSystemBadge';
import { UnifiedSystemButton } from './UnifiedSystemButton';
import { COLORS, SPACING } from '@/components/shared/design-system/constants';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface TableAction {
  label: string;
  onClick: (row: any) => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

interface UnifiedSystemTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: TableAction[];
  className?: string;
  emptyMessage?: string;
}

export const UnifiedSystemTable: React.FC<UnifiedSystemTableProps> = ({
  columns,
  data,
  actions,
  className = '',
  emptyMessage = 'لا توجد بيانات'
}) => {
  if (data.length === 0) {
    return (
      <div className={cn(
        COLORS.CARD_BACKGROUND,
        'p-8 rounded-3xl border border-black/10 text-center',
        className
      )}>
        <p className="text-black/50 font-arabic">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn(
      COLORS.CARD_BACKGROUND,
      'rounded-3xl border border-black/10 overflow-hidden',
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-black/5">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-4 text-right text-sm font-semibold text-black font-arabic',
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-4 text-center text-sm font-semibold text-black font-arabic">
                  الإجراءات
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-black/5 hover:bg-black/2 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-6 py-4 text-sm text-black font-arabic',
                      column.className
                    )}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {actions.map((action, actionIndex) => (
                        <UnifiedSystemButton
                          key={actionIndex}
                          variant={action.variant || 'outline'}
                          size="sm"
                          onClick={() => action.onClick(row)}
                          icon={action.icon}
                        >
                          {action.label}
                        </UnifiedSystemButton>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};