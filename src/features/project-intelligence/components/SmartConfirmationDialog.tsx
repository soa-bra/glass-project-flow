import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { SmartAssistantCommand } from '../hooks/useSmartAssistant';

interface SmartConfirmationDialogProps {
  open: boolean;
  command: SmartAssistantCommand | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SmartConfirmationDialog: React.FC<SmartConfirmationDialogProps> = ({
  open,
  command,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !isLoading) onCancel(); }}>
      <DialogContent className="max-w-xl font-arabic" dir="rtl">
        <DialogHeader className="items-start text-right">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>تأكيد إجراء الذكاء الاصطناعي</DialogTitle>
              <DialogDescription className="mt-2 leading-6">
                لن يتم تنفيذ أي إجراء تشغيلي أو توليد مسودة قابلة للاعتماد قبل موافقتك الصريحة.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {command && (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 text-right">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {command.title}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{command.description}</p>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              سيتم إرسال سياق المشروع المصرّح به فقط إلى بوابة الذكاء الاصطناعي، وستبقى النتائج كمقترحات حتى تعتمدها يدويًا.
            </p>
          </div>
        )}

        <DialogFooter className="flex-row-reverse justify-start gap-2">
          <Button onClick={onConfirm} disabled={isLoading} className="font-arabic">
            {isLoading ? 'جارٍ التنفيذ…' : 'أوافق وشغّل الأمر'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="font-arabic">
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
