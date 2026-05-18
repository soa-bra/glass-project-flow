/**
 * Box-Kit — ACT-* action primitives.
 * @specRef Section 6.1 + mem://spec/box-kit-vocabulary
 */
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/** ACT-BTN-01/02 — Primary/secondary action button */
export const ActionButton: React.FC<{
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}> = ({ variant = 'primary', children, onClick, disabled, size = 'sm', icon, className }) => (
  <Button
    variant={variant === 'primary' ? 'default' : 'outline'}
    size={size}
    onClick={onClick}
    disabled={disabled}
    className={cn('gap-2', className)}
  >
    {icon}
    {children}
  </Button>
);

/** ACT-MNU-01 — Action dropdown */
export type ActionMenuItem = { label: string; onSelect: () => void; destructive?: boolean; disabled?: boolean };
export const ActionMenu: React.FC<{ items: ActionMenuItem[]; trigger?: React.ReactNode; className?: string }> = ({
  items,
  trigger,
  className,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {trigger ?? (
        <Button variant="ghost" size="icon" className={cn('h-8 w-8', className)}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {items.map((it, i) => (
        <DropdownMenuItem
          key={i}
          disabled={it.disabled}
          onSelect={it.onSelect}
          className={cn(it.destructive && 'text-destructive focus:text-destructive')}
        >
          {it.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

/** ACT-STS-01 — Status chip (semantic tone) */
type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
const TONE_CLASS: Record<StatusTone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
};
export const StatusChip: React.FC<{ tone?: StatusTone; children: React.ReactNode; className?: string }> = ({
  tone = 'neutral',
  children,
  className,
}) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      TONE_CLASS[tone],
      className
    )}
  >
    {children}
  </span>
);
