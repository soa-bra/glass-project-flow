# Step 06 Artifact — Legacy Code Isolation

- التاريخ: 2026-05-02
- الحالة: Done
- المالك: Frontend Platform Owner
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 6)

## What was implemented
1. تفعيل منع lint صريح للمسارات legacy (error-level) في `eslint.config.js`.
2. إضافة حظر استيراد للمسارات:
   1. `components/Planning/*`
   2. `modules/invoice/invoice.service`
   3. `lib/prisma`
   4. `components/Financial/InvoicesDashboard`
3. تنظيف root barrel من exports legacy في `src/index.ts`:
   1. إزالة `export * from './lib/prisma'`
   2. إزالة `export * from './modules/invoice/invoice.service'`
   3. إزالة `export { InvoicesDashboard } from './components/Financial/InvoicesDashboard'`

## Legacy Isolation Evidence
1. Policy gate موجود في `eslint.config.js` (no-restricted-imports: error).
2. root barrel أصبح Active-only في `src/index.ts`.
3. مرجع الحوكمة invoice legacy: `docs/adr/ADR-001-active-invoice-path.md`.

## Residual Legacy Presence (Quarantined)
1. قد تبقى ملفات legacy فعليًا داخل المستودع لأغراض تتبع/ترحيل.
2. هذه الملفات معزولة حوكمياً وتقنياً عبر:
   1. منع الاستيراد في lint policy.
   2. إزالة التصدير من root barrel.

## Acceptance for Step 06
1. وسم وعزل legacy paths: متحقق.
2. منع استيراد جديد من legacy paths: متحقق.
3. تنظيف exports/barrels القديمة المؤثرة: متحقق.

## Closure Record
1. تم عزل legacy code رسميًا على مستوى policy + barrel exposure.
2. أي محاولة رجوع للمسارات legacy ستفشل عبر lint gate.
3. أُغلقت الخطوة 6.
