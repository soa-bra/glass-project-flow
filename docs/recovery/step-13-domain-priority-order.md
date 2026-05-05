# Step 13 Domain Priority Order

- التاريخ: 2026-05-05
- الحالة: Done
- المرجع: الحزمة التنفيذية لاستعادة الانضباط الهندسي — الخطوة 13

## Ordering Inputs
1. DoD Matrix بعد إغلاق Step 12.
2. Recovery Backlog في Step 15.
3. Source of Truth Matrix في Step 4.
4. Active Architecture Baseline في Step 5.

## Priority Logic
1. يبدأ التنفيذ بما يحمي الانتقال الرسمي ولا يفتح features جديدة.
2. تعطى الأولوية للدومينات التي توحد بقية النظام أو تمنع الرجوع إلى legacy/mocks.
3. أي domain جديد لا يدخل التنفيذ إلا إذا كان لديه DoD + Source of Truth + active path + تبعيات واضحة.

## Ordered Domains
| Priority | Domain / Workstream | Reason | Required Evidence Before Start |
|---|---|---|---|
| P0 | Transition Readiness / Go-No-Go | يفتح أو يمنع العودة للتطوير الطبيعي | Step 17 transition record |
| P0 | Runtime Evidence Maintenance | يحافظ على Step 8 كدليل حي وليس snapshot قديم | Evidence updates under `docs/recovery/evidence/` |
| P1 | Workflow Governance | يربط workflows بالمكونات ومصادر الحقيقة | Step 14 Workflow Matrix |
| P1 | Post-Recovery Development Guardrails | يمنع إنشاء SoT أو mocks جديدة | Step 16 completion rules |
| P2 | CI Evidence Automation | يقلل العمل اليدوي لجمع أدلة التشغيل | Backlog item RB-008 |

## Domain Entry Gate
لا يبدأ أي domain أو feature جديدة إلا إذا تحقق التالي:
1. DoD واضح ومكتوب.
2. Source of Truth محدد.
3. active path موثق.
4. لا dependency مفتوحة في Execution Status Table.
5. لا تعارض مع Step 16 policy.

## Closure Record
تم إغلاق الخطوة 13 بتوثيق ترتيب الدومينات العملي وربطه بالتبعيات والأدلة المطلوبة قبل البدء.
