/**
 * Box-Kit — MDL-* modal primitives. Glass surface (sb-modal-shell).
 * @specRef Section 6.2 + mem://style/glassmorphism-aesthetic
 */
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/** MDL-WND-01 — Standard modal shell */
export const ModalShell: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ open, onOpenChange, title, description, footer, children, size = 'md' }) => {
  const widthCls = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' }[size];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sb-modal-shell ${widthCls}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-2">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
};

/** MDL-HDR-01 — Modal header (re-exports DialogHeader semantic) */
export { DialogHeader as ModalHeader } from '@/components/ui/dialog';
