import React, { useMemo, useState } from 'react';
import { CheckCircle2, Loader2, ShieldCheck, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  approveSmartConversion,
  type SmartConversionPayload,
  type SmartConversionResult,
  type SmartConversionTargetEntityType,
} from '@/features/planning/services/smartConversion.service';

const TARGET_LABELS: Record<SmartConversionTargetEntityType, string> = {
  project: 'مشروع',
  task: 'مهمة',
  financial_budget: 'ميزانية مالية',
  financial_transaction: 'حركة مالية',
};

interface SmartConversionReviewDialogProps {
  open: boolean;
  payload: SmartConversionPayload | null;
  onOpenChange: (open: boolean) => void;
  onApproved?: (result: SmartConversionResult) => void;
}

function formatSuggestedData(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}

export function SmartConversionReviewDialog({
  open,
  payload,
  onOpenChange,
  onApproved,
}: SmartConversionReviewDialogProps) {
  const [approvalNote, setApprovalNote] = useState('');
  const [isApproving, setIsApproving] = useState(false);

  const suggestedDataPreview = useMemo(
    () => formatSuggestedData(payload?.suggestedData ?? {}),
    [payload?.suggestedData],
  );

  const handleApprove = async () => {
    if (!payload || isApproving) return;
    setIsApproving(true);

    try {
      const result = await approveSmartConversion({
        ...payload,
        approval: {
          ...payload.approval,
          approved: true,
          approvedAt: new Date().toISOString(),
          note: approvalNote.trim() || undefined,
        },
      });
      toast.success('تم اعتماد التحويل وإنشاء السجل التنفيذي');
      onApproved?.(result);
      onOpenChange(false);
      setApprovalNote('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر اعتماد التحويل';
      toast.error('فشل اعتماد التحويل', { description: message });
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = () => {
    toast.info('تم إلغاء التحويل قبل إنشاء أي سجل تنفيذي');
    onOpenChange(false);
    setApprovalNote('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>مراجعة التحويل الذكي قبل التنفيذ</DialogTitle>
              <DialogDescription>
                لن يتم إنشاء أي سجل فعلي في جداول المشروع إلا بعد اعتمادك لهذا الطلب.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {payload ? (
          <div className="space-y-4">
            <div className="grid gap-3 rounded-lg border bg-muted/30 p-4 text-sm md:grid-cols-3">
              <div>
                <div className="text-muted-foreground">نوع السجل المستهدف</div>
                <div className="mt-1 font-semibold">{TARGET_LABELS[payload.targetEntityType]}</div>
              </div>
              <div>
                <div className="text-muted-foreground">عدد عناصر المصدر</div>
                <div className="mt-1 font-semibold">{payload.sourceElementIds.length}</div>
              </div>
              <div>
                <div className="text-muted-foreground">لوحة العمل</div>
                <div className="mt-1 truncate font-mono text-xs">{payload.boardId}</div>
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">بيانات AI المقترحة</div>
              <pre className="max-h-72 overflow-auto rounded-lg border bg-slate-950 p-4 text-left text-xs text-slate-100" dir="ltr">
                {suggestedDataPreview}
              </pre>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold" htmlFor="smart-conversion-approval-note">
                ملاحظة الاعتماد (اختياري)
              </label>
              <Textarea
                id="smart-conversion-approval-note"
                value={approvalNote}
                onChange={(event) => setApprovalNote(event.target.value)}
                placeholder="أضف سبب الاعتماد أو تعديلات مطلوبة لاحقاً..."
                disabled={isApproving}
              />
            </div>
          </div>
        ) : null}

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" onClick={handleReject} disabled={isApproving}>
            <XCircle className="ml-2 h-4 w-4" />
            رفض / إلغاء
          </Button>
          <Button onClick={handleApprove} disabled={!payload || isApproving}>
            {isApproving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="ml-2 h-4 w-4" />}
            اعتماد وإنشاء السجل
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
