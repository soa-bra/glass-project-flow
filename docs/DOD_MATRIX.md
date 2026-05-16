# Definition of Done (DoD) Matrix — Planning Canvas

> مصفوفة معايير القبول لكل مرحلة من P0 إلى P6، مرتبطة بالقواعد الحاكمة UR-001..UR-010.

| المرحلة | المخرج | معيار القبول الفني | معيار القبول الوظيفي | UR المرتبطة |
|---|---|---|---|---|
| **P0** | حزمة الاستيراد + وثائق | `docs/CANVAS_LIMITATIONS.md` + `docs/DOD_MATRIX.md` موجودان | مراجعة الـ Owner تمت | UR-001..UR-010 |
| **P1.a** | جداول `planning_boards`, `planning_elements` | Migration ناجح + RLS مفعّل + Index على `(board_id, updated_at)` | إنشاء/قراءة/تحديث/حذف عبر service يعمل | UR-001, UR-009 |
| **P1.b** | Realtime + Presence + Lock | قناة Supabase Realtime تعمل، `locked_by` يُفرَّغ بعد 30s | المتعاون يرى المؤشر المباشر | UR-005 |
| **P1.c** | Smart Documents | `planning_smart_docs` + `SmartDocRenderer` يحفظ JSONB مع `schema_version` | Rich Text + Spreadsheet يحفظان ويعرضان | UR-006 |
| **P1.d** | Canvas-scoped RBAC | `commandGateway.ts` يحجب AI/SmartDocs للـ viewer | viewer يرى "غير مصرّح" | UR-009 |
| **P2.a** | Edge Function `planning-convert-element` | يعيد `suggestedType` + confidence | المستخدم يؤكد قبل الإنشاء | UR-008, UR-010 |
| **P2.b** | Entity Cards + Expand | `framer-motion` layoutId يعمل، Mobile=fullscreen | فتح Project يعرض ProjectManagementBoard | UR-008 |
| **P2.c** | `planning_connectors` + Semantic types | 5 أنواع دلالية + cascading delete | اتصال "blocks" يمنع إكمال المهمة | UR-007 |
| **P2.d** | ExecutionToolsPanel | `has_permission()` يُستدعى قبل كل إدراج | المستخدم يدرج Task حقيقي من القائمة | UR-010 |
| **P2.e** | `planning_workflows` (Stub) | الجدول موجود + service فارغ | لا UI بعد (P-Later) | UR-010 |
| **P3** | Templates + Snapshots | snapshot يحفظ الحالة الكاملة | استعادة snapshot تعيد اللوحة | UR-002 |
| **P4** | Analytics + Telemetry | `telemetry_events` يلتقط `canvas.element.created` | Dashboard يعرض الأنشطة | UR-003 |
| **P5** | AI Assistance على الكانفس | AI Gateway يُستدعى بـ RBAC check | viewer لا يرى زر AI | UR-009 |
| **P6** | تسليم نهائي + Documentation | جميع UR مغطاة + e2e tests | Owner sign-off | جميعها |

## معايير عامة (تطبق على كل مرحلة)
- ✅ RLS مفعّل على كل جدول جديد
- ✅ Migration قابل للـ rollback
- ✅ TypeScript types مُحدَّثة (`src/integrations/supabase/types.ts`)
- ✅ Canvas latency < 500ms مع 100 عنصر
- ✅ RTL يعمل بشكل صحيح
- ✅ لا Glassmorphism على Static surfaces
