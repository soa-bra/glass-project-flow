import React from 'react';
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

interface SmartConfirmationDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  proposedActions?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SmartConfirmationDialog: React.FC<SmartConfirmationDialogProps> = ({
  open,
  title = 'تأكيد إجراء مقترح بالذكاء الاصطناعي',
  description = 'راجع الإجراء المقترح قبل تطبيقه على بيانات المشروع.',
  proposedActions = [],
  confirmLabel = 'تطبيق',
  cancelLabel = 'إلغاء',
  onConfirm,
  onCancel,
}) => (
  <AlertDialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onCancel(); }}>
    <AlertDialogContent dir="rtl" className="font-arabic text-right">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      {proposedActions.length > 0 && (
        <ul className="space-y-2 rounded-2xl border border-black/10 bg-white/40 p-3 text-sm text-black/80">
          {proposedActions.map((action, index) => (
            <li key={`${action}-${index}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
              <span>{action}</span>
            </li>
          ))}
        </ul>
      )}
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>{cancelLabel}</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
