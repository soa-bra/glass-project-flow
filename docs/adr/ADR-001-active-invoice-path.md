# ADR-001: Active Invoice Path and Legacy Invoice Path Classification

- **Status:** Accepted
- **Date:** 2026-05-01
- **Decision Makers:** Engineering

## Context
A code-path audit confirmed two invoice implementations:

1. **Active path (mounted and reachable):**
   - `InvoicesTab` → `useInvoices` → `services/invoices/invoices.service.ts` → Supabase
2. **Legacy path (not mounted in active route chain):**
   - `components/Financial/InvoicesDashboard.tsx` → `api/invoices/invoices.ts` → `modules/invoice/invoice.service.ts` → `lib/prisma.ts`

To avoid split behavior, data inconsistency, and accidental regressions, invoice development must target a single source of truth.

## Decision
The active invoice path is:

`InvoicesTab → useInvoices → services/invoices → Supabase`

The `InvoicesDashboard/API/modules/prisma` invoice path is classified as **dead legacy** and must not be used for new work.

## Rules
1. Do **not** import `src/api/invoices` in active UI.
2. Do **not** import `src/modules/invoice` in active UI.
3. Do **not** import `src/lib/prisma.ts` in production paths.
4. Any future invoice work must extend `services/invoices`.
5. Legacy path can be deleted later after a no-import check.

## Consequences
- New invoice features and fixes must be implemented only in `src/services/invoices/*` and consumers (`hooks/components`) wired to it.
- Legacy invoice files remain temporarily for compatibility/reference only.
- Cleanup phase must include a repository-wide no-import verification before deletion.

## Verification
Suggested guard checks:

- No active imports of:
  - `@/api/invoices/invoices`
  - `@/modules/invoice/invoice.service`
  - `@/lib/prisma`
- Active invoice UI imports:
  - `@/hooks/useInvoices`
  - `@/services/invoices/invoices.service`

## Follow-up
- Add CI lint/check step to block legacy invoice imports in production UI paths.
- Remove dead legacy invoice files after no-import check passes.
