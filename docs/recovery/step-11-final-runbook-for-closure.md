# Step 11 Final Runbook for Closure

- التاريخ: 2026-05-03
- الحالة: Ready for Execution by DB/Infra Owner
- الهدف: إنتاج الأدلة الناقصة لإغلاق الخطوة 11 رسميًا.

## Preconditions
1. اتصال DB حي يعمل.
2. 3 حسابات اختبار متاحة: owner / team_member / unauthorized.
3. ملف probes متاح: `scripts/recovery/permissions-probes.sql`.

## Execution (repeat per role)
1. تسجيل الدخول بالحساب المطلوب.
2. تنفيذ:
   - `psql "$SUPABASE_DB_URL" -f scripts/recovery/permissions-probes.sql > step11_<role>_probes.txt`
3. تعبئة:
   - `docs/recovery/step-11-runtime-evidence-template.md`
4. حفظ الأدلة:
   - SQL output
   - screenshot/session metadata

## Mandatory Assertions
1. owner: outbox/dlq visible.
2. team_member: outbox/dlq denied.
3. unauthorized: denied on protected paths.
4. invoices/projects/tasks scoped visibility behaves as documented.

## Closure Gate
تغلق الخطوة 11 فقط إذا:
1. توفرت أدلة roles الثلاثة.
2. كل assertion أعلاه موثقة pass/fail.
3. تم تحديث `docs/recovery/execution_status_table.md` إلى Done مع روابط الأدلة.
