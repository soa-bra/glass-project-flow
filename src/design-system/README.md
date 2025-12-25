# SoaBra Design System

نظام تصميم متكامل لمنصة سوبرا، مبني على مبادئ التكامل الشامل والذكاء الاصطناعي.

## 📁 هيكل المجلدات

```
src/
├── design-system/           # DS - نظام التصميم الأساسي
│   ├── tokens/              # التوكنات (CSS + TypeScript)
│   │   ├── ds-tokens.ts     # توكنات DS
│   │   ├── oc-tokens.ts     # توكنات OC
│   │   └── index.ts         # نقطة التصدير
│   ├── primitives/          # مكونات أساسية
│   ├── navigation/          # مكونات التنقل
│   ├── feedback/            # مكونات التغذية الراجعة
│   ├── data-display/        # عرض البيانات والرسوم البيانية
│   └── index.ts             # نقطة الدخول الرئيسية
├── operating/               # OC - مكونات تشغيلية
│   ├── governance/          # الحوكمة
│   ├── collaboration/       # التعاون
│   ├── ai/                  # الذكاء الاصطناعي
│   ├── navigation/          # التنقل
│   ├── shell/               # الهيكل
│   ├── finance/             # المالية
│   ├── hr/                  # الموارد البشرية
│   ├── crm/                 # إدارة العلاقات
│   ├── canvas/              # الكانفس
│   └── index.ts             # نقطة التصدير
├── hybrid/                  # مكونات هجينة (DS + OC)
│   ├── DataTable.tsx
│   ├── DynamicForm.tsx
│   └── index.ts
└── tokens/                  # ملفات CSS للتوكنات
    ├── ds/                  # توكنات DS
    └── oc/                  # توكنات OC
```

## 🎨 استخدام التوكنات

### في TypeScript/React

```typescript
import { DS, OC, DS_COLORS, OC_PROJECT } from '@/design-system';

// استخدام الألوان
const inkColor = DS_COLORS.ink;        // '#0B0F12'
const accentGreen = DS_COLORS.accent.green;  // '#3DBE8B'

// استخدام توكنات المشاريع
const projectBg = OC_PROJECT.cardBg;   // 'hsl(var(--oc-project-card-bg))'
```

### في CSS/Tailwind

```css
/* استخدام متغيرات DS */
.my-element {
  color: hsl(var(--ds-color-ink));
  background: hsl(var(--ds-color-panel));
  border-radius: var(--ds-radius-card-top);
  padding: var(--ds-spacing-lg);
}

/* استخدام متغيرات OC */
.project-card {
  background: hsl(var(--oc-project-card-bg));
  border-color: hsl(var(--oc-status-on-plan));
}
```

## 📦 المكونات المتاحة

### DS Components (نظام التصميم)

| الفئة | المكونات |
|-------|----------|
| Primitives | DatePicker, TimePicker, Combobox, MultiSelect, TagInput, CheckboxGroup |
| Navigation | Stepper |
| Feedback | Rating |
| Charts | LineChart, BarChart, PieChart, AreaChart, RadarChart, Heatmap |

### OC Components (المكونات التشغيلية)

| الفئة | المكونات |
|-------|----------|
| Governance | ApprovalFlow, PermissionMatrix, AuditTrail |
| Collaboration | ActivityFeed, NotificationCenter |
| AI | ConfidenceIndicator, AIInsightCard, SmartSuggestion |
| Navigation | CommandPalette, GlobalSearch |
| Shell | TopBar |
| Finance | BudgetTracker, ExpenseCard |
| HR | EmployeeCard |
| CRM | ClientCard, DealPipeline |
| Canvas | CanvasZoomControl, LayerPanel, CanvasExport |

### Hybrid Components (مكونات هجينة)

| المكون | الوصف |
|--------|-------|
| DataTable | جدول بيانات متقدم مع فرز وتصفية |
| DynamicForm | نموذج ديناميكي قابل للتخصيص |

## 🎯 أفضل الممارسات

1. **استخدم التوكنات دائماً** - لا تستخدم ألوان أو قيم مباشرة
2. **استورد من نقطة الدخول** - استخدم `@/design-system` بدلاً من المسارات الفرعية
3. **اتبع تسمية HSL** - جميع الألوان تستخدم صيغة HSL
4. **راعِ RTL** - النظام مُصمم للعربية أولاً

## 📋 التوكنات المتاحة

### ألوان DS
- `--ds-color-ink` - اللون الأساسي
- `--ds-color-ink-80/60/30` - درجات الشفافية
- `--ds-color-white` - الأبيض
- `--ds-color-panel` - خلفية اللوحات
- `--ds-color-card-main` - خلفية البطاقات
- `--ds-color-border` - لون الحدود
- `--ds-color-accent-*` - ألوان التمييز

### مسافات DS
- `--ds-spacing-xs/sm/md/lg/xl/xxl/3xl`

### أنصاف الأقطار DS
- `--ds-radius-card-top/bottom`
- `--ds-radius-panel`
- `--ds-radius-chip`
- `--ds-radius-tooltip`

### ألوان OC
- `--oc-status-*` - ألوان الحالات
- `--oc-priority-*` - ألوان الأولويات
- `--oc-project-*` - ألوان المشاريع
- `--oc-chart-*` - ألوان الرسوم البيانية

---

**الإصدار:** 1.0.0  
**آخر تحديث:** 2025-06-25
