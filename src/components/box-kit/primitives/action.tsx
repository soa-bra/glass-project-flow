/**
 * Box-Kit — ACT-* action primitives.
 * @specRef Section 6.1 + mem://spec/box-kit-vocabulary
 */
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ACTION_BUTTON_REFERENCE_MAP,
  ACTION_MENU_REFERENCE_MAP,
  ACTION_STATUS_REFERENCE_MAP,
  type ActionButtonRef,
  type ActionMenuRef,
  type ActionStatusRef,
  normalizeActionButtonRef,
  resolveLegacyActionButtonRef,
  resolveLegacyActionMenuRef,
  resolveLegacyActionStatusRef,
} from '@/config/box-kit/action-reference-map';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type LegacyButtonVariant = 'primary' | 'secondary';
type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

function isActionMenuRef(value?: string): value is ActionMenuRef {
  return Boolean(value && value in ACTION_MENU_REFERENCE_MAP);
}

function isActionStatusRef(value?: string): value is ActionStatusRef {
  return Boolean(value && value in ACTION_STATUS_REFERENCE_MAP);
}

function getButtonIntentClass(family: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef]['family']) {
  switch (family) {
    case 'primary':
      return 'border border-transparent bg-sb-ink text-sb-white hover:bg-sb-ink/90 hover:shadow-md active:bg-sb-ink/80';
    case 'secondary':
      return 'border border-sb-ink bg-transparent text-sb-ink hover:bg-sb-ink/[0.04] active:bg-sb-ink/[0.08]';
    case 'primarySensitiveAction':
      return 'border border-transparent bg-sb-accent-red text-sb-white hover:bg-sb-accent-red/90 active:bg-sb-accent-red/80';
    case 'secondarySensitiveAction':
      return 'border border-sb-accent-red bg-transparent text-sb-accent-red hover:bg-sb-accent-red/[0.06] active:bg-sb-accent-red/[0.10]';
  }
}

function getButtonFrameClass(config: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef]) {
  if (config.content === 'iconOnly') {
    const byRank = {
      1: 'h-8 w-8',
      2: 'h-10 w-10',
      3: 'h-11 w-11',
      4: 'h-12 w-12',
    } as const;
    return byRank[config.sizeRank];
  }

  if (config.content === 'textOnly') {
    const byRank = {
      1: 'h-10 min-w-[104px] px-4 text-sm',
      2: 'h-9 min-w-[96px] px-3.5 text-sm',
      3: 'h-11 min-w-[112px] px-5 text-sm',
      4: 'h-12 min-w-[128px] px-6 text-base',
    } as const;
    return byRank[config.sizeRank];
  }

  const byRank = {
    1: 'h-10 min-w-[116px] gap-2 px-4 text-sm',
    2: 'h-9 min-w-[104px] gap-2 px-3.5 text-sm',
    3: 'h-11 min-w-[124px] gap-2.5 px-5 text-sm',
    4: 'h-12 min-w-[140px] gap-3 px-6 text-base',
  } as const;
  return byRank[config.sizeRank];
}

function getButtonIconClass(config: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef]) {
  if (config.content === 'iconOnly') {
    const byRank = {
      1: 'h-4 w-4',
      2: 'h-[18px] w-[18px]',
      3: 'h-5 w-5',
      4: 'h-[22px] w-[22px]',
    } as const;
    return byRank[config.sizeRank];
  }

  const byRank = {
    1: 'h-[18px] w-[18px]',
    2: 'h-4 w-4',
    3: 'h-5 w-5',
    4: 'h-[22px] w-[22px]',
  } as const;
  return byRank[config.sizeRank];
}

function renderActionButtonBody(options: {
  config: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef];
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const { config, icon, children } = options;
  const iconClass = getButtonIconClass(config);
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string; 'aria-hidden'?: boolean }>, {
        className: cn(iconClass, (icon.props as { className?: string }).className),
        'aria-hidden': true,
      })
    : icon;

  if (config.content === 'iconOnly') return renderedIcon;
  if (config.content === 'textOnly') return <span className="truncate">{children}</span>;

  return (
    <>
      {renderedIcon}
      <span className="truncate">{children}</span>
    </>
  );
}

function BaseActionButtonControl(props: {
  buttonRef: ActionButtonRef;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}) {
  const { buttonRef, disabled, className, icon, children, onClick, type = 'button', ariaLabel } = props;
  const config = ACTION_BUTTON_REFERENCE_MAP[buttonRef];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex w-fit max-w-full items-center justify-center whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sb-accent-blue/50 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        config.content === 'iconOnly' ? 'p-0 shrink-0' : '',
        getButtonIntentClass(config.family),
        getButtonFrameClass(config),
        className,
      )}
    >
      {renderActionButtonBody({ config, icon, children })}
    </button>
  );
}

export const ActionButton: React.FC<{
  componentRef?: string;
  variant?: LegacyButtonVariant;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  destructive?: boolean;
  confirmTitle?: string;
  confirmDescription?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({
  componentRef,
  variant = 'primary',
  children,
  onClick,
  disabled,
  icon,
  className,
  destructive = false,
  confirmTitle = 'تأكيد الإجراء',
  confirmDescription = 'هذا إجراء حساس. هل أنت متأكد أنك تبي تكمل؟',
  type = 'button',
}) => {
  const buttonRef =
    normalizeActionButtonRef(componentRef) ??
    resolveLegacyActionButtonRef({
      variant,
      destructive,
      hasIcon: Boolean(icon),
      hasChildren: React.Children.count(children) > 0,
    });
  const config = ACTION_BUTTON_REFERENCE_MAP[buttonRef];
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handlePrimaryClick = () => {
    if (disabled) return;
    if (config.sensitive) {
      setConfirmOpen(true);
      return;
    }
    onClick?.();
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    onClick?.();
  };

  return (
    <>
      <BaseActionButtonControl
        buttonRef={buttonRef}
        disabled={disabled}
        onClick={handlePrimaryClick}
        icon={icon}
        className={className}
        type={type}
        ariaLabel={config.content === 'iconOnly' && typeof children === 'string' ? children : undefined}
      >
        {children}
      </BaseActionButtonControl>

      {config.sensitive ? (
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{confirmTitle}</DialogTitle>
              <DialogDescription>{confirmDescription}</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3">
              <BaseActionButtonControl buttonRef="ACT-BTN-P02-1" onClick={() => setConfirmOpen(false)}>
                رجوع
              </BaseActionButtonControl>
              <BaseActionButtonControl buttonRef="ACT-BTN-PSA02-1" onClick={handleConfirm}>
                تأكيد
              </BaseActionButtonControl>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
};

export type ActionMenuItem = {
  label: string;
  onSelect: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export const ActionMenu: React.FC<{
  componentRef?: string;
  items: ActionMenuItem[];
  trigger?: React.ReactNode;
  className?: string;
}> = ({ componentRef, items, trigger, className }) => {
  const menuRef = isActionMenuRef(componentRef) ? componentRef : resolveLegacyActionMenuRef('solid');
  const menuConfig = ACTION_MENU_REFERENCE_MAP[menuRef];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <BaseActionButtonControl
            buttonRef="ACT-BTN-S03-1"
            className={className}
            ariaLabel="المزيد من الإجراءات"
            icon={<MoreHorizontal />}
          />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={5} surface={menuConfig.surface} className="w-48 font-arabic">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={`${item.label}-${index}`}
            disabled={item.disabled}
            onSelect={item.onSelect}
            className={cn(item.destructive && 'text-[#EF4444] hover:!bg-red-50 hover:!text-[#EF4444] focus:!bg-red-50 focus:!text-[#EF4444]')}
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const StatusChip: React.FC<{
  componentRef?: string;
  tone?: StatusTone;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}> = ({ componentRef, tone = 'neutral', size = 'md', children, className, style, onClick }) => {
  const statusRef = isActionStatusRef(componentRef) ? componentRef : resolveLegacyActionStatusRef(tone);
  const statusConfig = ACTION_STATUS_REFERENCE_MAP[statusRef];

  const sizeClass = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        statusConfig.style === 'outline' ? 'border' : '',
        onClick && 'cursor-pointer',
        sizeClass,
        className,
      )}
      style={{
        backgroundColor: statusConfig.background,
        color: statusConfig.foreground,
        borderColor: 'border' in statusConfig ? (statusConfig as { border: string }).border : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
