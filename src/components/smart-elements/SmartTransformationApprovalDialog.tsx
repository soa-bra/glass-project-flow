import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { SmartElementType } from '@/types/smart-elements';

export interface TransformationSensitivity {
  isSensitive: boolean;
  score: number;
  reasons: string[];
}

export interface SmartTransformationApprovalRequest {
  targetType: SmartElementType;
  selectedElements: unknown[];
  prompt?: string;
  sensitivity: TransformationSensitivity;
}

interface SmartTransformationApprovalDialogProps {
  request: SmartTransformationApprovalRequest | null;
  onApprove: (approvalReason: string) => void;
  onCancel: () => void;
}

const TARGET_TYPE_LABELS: Partial<Record<SmartElementType, string>> = {
  thinking_board: 'لوحة تفكير',
  kanban: 'لوحة كانبان',
  voting: 'تصويت',
  brainstorming: 'عصف ذهني',
  timeline: 'خط زمني',
  decisions_matrix: 'مصفوفة قرارات',
  gantt: 'مخطط جانت',
  interactive_sheet: 'جدول تفاعلي',
  mind_map: 'خريطة ذهنية',
  project_card: 'بطاقة مشروع',
  task_card: 'بطاقة مهمة',
  finance_card: 'بطاقة مالية',
  csr_card: 'بطاقة مسؤولية اجتماعية',
  crm_card: 'بطاقة CRM',
  root_connector: 'موصل جذري',
};

function summarizeSourceElement(element: unknown, index: number): string {
  if (typeof element === 'string') return element;
  if (!element || typeof element !== 'object') return `عنصر ${index + 1}`;

  const record = element as Record<string, unknown>;
  const title = record.title || record.label || record.name || record.content || record.id;
  const type = record.smartType || record.type;

  if (title && type) return `${String(title).slice(0, 80)} (${String(type)})`;
  if (title) return String(title).slice(0, 100);
  if (type) return `عنصر من نوع ${String(type)}`;

  return `عنصر ${index + 1}`;
}

export function SmartTransformationApprovalDialog({
  request,
  onApprove,
  onCancel,
}: SmartTransformationApprovalDialogProps) {
  const [approvalReason, setApprovalReason] = useState('');

  useEffect(() => {
    if (request) {
      setApprovalReason('تمت مراجعة ملخص التحويل وأسباب الحساسية، وأوافق على تنفيذ التحويل.');
    }
  }, [request]);

  const sourceItems = useMemo(() => {
    if (!request?.selectedElements) return [];
    return request.selectedElements.map(summarizeSourceElement);
  }, [request?.selectedElements]);

  const targetLabel = request
    ? TARGET_TYPE_LABELS[request.targetType] || request.targetType
    : '';

  const canApprove = approvalReason.trim().length >= 8;

  return (
    <Dialog open={Boolean(request)} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogContent className="max-w-2xl font-arabic" dir="rtl">
        <DialogHeader className="items-start gap-2 text-right">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldAlert size={22} />
            </span>
            <div>
              <DialogTitle>مراجعة تحويل حساس</DialogTitle>
              <DialogDescription>
                يجب تأكيد الاعتماد البشري قبل إرسال الموافقة إلى Edge Function وتنفيذ التحويل.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {request && (
          <div className="space-y-4 text-right text-sm text-[#0B0F12]">
            <section className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <div className="mb-3 flex items-center gap-2 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                ملخص التحويل
              </div>
              <dl className="grid gap-2 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-black/55">نوع الهدف</dt>
                  <dd className="font-semibold">{targetLabel}</dd>
                </div>
                <div>
                  <dt className="text-xs text-black/55">عدد العناصر المصدرية</dt>
                  <dd className="font-semibold">{sourceItems.length}</dd>
                </div>
                {request.prompt && (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-black/55">تعليمات التحويل</dt>
                    <dd className="mt-1 rounded-xl bg-black/5 p-3 leading-6">{request.prompt}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white/70 p-4">
              <div className="mb-3 font-semibold">العناصر المصدرية</div>
              <ul className="max-h-36 space-y-2 overflow-y-auto pr-1">
                {sourceItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-black/5 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-amber-300/70 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                <AlertTriangle size={16} />
                سبب الحساسية من Edge Function
              </div>
              <div className="mb-2 text-xs text-amber-900/75">
                درجة الحساسية: {Math.round(request.sensitivity.score * 100)}%
              </div>
              <ul className="list-inside list-disc space-y-1 text-amber-950">
                {request.sensitivity.reasons.length > 0
                  ? request.sensitivity.reasons.map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)
                  : <li>تم تصنيف التحويل كحساس بواسطة سياسة Edge Function.</li>}
              </ul>
            </section>

            <section className="space-y-2">
              <label className="font-semibold" htmlFor="approval-reason">
                سبب الاعتماد
              </label>
              <Textarea
                id="approval-reason"
                value={approvalReason}
                onChange={(event) => setApprovalReason(event.target.value)}
                className="min-h-[96px] rounded-2xl text-sm"
                placeholder="اكتب سبب اعتماد هذا التحويل..."
              />
            </section>
          </div>
        )}

        <DialogFooter className="flex-row-reverse justify-start">
          <Button
            type="button"
            onClick={() => onApprove(approvalReason.trim())}
            disabled={!canApprove}
            className="rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700"
          >
            تأكيد الاعتماد والتنفيذ
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="rounded-full px-5">
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
