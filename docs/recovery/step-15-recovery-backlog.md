# Step 15 Recovery Backlog

- التاريخ: 2026-05-05
- الحالة: Done
- المرجع: الحزمة التنفيذية لاستعادة الانضباط الهندسي

## Classification Rules
1. Blocker: يمنع انتقال البرنامج أو إغلاق خطوة حرجة.
2. Foundational: مطلوب قبل توسيع النطاق أو بدء domains جديدة.
3. Important: يحسن الاستقرار لكنه لا يمنع الانتقال بذاته.
4. Later: تحسينات مؤجلة بعد الاستقرار.

## Backlog Items
| ID | Classification | Item | Source Step | Definition of Done |
|---|---|---|---|---|
| RB-001 | Blocker | تنفيذ Runtime verification للـ5 workflows وإرفاق الأدلة | 8 | تعبئة ملفات `step08-*.txt` وتحويل Step 8 إلى Done |
| RB-002 | Blocker | اعتماد محضر Go/No-Go لنقطة الانتقال | 17 | توثيق محضر رسمي وتحديث حالة Step 17 |
| RB-003 | Foundational | إغلاق فجوات المكونات النشطة (Partial→Done) | 12 | سجل فجوات + إغلاق كل gap بدليل فني |
| RB-004 | Foundational | ترتيب الدومينات حسب الأولوية التنفيذية | 13 | مصفوفة أولوية مع تبعيات وسبب الترتيب |
| RB-005 | Foundational | توثيق Workflow Matrix رسمي | 14 | matrix مكتملة لكل workflow رئيسي |
| RB-006 | Foundational | تعريف قواعد الاستكمال بعد الإصلاح | 16 | policy معتمدة تمنع إدخال SoT/mocks جديدة |
| RB-007 | Important | ربط FAIL المحتمل من Step 8 بعناصر backlog | 8/15 | كل FAIL له backlog ID واضح |
| RB-008 | Later | تحسين أتمتة جمع أدلة runtime في CI | 9/8 | runbook/automation proposal موثق |

## Governance Notes
1. يمنع خلط backlog التنظيف التقني مع backlog features المنتج في نفس القائمة بدون تصنيف.
2. أي عنصر جديد يجب أن يحمل Classification + DoD + Owner + Evidence Link.

## Owners
1. Engineering Manager: RB-001, RB-002.
2. Tech Lead (Architecture): RB-003, RB-004, RB-006.
3. QA/Platform: RB-005, RB-007, RB-008.
