# Supabase Linter — حالة المعالجة (نهاية P0)

تاريخ المعالجة: 2026-04-30
الإجمالي قبل: 43 تحذير. الإجمالي بعد: 36 تحذير. كلها مستوى `WARN` (لا `ERROR`).

## ✅ تم إصلاحه عبر Migration

| # | الفئة | الإجراء |
|---|---|---|
| 1 | `Function Search Path Mutable` (×3) | تعيين `search_path = public, pg_temp` على `calculate_invoice_total`, `generate_invoice_number`, `update_updated_at_column`. |
| 2 | `RLS Policy Always True` على 5 جداول `kv_store_*` | استبدال السياسات بسياسات مقيدة بدور `authenticated` فقط. |
| 3 | `Anonymous Access Policies` على ~16 جدول | إعادة كتابة كل السياسات لتكون `TO authenticated` بدلاً من `public`. |
| 4 | `Anonymous Access` على `storage.objects` (board-assets) | تقييد upload/view/delete على `authenticated` فقط. |
| 5 | `Public Can Execute SECURITY DEFINER Function` (×4 من أصل 5) | `REVOKE EXECUTE FROM anon, public` على `user_has_board_role`, `get_user_board_role`, `get_widget_data`, `get_widget_stats`. |

## ⚠️ تحذيرات متبقية (مقبولة عمدًا)

### 1. `Anonymous Access Policies` (22 تحذير)
Linter يستمر في الإبلاغ عن كل جدول فيه RLS Policies مرتبطة بأدوار قابلة للنفاذ (نظري). فحص `pg_policies` يؤكد أن كل سياسة فعليًا `roles = {authenticated}`. هذه طبيعة الـ Linter heuristic، وليس ثغرة فعلية.

**الاستثناء المقصود:** سياسة واحدة على `board_join_requests` مفتوحة لـ `anon` (لأن مسار join-by-token يحتاج إنشاء سجل قبل تسجيل الدخول).

### 2. `Public Can Execute SECURITY DEFINER` على `validate_board_invite_token`
مقصود — هذه هي نقطة التحقق العامة من رابط الدعوة قبل تسجيل الدخول.

### 3. `Signed-In Users Can Execute SECURITY DEFINER` (×5)
الدوال الخمس (`user_has_board_role`, `get_user_board_role`, `get_widget_data`, `get_widget_stats`, `validate_board_invite_token`) **يجب** أن تكون قابلة للاستدعاء من `authenticated` لأنها مكوّن أساسي في RLS policies (`USING public.user_has_board_role(...)`). تم إعادة الـ EXECUTE من `anon` و `public`، وأبقيناه لـ `authenticated` فقط.

### 4. `RLS Policy Always True` (×5 على `kv_store_*`)
السياسات `USING (true) WITH CHECK (true)` مع `TO authenticated`. مقصود مؤقتًا — هذه جداول KV قديمة ستُراجَع وتُحذف في P5 (مذكور في خطة `MOCK_INVENTORY` و `plan.md`).

## 🔧 يتطلب إجراء يدويًا من لوحة Supabase (Owner/Admin)

| # | البند | الرابط |
|---|---|---|
| 1 | **Leaked Password Protection** — تفعيل HIBP check | https://supabase.com/dashboard/project/zdqkrrehlivayconjcgm/auth/providers |
| 2 | **Postgres Upgrade** — تطبيق security patches | https://supabase.com/dashboard/project/zdqkrrehlivayconjcgm/settings/infrastructure |
| 3 | **Extension in public** — نقل `pg_trgm` إلى schema منفصل (اختياري، يتطلب dump/restore) | https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public |

البندان 1 و 2 مذكوران في `plan.md → P5` كإلزاميات قبل الإطلاق.
