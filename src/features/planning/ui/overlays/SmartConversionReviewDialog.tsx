import React, { useEffect, useMemo, useState } from 'react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/central';
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

function getSuggestedLinkedProjectId(suggestedData: Record<string, unknown>): string | undefined {
  const value = suggestedData.linked_project_id ?? suggestedData.linkedProjectId ?? suggestedData.project_id;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function SmartConversionReviewDialog({
  open,
  payload,
  onOpenChange,
  onApproved,
}: SmartConversionReviewDialogProps) {
  const [approvalNote, setApprovalNote] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects();

  const requiresProjectSelection = Boolean(
    payload?.targetEntityType === 'task' && !getSuggestedLinkedProjectId(payload.suggestedData),
  );

  const suggestedDataPreview = useMemo(
    () => formatSuggestedData(payload?.suggestedData ?? {}),
    [payload?.suggestedData],
  );

  useEffect(() => {
    setSelectedProjectId('');
  }, [payload, open]);

  const handleApprove = async () => {
    if (!payload || isApproving) return;

    if (requiresProjectSelection && !selectedProjectId) {
      toast.error('اختر مشروعًا لربط المهمة قبل اعتماد التحويل');
      return;
    }

    setIsApproving(true);

    const suggestedData = requiresProjectSelection
      ? { ...payload.suggestedData, linked_project_id: selectedProjectId }
      : payload.suggestedData;

    try {
      const result = await approveSmartConversion({
        ...payload,
        suggestedData,
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
      setSelectedProjectId('');
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
    setSelectedProjectId('');
  };

  const isApproveDisabled = !payload || isApproving || (requiresProjectSelection && !selectedProjectId);

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

            {requiresProjectSelection ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <label className="mb-2 block text-sm font-semibold" htmlFor="smart-conversion-linked-project">
                  المشروع المرتبط بالمهمة <span className="text-red-600">*</span>
                </label>
                <Select
                  value={selectedProjectId}
                  onValueChange={setSelectedProjectId}
                  disabled={isApproving || isLoadingProjects || projects.length === 0}
                >
                  <SelectTrigger id="smart-conversion-linked-project" aria-label="اختر مشروعًا لربط المهمة">
                    <SelectValue
                      placeholder={isLoadingProjects ? 'جاري تحميل المشاريع...' : 'اختر مشروعًا لربط المهمة'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-amber-800">
                  لم تقترح AI مشروعًا لهذه المهمة. يجب اختيار مشروع حتى يتم إنشاء المهمة وربطها بشكل صحيح.
                </p>
                {!isLoadingProjects && projects.length === 0 ? (
                  <p className="mt-1 text-xs text-red-700">لا توجد مشاريع متاحة للاختيار.</p>
                ) : null}
              </div>
            ) : null}

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
          <Button onClick={handleApprove} disabled={isApproveDisabled}>
            {isApproving ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="ml-2 h-4 w-4" />}
            اعتماد وإنشاء السجل
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
