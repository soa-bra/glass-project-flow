# Step 10 Checklist — DB Live Snapshot Validation

- الحالة: Open
- الغرض: إغلاق المتبقي من الخطوة 10 عبر مقارنة baseline المستندي مع قاعدة البيانات الفعلية.

## Commands to run in DB environment
1. استخراج DDL فعلي:
   - `pg_dump --schema-only --no-owner --no-privileges <connection> > live-schema.sql`
2. استخراج الجداول:
   - `psql <connection> -c "select tablename from pg_tables where schemaname='public' order by 1;"`
3. استخراج سياسات RLS:
   - `psql <connection> -c "select schemaname, tablename, policyname from pg_policies where schemaname='public' order by tablename, policyname;"`

## Validation points
1. مطابقة الجداول الأساسية مع `docs/recovery/step-10-baseline-schema.md`.
2. مطابقة العلاقات الحرجة (projects->departments, tasks->projects).
3. مطابقة وجود عمود `invoices.metadata`.
4. توثيق أي فرق كـ drift في backlog الإصلاحي.
