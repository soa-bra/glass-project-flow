## Recovery Compliance Gate (Mandatory)

- [ ] **Source of Truth** محدد بوضوح (اذكر الملف/القسم):
- [ ] **DoD** محدد بوضوح (اذكر مكوّن/صف المصفوفة):
- [ ] **Active Path** محدد بوضوح (UI -> hook -> service -> Supabase):

## Ticket Verification Policy (Mandatory per ticket)

> لا تعتبر أي تذكرة منتهية إلا إذا احتوت على تحقق آلي أو خطوات تحقق يدوية دقيقة قابلة للمراجعة داخل وصف PR.

For every ticket in this PR, fill one row:

| Ticket | Root cause / السبب الجذري | Change / التغيير | Behavior evidence / إثبات السلوك | Verification commands / أوامر التحقق | Manual verification steps / خطوات التحقق اليدوي |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

### Canvas Experience Refresh Gate

For every ticket that touches the canvas experience, include **at least one** automated test or a written manual check that starts from a fresh browser refresh. Typecheck alone is not enough.

- [ ] لا توجد تذاكر تمس تجربة الكانفس في هذا PR.
- [ ] لكل تذكرة تمس الكانفس: أرفقت اختباراً آلياً أو تحققاً يدوياً يبدأ من refresh جديد وفتح اللوحة مباشرة.
- [ ] خطوات التحقق اليدوي للكانفس تذكر اللوحة/الرابط، حالة البداية بعد refresh، الفعل المطلوب، والنتيجة المرئية المتوقعة.

## Acceptance-Criteria Gap Disclosure

- [ ] وثّق هذا PR أي فجوة سابقة حيث تغيّر الكود بدون شروط قبول قابلة للتشغيل أو المراجعة داخل المنتج.
- [ ] أضفت شروط قبول قابلة للتشغيل أو خطوات مراجعة يدوية دقيقة لكل تذكرة متأثرة.

## Forbidden Patterns Confirmation

- [ ] لم يتم إدخال mock data في المسار النشط.
- [ ] لم يتم استخدام local state كمصدر حقيقة دائم.
- [ ] لم يتم إنشاء service موازية بدون قرار معماري موثق.

## Evidence Links

- [ ] رابط/روابط الأدلة (ملفات/اختبارات/توثيق):
