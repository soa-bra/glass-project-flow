/**
 * Invoices Service — bounded Supabase data layer for the active Invoice path.
 * Replaces the shadow-ORM (`src/lib/prisma.ts`) for `InvoicesTab` only.
 *
 * Scope: read/create/update of `public.invoices`. Does NOT touch
 * `invoice_items` or `invoice_payments` (out of scope for current UI).
 */
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { Invoice as UiInvoice } from '@/components/DepartmentTabs/Financial/types';

type DbInvoiceRow = Database['public']['Tables']['invoices']['Row'];
type DbInvoiceStatus = Database['public']['Enums']['invoice_status'];

const UI_TO_DB_STATUS: Record<string, DbInvoiceStatus> = {
  draft: 'draft',
  pending: 'pending',
  paid: 'paid',
  overdue: 'overdue',
};

const isUuid = (v: string | undefined | null): v is string =>
  !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export interface CreateInvoiceInput {
  client: string;
  projectName: string;
  totalAmount: number;
  paymentAmount: number;
  dueDate: string;
  status: string;
  notes?: string;
  projectId?: string;
}

export interface UpdateInvoiceInput extends CreateInvoiceInput {}

/** Map a DB row into the legacy UI Invoice shape used by InvoicesTab. */
export function dbRowToInvoice(row: DbInvoiceRow): UiInvoice {
  const meta = (row.metadata ?? {}) as {
    paymentAmount?: number;
    paymentNumber?: number;
    projectName?: string;
  };
  const totalAmount = Number(row.total_amount ?? 0);
  const paymentAmount = Number(meta.paymentAmount ?? 0);
  const totalPayments = Number(row.total_payments ?? 1);
  const paymentNumber = Number(meta.paymentNumber ?? (paymentAmount > 0 ? 1 : 0));
  const paymentPercentage = totalAmount > 0 ? (paymentAmount / totalAmount) * 100 : 0;

  return {
    id: row.invoice_number || row.id,
    client: row.client_name,
    totalAmount,
    paymentAmount,
    paymentNumber,
    totalPayments,
    paymentPercentage,
    status: row.status,
    dueDate: row.due_date,
    projectName: meta.projectName ?? '',
    projectId: row.project_id ?? '',
  };
}

export async function listInvoices(): Promise<UiInvoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(dbRowToInvoice);
}

export async function createInvoice(input: CreateInvoiceInput): Promise<UiInvoice> {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error('يجب تسجيل الدخول لإنشاء فاتورة');

  const status = UI_TO_DB_STATUS[input.status] ?? 'draft';

  const insertPayload = {
    owner_id: auth.user.id,
    client_name: input.client,
    service_type: 'other' as Database['public']['Enums']['service_type'],
    total_amount: input.totalAmount,
    subtotal: input.totalAmount,
    tax_amount: 0,
    due_date: input.dueDate,
    status,
    notes: input.notes ?? null,
    project_id: isUuid(input.projectId) ? input.projectId : null,
    invoice_number: '', // trigger generate_invoice_number fills this
    metadata: {
      paymentAmount: input.paymentAmount,
      paymentNumber: input.paymentAmount > 0 ? 1 : 0,
      projectName: input.projectName,
    },
  };

  const { data, error } = await supabase
    .from('invoices')
    .insert(insertPayload)
    .select('*')
    .single();
  if (error) throw error;
  return dbRowToInvoice(data);
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput,
): Promise<UiInvoice> {
  const status = UI_TO_DB_STATUS[input.status] ?? 'draft';

  // `id` from UI may be either uuid or invoice_number — resolve to row id.
  const lookup = isUuid(id)
    ? supabase.from('invoices').select('id, metadata').eq('id', id).maybeSingle()
    : supabase.from('invoices').select('id, metadata').eq('invoice_number', id).maybeSingle();
  const { data: existing, error: lookupError } = await lookup;
  if (lookupError) throw lookupError;
  if (!existing) throw new Error('لم يتم العثور على الفاتورة');

  const prevMeta = (existing.metadata ?? {}) as Record<string, unknown>;

  const updatePayload = {
    client_name: input.client,
    total_amount: input.totalAmount,
    subtotal: input.totalAmount,
    due_date: input.dueDate,
    status,
    notes: input.notes ?? null,
    project_id: isUuid(input.projectId) ? input.projectId : null,
    metadata: {
      ...prevMeta,
      paymentAmount: input.paymentAmount,
      paymentNumber: input.paymentAmount > 0 ? 1 : 0,
      projectName: input.projectName,
    },
  };

  const { data, error } = await supabase
    .from('invoices')
    .update(updatePayload)
    .eq('id', existing.id)
    .select('*')
    .single();
  if (error) throw error;
  return dbRowToInvoice(data);
}
