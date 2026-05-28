/**
 * Box-Kit — MDL-* modal primitives. Glass surface (sb-modal-shell).
 * @specRef Section 6.2 + mem://style/glassmorphism-aesthetic
 */
import React from 'react';
import { cn } from '@/lib/utils';
import { MODAL_WINDOW_REFERENCE_MAP, type ModalWindowRef } from '@/config/box-kit/action-reference-map';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

function isModalWindowRef(value?: string): value is ModalWindowRef {
  return Boolean(value && value in MODAL_WINDOW_REFERENCE_MAP);
}

/** MDL-WND-* — Standard modal shell */
export const ModalShell: React.FC<{
  componentRef?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ componentRef, open, onOpenChange, title, description, footer, children, size = 'md', className }) => {
  const windowRef = isModalWindowRef(componentRef) ? componentRef : 'MDL-WND-D01';
  const widthCls = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' }[size];
  const modalConfig = MODAL_WINDOW_REFERENCE_MAP[windowRef];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'sb-modal-shell [&_input]:rounded-full [&_textarea]:rounded-[24px] [&_[data-slot=select-trigger]]:rounded-full [&_[role=combobox]]:rounded-full',
          widthCls,
          modalConfig.direction === 'rtl' && 'rtl',
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="py-2">{children}</div>
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
};

/** MDL-HDR-01 — Modal header (re-exports DialogHeader semantic) */
export { DialogHeader as ModalHeader } from '@/components/ui/dialog';
