# Step 08 Runtime Handoff Checklist

- التاريخ: 2026-05-04
- الهدف: فك حظر Step 08 عبر تشغيل workflows في بيئة حيّة وتعبئة الأدلة.

## Required Environment
1. بيئة staging أو local stack متكامل (UI + API + Auth + DB).
2. حسابات اختبار فعالة: `owner`, `team_member`, `unauthorized`.
3. وصول لمراقبة السجلات (browser console/network + backend logs).

## Execution Checklist
1. Login flow
   - نفذ تسجيل دخول مستخدم صالح.
   - وثّق النتيجة في `docs/recovery/evidence/step08-login-check.txt`.
2. Project create/read
   - أنشئ مشروعًا واختبر قراءته.
   - وثّق في `docs/recovery/evidence/step08-project-cr-check.txt`.
3. Task create/read/update
   - أنشئ مهمة ثم حدّثها ثم اقرأ الحالة النهائية.
   - وثّق في `docs/recovery/evidence/step08-task-cru-check.txt`.
4. Invoice create/read/update
   - أنشئ فاتورة ثم حدّثها ثم تحقق من القراءة.
   - وثّق في `docs/recovery/evidence/step08-invoice-cru-check.txt`.
5. Department shell read
   - نفذ قراءة department shell من المسار النشط.
   - وثّق في `docs/recovery/evidence/step08-department-shell-read-check.txt`.

## Acceptance Gate
1. جميع الملفات الخمسة تحتوي Timestamp + Actor + Expected + Actual + Verdict.
2. لا توجد حالة Pending.
3. أي FAIL مرتبط بعنصر backlog إصلاحي قبل إغلاق الخطوة.

## Closure Update
عند استكمال القائمة:
1. تحديث `docs/recovery/step-08-runtime-verification.md` بنتائج Pass/Fail النهائية.
2. تحديث `docs/recovery/execution_status_table.md` وتغيير Step 8 إلى Done.
