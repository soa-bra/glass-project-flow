# Invoice Feature Architecture

## نظرة عامة

ميزة الفواتير تتبع نفس البنية المعمارية لميزة Planning، مع فصل واضح بين الطبقات.

## هيكل المجلدات

```
src/features/invoice/
├── ui/                      # طبقة العرض
│   ├── panels/              # لوحات رئيسية
│   │   └── InvoicesDashboard.tsx
│   ├── widgets/             # مكونات صغيرة
│   └── index.ts
├── domain/                  # منطق الأعمال
│   ├── types/               # أنواع TypeScript
│   │   └── invoice.types.ts
│   ├── policies/            # قواعد الأعمال
│   │   └── invoiceRules.ts
│   └── index.ts
├── state/                   # إدارة الحالة
│   ├── hooks/               # React hooks
│   │   └── useInvoices.ts
│   └── index.ts
├── integration/             # التكامل الخارجي
│   ├── api/                 # واجهات API
│   │   └── invoiceAPI.ts
│   ├── persistence/         # طبقة البيانات
│   │   └── invoiceRepository.ts
│   └── index.ts
├── ARCHITECTURE.md          # هذا الملف
└── index.ts                 # Public API
```

## قواعد الاستيراد

### ✅ مسموح

```typescript
// من خارج الميزة - استخدم Public API فقط
import { InvoicesDashboard, useInvoices } from '@/features/invoice';

// داخل الميزة
import { calculateTotal } from '../domain';
import { useInvoices } from '../state';
```

### ❌ ممنوع

```typescript
// ممنوع - استيراد عميق من خارج الميزة
import { InvoicesDashboard } from '@/features/invoice/ui/panels/InvoicesDashboard';

// ممنوع - UI لا تستورد من integration
import { invoiceAPI } from '../integration/api/invoiceAPI';

// ممنوع - Domain لا تستخدم React
import { useState } from 'react'; // في ملفات domain/
```

## طبقات المعمارية

### 1. Domain Layer (domain/)
- **الغرض**: منطق الأعمال الخالص
- **القاعدة**: بدون React، TypeScript فقط
- **المحتويات**:
  - `types/`: تعريفات الأنواع
  - `policies/`: قواعد الأعمال (حساب الضريبة، التحقق من الصلاحيات)

### 2. State Layer (state/)
- **الغرض**: إدارة الحالة والتفاعل مع API
- **القاعدة**: Hooks فقط، لا business logic
- **المحتويات**:
  - `hooks/`: React hooks للتعامل مع البيانات

### 3. UI Layer (ui/)
- **الغرض**: عرض البيانات والتفاعل مع المستخدم
- **القاعدة**: لا تستورد من integration مباشرة
- **المحتويات**:
  - `panels/`: لوحات كبيرة
  - `widgets/`: مكونات صغيرة قابلة لإعادة الاستخدام

### 4. Integration Layer (integration/)
- **الغرض**: التواصل مع الخدمات الخارجية
- **القاعدة**: لا تُصدَّر للخارج
- **المحتويات**:
  - `api/`: واجهات API
  - `persistence/`: طبقة الوصول للبيانات

## ESLint Governance

قواعد ESLint تفرض هذه المعمارية تلقائياً:

1. **UI لا تستورد من integration**: يمر كل شيء عبر state/
2. **Domain خالية من React**: منطق أعمال نقي
3. **Public API فقط**: الاستيراد من خارج الميزة يمر من index.ts

## أمثلة

### إضافة قاعدة أعمال جديدة

```typescript
// domain/policies/invoiceRules.ts
export function canApplyDiscount(invoice: Invoice, discountPercent: number): boolean {
  return invoice.status === 'draft' && discountPercent <= 20;
}
```

### إضافة Hook جديد

```typescript
// state/hooks/useInvoiceForm.ts
export function useInvoiceForm() {
  // استخدم invoiceAPI من integration
  // لكن لا تُصدِّره للـ UI مباشرة
}
```

### إضافة مكون UI جديد

```typescript
// ui/widgets/InvoiceCard.tsx
import { statusColors, statusLabels } from '../../domain';
import { useInvoices } from '../../state';

export const InvoiceCard: React.FC<Props> = ({ invoice }) => {
  // استخدم domain للقواعد
  // استخدم state للبيانات
};
```
