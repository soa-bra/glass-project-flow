# Step 07 Artifact — معايير التطوير الجديدة (Policy)

- التاريخ: 2026-05-02
- الحالة: Done
- المالك: Engineering Manager
- المرجع الحاكم: `docs/recovery_execution_package.md` (الخطوة 7)

## Policy Rules (Mandatory)
1. لا يسمح بأي Feature جديدة بدون:
   1. Source of Truth واضح (مرجع الخطوة 4).
   2. DoD واضح (مرجع الخطوة 3).
   3. Active path واضح (مرجع الخطوة 5).
2. يمنع في المسار النشط:
   1. mock data كمصدر حقيقة.
   2. local state كمصدر حقيقة دائم.
   3. service موازية لنفس domain بدون قرار معماري رسمي.
3. النمط الإلزامي: `UI -> hook -> service -> Supabase`.

## Enforcement Mechanism
1. PR Checklist إلزامي (ملف: `.github/pull_request_template.md`).
2. أي PR لا يملأ بنود الامتثال الثلاثة يُعتبر غير صالح للمراجعة.
3. أي خرق يوسم Policy Breach ويعاد إلى صاحب التغيير.

## Required PR Evidence Fields
1. Source of Truth Reference (file/section).
2. DoD Row/Component Reference.
3. Active Path Reference.
4. Confirmation: no mock/local-truth/parallel-service introduced.

## Acceptance for Step 07
1. وجود policy مكتوبة داخل المستودع.
2. وجود أداة إنفاذ عملية (PR template/checklist).
3. ربط policy صراحة بخطوات 3/4/5.

## Closure Record
1. تم اعتماد policy موحدة ومخزنة داخل المستودع.
2. تم تفعيل آلية إنفاذ مباشرة عبر قالب PR.
3. أُغلقت الخطوة 7.
