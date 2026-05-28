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
          'sb-modal-shell',
          '[&_input]:min-h-[56px] [&_input]:rounded-[24px] [&_input]:border-black/20 [&_input]:bg-white/30 [&_input]:px-4 [&_input]:py-3 [&_input]:text-right [&_input]:text-base [&_input]:font-normal [&_input]:text-black [&_input]:placeholder:font-normal [&_input]:placeholder:text-[#8A8A8A] [&_input]:focus:border-black [&_input]:focus:ring-0',
          '[&_textarea]:min-h-[180px] [&_textarea]:rounded-[24px] [&_textarea]:border-black/20 [&_textarea]:bg-white/30 [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-right [&_textarea]:text-base [&_textarea]:font-normal [&_textarea]:text-black [&_textarea]:placeholder:font-normal [&_textarea]:placeholder:text-[#8A8A8A] [&_textarea]:focus:border-black [&_textarea]:focus:ring-0',
          '[&_[data-slot=select-trigger]]:min-h-[56px] [&_[data-slot=select-trigger]]:rounded-[24px] [&_[data-slot=select-trigger]]:border-black/20 [&_[data-slot=select-trigger]]:bg-white/30 [&_[data-slot=select-trigger]]:px-4 [&_[data-slot=select-trigger]]:py-3',
          '[&_[role=combobox]]:min-h-[56px] [&_[role=combobox]]:rounded-[24px] [&_[role=combobox]]:border-black/20 [&_[role=combobox]]:bg-white/30 [&_[role=combobox]]:px-4 [&_[role=combobox]]:py-3 [&_[role=combobox]]:text-right [&_[role=combobox]]:text-base [&_[role=combobox]]:font-normal [&_[role=combobox]]:text-black [&_[role=combobox]]:focus:border-black [&_[role=combobox]]:focus:ring-0',
          '[&_button[data-field-trigger=true]]:min-h-[56px] [&_button[data-field-trigger=true]]:rounded-[24px] [&_button[data-field-trigger=true]]:border-black/20 [&_button[data-field-trigger=true]]:bg-white/30 [&_button[data-field-trigger=true]]:px-4 [&_button[data-field-trigger=true]]:py-3',
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
