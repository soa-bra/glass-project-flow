/**
 * DataBoundSpecTab — wires SpecTabScaffold to spec_tab_items CRUD.
 *
 * Provides:
 *  - live list fetch by (departmentCode, tabKey)
 *  - create / edit / delete dialogs
 *  - selected-item detail panel
 *  - optional static KPIs (computed externally; aggregate KPIs may be added later)
 *
 * @specRef DepartmentsWorkspace-tabs-boxes-backend.md (boxes 1–4 per tab)
 */
import React, { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import {
  SpecTabScaffold,
  type SpecKPI,
  type SpecAction,
} from './SpecTabScaffold';
import {
  useSpecTabItems,
  useSpecTabItemMutations,
  type SpecTabItemRow,
} from '@/hooks/spec-tab-items/useSpecTabItems';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export interface DetailFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  /** Form input kind. Defaults to 'text'. */
  kind?: 'text' | 'textarea';
}

interface Props {
  departmentCode: string;
  tabKey: string;
  intro: { title: string; description: string; accent?: string };
  kpis: SpecKPI[];
  detailFields: DetailFieldDef[];
  filterPlaceholder?: string;
  /** Static helpers (e.g., export). Primary CRUD actions are appended automatically. */
  extraActions?: SpecAction[];
}

interface FormState {
  title: string;
  subtitle: string;
  status: string;
  meta: string;
  details: Record<string, string>;
}

const emptyForm = (fields: DetailFieldDef[]): FormState => ({
  title: '',
  subtitle: '',
  status: '',
  meta: '',
  details: Object.fromEntries(fields.map((f) => [f.key, ''])),
});

const fromRow = (row: SpecTabItemRow, fields: DetailFieldDef[]): FormState => {
  const raw = (row.details ?? {}) as Record<string, unknown>;
  return {
    title: row.title ?? '',
    subtitle: row.subtitle ?? '',
    status: row.status ?? '',
    meta: row.meta ?? '',
    details: Object.fromEntries(
      fields.map((f) => [f.key, typeof raw[f.key] === 'string' ? (raw[f.key] as string) : '']),
    ),
  };
};

export const DataBoundSpecTab: React.FC<Props> = ({
  departmentCode,
  tabKey,
  intro,
  kpis,
  detailFields,
  filterPlaceholder,
  extraActions = [],
}) => {
  const scope = { departmentCode, tabKey };
  const { data: rows = [], isLoading } = useSpecTabItems(scope);
  const { create, update, remove } = useSpecTabItemMutations(scope);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => emptyForm(detailFields));
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        subtitle: r.subtitle ?? undefined,
        status: r.status ?? undefined,
        meta: r.meta ?? undefined,
      })),
    [rows],
  );

  const effectiveSelectedId = selectedId && rows.some((r) => r.id === selectedId)
    ? selectedId
    : rows[0]?.id ?? null;
  const selectedRow = rows.find((r) => r.id === effectiveSelectedId) ?? null;

  const renderedDetailFields = selectedRow
    ? detailFields.map((f) => {
        const raw = (selectedRow.details ?? {}) as Record<string, unknown>;
        const v = raw[f.key];
        return { label: f.label, value: typeof v === 'string' && v.trim() ? v : '—' };
      })
    : detailFields.map((f) => ({ label: f.label, value: '—' }));

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm(detailFields));
    setDialogOpen(true);
  };

  const openEdit = () => {
    if (!selectedRow) return;
    setEditingId(selectedRow.id);
    setForm(fromRow(selectedRow, detailFields));
    setDialogOpen(true);
  };

  const submit = async () => {
    if (!form.title.trim()) return;
    const payload = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      status: form.status.trim() || null,
      meta: form.meta.trim() || null,
      details: form.details,
    };
    if (editingId) {
      await update.mutateAsync({ id: editingId, patch: payload });
    } else {
      const row = await create.mutateAsync(payload);
      setSelectedId(row.id);
    }
    setDialogOpen(false);
  };

  const actions: SpecAction[] = [
    { label: editingId ? 'تعديل' : 'إضافة عنصر', icon: <Plus className="h-4 w-4" />, onClick: openCreate },
    { label: 'تعديل المحدد', icon: <Pencil className="h-4 w-4" />, onClick: openEdit },
    {
      label: 'حذف',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'secondary',
      onClick: () => effectiveSelectedId && setConfirmDeleteId(effectiveSelectedId),
    },
    ...extraActions,
  ];

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center py-2 text-xs text-[rgba(11,15,18,0.5)] font-arabic">
          <Loader2 className="h-3.5 w-3.5 me-2 animate-spin" /> تحميل البيانات…
        </div>
      )}

      <SpecTabScaffold
        intro={intro}
        kpis={kpis}
        items={items}
        detailFields={renderedDetailFields}
        actions={actions}
        filterPlaceholder={filterPlaceholder}
        selectedId={effectiveSelectedId}
        onSelectItem={setSelectedId}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-arabic">
              {editingId ? 'تعديل عنصر' : 'عنصر جديد'}
            </DialogTitle>
            <DialogDescription className="font-arabic">
              {intro.title} — املأ الحقول ثم احفظ.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Field label="العنوان">
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="العنوان"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="الوصف الفرعي">
                <Input
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
              </Field>
              <Field label="الحالة">
                <Input
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="بيانات إضافية (Meta)">
              <Input
                value={form.meta}
                onChange={(e) => setForm((f) => ({ ...f, meta: e.target.value }))}
              />
            </Field>
            {detailFields.map((f) => (
              <Field key={f.key} label={f.label}>
                {f.kind === 'textarea' ? (
                  <Textarea
                    value={form.details[f.key] ?? ''}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, details: { ...s.details, [f.key]: e.target.value } }))
                    }
                    placeholder={f.placeholder}
                  />
                ) : (
                  <Input
                    value={form.details[f.key] ?? ''}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, details: { ...s.details, [f.key]: e.target.value } }))
                    }
                    placeholder={f.placeholder}
                  />
                )}
              </Field>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)} className="font-arabic">
              إلغاء
            </Button>
            <Button
              onClick={submit}
              disabled={!form.title.trim() || create.isPending || update.isPending}
              className="font-arabic"
            >
              {(create.isPending || update.isPending) && (
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              )}
              حفظ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!confirmDeleteId}
        onOpenChange={(o) => !o && setConfirmDeleteId(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">
              هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              className="font-arabic"
              onClick={async () => {
                if (confirmDeleteId) {
                  await remove.mutateAsync(confirmDeleteId);
                  setConfirmDeleteId(null);
                  if (selectedId === confirmDeleteId) setSelectedId(null);
                }
              }}
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/* ----- helpers ----- */

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-arabic text-[rgba(11,15,18,0.7)]">{label}</Label>
    {children}
  </div>
);

