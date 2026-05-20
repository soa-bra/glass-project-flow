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
  resolveLegacyActionButtonRef,
  resolveLegacyActionMenuRef,
  resolveLegacyActionStatusRef,
} from '@/config/box-kit/action-reference-map';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type LegacyButtonVariant = 'primary' | 'secondary';
type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

function isActionButtonRef(value?: string): value is ActionButtonRef {
  return Boolean(value && value in ACTION_BUTTON_REFERENCE_MAP);
}

function isActionMenuRef(value?: string): value is ActionMenuRef {
  return Boolean(value && value in ACTION_MENU_REFERENCE_MAP);
}

function isActionStatusRef(value?: string): value is ActionStatusRef {
  return Boolean(value && value in ACTION_STATUS_REFERENCE_MAP);
}

function getButtonIntentClass(family: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef]['family']) {
  switch (family) {
    case 'primary':
      return 'border border-transparent bg-black text-white hover:bg-black/90 active:bg-black/80';
    case 'secondary':
      return 'border-2 border-black bg-transparent text-black hover:bg-black/[0.04] active:bg-black/[0.08]';
    case 'primarySensitiveAction':
      return 'border border-transparent bg-[#EF4444] text-black hover:bg-[#EF4444]/90 active:bg-[#EF4444]/80';
    case 'secondarySensitiveAction':
      return 'border-2 border-[#EF4444] bg-transparent text-[#EF4444] hover:bg-[#EF4444]/[0.06] active:bg-[#EF4444]/[0.10]';
  }
}

function getButtonFrameClass(size: 'sm' | 'default' | 'lg', content: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef]['content']) {
  const bySize = {
    sm: {
      iconOnly: 'h-10 w-10',
      textOnly: 'h-10 px-4 text-sm',
      iconAndText: 'h-10 gap-2 px-4 text-sm',
    },
    default: {
      iconOnly: 'h-11 w-11',
      textOnly: 'h-11 px-5 text-sm',
      iconAndText: 'h-11 gap-2.5 px-5 text-sm',
    },
    lg: {
      iconOnly: 'h-12 w-12',
      textOnly: 'h-12 px-6 text-base',
      iconAndText: 'h-12 gap-3 px-6 text-base',
    },
  } as const;

  return bySize[size][content];
}

function getButtonIconClass(size: 'sm' | 'default' | 'lg') {
  return {
    sm: 'h-[18px] w-[18px]',
    default: 'h-5 w-5',
    lg: 'h-[22px] w-[22px]',
  }[size];
}

function renderActionButtonBody(options: {
  content: (typeof ACTION_BUTTON_REFERENCE_MAP)[ActionButtonRef]['content'];
  icon?: React.ReactNode;
  children?: React.ReactNode;
  size: 'sm' | 'default' | 'lg';
}) {
  const { content, icon, children, size } = options;
  const iconClass = getButtonIconClass(size);
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
        className: cn(iconClass, (icon.props as { className?: string }).className),
        'aria-hidden': true,
      })
    : icon;

  if (content === 'iconOnly') return renderedIcon;
  if (content === 'textOnly') return <span className="truncate">{children}</span>;

  return (
    <>
      {renderedIcon}
      <span className="truncate">{children}</span>
    </>
  );
}

function BaseActionButtonControl(props: {
  buttonRef: ActionButtonRef;
  size: 'sm' | 'default' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}) {
  const { buttonRef, size, disabled, className, icon, children, onClick, type = 'button', ariaLabel } = props;
  const config = ACTION_BUTTON_REFERENCE_MAP[buttonRef];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-full font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.2,0,0,1)]',
        'hover:-translate-y-px active:translate-y-0 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        config.content === 'iconOnly' ? 'p-0' : '',
        getButtonIntentClass(config.family),
        getButtonFrameClass(size, config.content),
        className,
      )}
    >
      {renderActionButtonBody({ content: config.content, icon, children, size })}
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
}> = ({
  componentRef,
  variant = 'primary',
  children,
  onClick,
  disabled,
  size = 'sm',
  icon,
  className,
  destructive = false,
  confirmTitle = 'تأكيد الإجراء',
  confirmDescription = 'هذا إجراء حساس. هل أنت متأكد أنك تبي تكمل؟',
}) => {
  const buttonRef = isActionButtonRef(componentRef)
    ? componentRef
    : resolveLegacyActionButtonRef({
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
        size={size}
        disabled={disabled}
        onClick={handlePrimaryClick}
        icon={icon}
        className={className}
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
              <BaseActionButtonControl buttonRef="ACT-BTN-P02" size="default" onClick={() => setConfirmOpen(false)}>
                رجوع
              </BaseActionButtonControl>
              <BaseActionButtonControl buttonRef="ACT-BTN-PSA02" size="default" onClick={handleConfirm}>
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
          <BaseActionButtonControl buttonRef="ACT-BTN-S03" size="sm" className={className} ariaLabel="المزيد من الإجراءات">
            <MoreHorizontal className="h-4 w-4" />
          </BaseActionButtonControl>
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
        borderColor: statusConfig.border,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
