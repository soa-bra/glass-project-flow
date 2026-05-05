# Partial Rebuild: Real Invoice Path (Bounded)

## Final Goal
Make the active Invoice UI (`InvoicesTab`) read from and write to Supabase `invoices` directly. Detach it from `mockInvoices` and the `src/lib/prisma.ts` shadow ORM. Do not touch CRM, HR, KB, Expenses, Surveys, Contracts, or any other consumer of `src/lib/prisma.ts`.

## Evidence Gathered

**Active UI surface used by the user**:
- `src/components/DepartmentTabs/Financial/InvoicesTab.tsx` — mounted via `FinancialDashboard` → `FeatureDepartmentPanel`. This is the real user-facing invoice screen.
- It currently uses `useState(mockInvoices)` (local in-memory). No persistence. No Supabase.

**Inactive/legacy UI**:
- `src/components/Financial/InvoicesDashboard.tsx` — uses `invoicesAPI` → `invoiceService` → `prisma` (shadow ORM). Only re-exported in `src/index.ts`, **never mounted** in the running app.
- Will be left untouched (out of scope; not the active path).

**Database (Supabase)**:
- Table `invoices` exists with full schema, RLS scoped to `owner_id = auth.uid()`, currently 0 rows.
- Enum `invoice_status` = `draft | pending | paid | overdue` — perfectly matches the mock UI status values.
- Trigger `generate_invoice_number` auto-fills `invoice_number` if blank.
- NOT NULL columns required for insert: `client_name`, `service_type` (enum, no default), `due_date`, `owner_id`.
- `invoice_items` and `invoice_payments` tables exist but are **not used by the active UI** (the mock has flat `paymentAmount`, `paymentNumber`, `totalPayments`, `paymentPercentage` on the invoice itself). They stay out of scope.

**Field mapping (mock → DB)**:
| Mock field | DB column | Notes |
|---|---|---|
| `id` | `id` (uuid) | DB-generated |
| `client` | `client_name` | |
| `totalAmount` | `total_amount` | |
| `paymentAmount` | `metadata.paymentAmount` | flat number, stored in jsonb metadata to avoid touching invoice_payments |
| `paymentNumber` | `metadata.paymentNumber` | |
| `totalPayments` | `total_payments` | column exists |
| `paymentPercentage` | derived (computed in UI from paymentAmount/totalAmount) | |
| `dueDate` | `due_date` | |
| `projectName` | `metadata.projectName` | no DB column for it |
| `projectId` | `project_id` | only set if it's a real uuid; otherwise null |
| `status` | `status` | enum matches |
| `notes` | `notes` | |

`service_type` is required by DB but absent from mock — default to `'other'` on insert.

## Changes (files to create/edit — Invoice path only)

### NEW: `src/services/invoices/invoices.service.ts`
Thin Supabase service for invoices. Two-way mapping between DB row and the existing `Invoice` shape used by `InvoicesTab`:
- `listInvoices(): Promise<Invoice[]>` — `select * from invoices order by created_at desc`, map rows → mock-shape.
- `createInvoice(input): Promise<Invoice>` — insert with `owner_id` from `supabase.auth.getUser()`, `service_type: 'other'`, store extra fields in `metadata` jsonb. Return mapped row.
- `updateInvoice(id, patch): Promise<Invoice>` — for the existing edit modal.
- Exported helper `dbRowToInvoice(row)` for mapping.

### NEW: `src/hooks/useInvoices.ts`
Tanstack-Query hook trio:
- `useInvoices()` → `useQuery({ queryKey: ['invoices'], queryFn: listInvoices })`.
- `useCreateInvoice()` → `useMutation` with `onSuccess` invalidating `['invoices']` and `onError` toast.
- `useUpdateInvoice()` → same pattern.

### EDIT: `src/components/DepartmentTabs/Financial/InvoicesTab.tsx`
- Remove `import { mockInvoices } from './data'` and the `useState(mockInvoices)`.
- Replace with `const { data: invoices = [], isLoading, error } = useInvoices();`.
- Replace `setInvoices(prev => [newInvoice, ...prev])` in `handleCreateInvoice` with `createInvoice.mutateAsync(...)`.
- Same for `handleEditInvoice` → `updateInvoice.mutateAsync`.
- Add visible loading state and an error state (Arabic message) so failures aren't silent.
- Keep all visual styling/structure intact — no UI redesign.

### NOT TOUCHED (explicit)
- `src/lib/prisma.ts` — left as-is (still used by CRM/HR/KB/Expense/Contract/Surveys).
- `src/modules/invoice/invoice.service.ts`, `src/api/invoices/invoices.ts`, `src/components/Financial/InvoicesDashboard.tsx` — legacy inactive path; left as-is to honor scope rule "don't delete prisma if other parts depend on it; just detach Invoice".
- `mockInvoices` constant in `data.ts` — left in file (other mock data lives there); just no longer imported by `InvoicesTab`.
- `invoice_items`, `invoice_payments` tables — out of scope for the active UI's basic flow.

## Verification Plan
1. Read `invoices` table count before/after a create from the UI to prove persistence.
2. Reload the page → verify created invoice still shows.
3. Trigger a failure (e.g., logged-out state) → verify toast shows clearly.
4. Confirm via `rg` that `InvoicesTab.tsx` no longer imports `mockInvoices` or anything from `@/lib/prisma`.

## Stop Conditions Honored
If during implementation it turns out `InvoicesTab` cannot be detached without dragging in CRM/Project resolution (e.g., a hard FK to a `clients` table that doesn't exist), I will stop and emit a Blocked report — not expand scope.

## Final Output
After execution I will return the 5-section report exactly as you specified: Final Goal Status, Acceptance Criteria Matrix, Changes Made, Evidence (code + DB rows + runtime), Final Executive Judgment.
