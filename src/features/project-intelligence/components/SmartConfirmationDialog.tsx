import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { DataLinkImpact } from '../types/data-link.types';
import { LinkIndicator } from './LinkIndicator';

export interface SmartConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  impacts?: DataLinkImpact[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export function SmartConfirmationDialog({
  open,
  title,
  description,
  impacts = [],
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  onConfirm,
  onOpenChange,
}: SmartConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {impacts.length > 0 && (
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="text-sm font-medium text-foreground">التأثيرات بين الأقسام</p>
            <div className="flex flex-wrap gap-2">
              {impacts.map((impact) => (
                <LinkIndicator key={impact.link.id} impact={impact} />
              ))}
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
