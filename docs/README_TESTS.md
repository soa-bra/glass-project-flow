# اختبارات نظام التخطيط المتكامل

## نظرة عامة

تم تطوير مجموعة شاملة من الاختبارات لضمان جودة وأداء نظام التخطيط المتكامل في سـوبــرا.

## هيكل الاختبارات

### اختبارات الوحدات (Unit Tests)
- **Canvas Store**: اختبار إضافة، تحديث، وحذف العناصر
- **Smart Elements**: اختبار العناصر الذكية وبياناتها
- **Layer Management**: اختبار إدارة الطبقات والرؤية والقفل
- **History Management**: اختبار التراجع والإعادة
- **Selection Operations**: اختبار التحديد الفردي والمتعدد
- **Clipboard Operations**: اختبار النسخ واللصق والقص
- **Grouping Operations**: اختبار التجميع وفك التجميع
- **Alignment Operations**: اختبار المحاذاة بجميع الاتجاهات

### اختبارات الأداء (Performance Tests)
- **Large Datasets**: اختبار معالجة 100+ عنصر
- **Multi-Selection**: اختبار تحديد 50+ عنصر
- **Viewport Operations**: اختبار التكبير والتحريك (50 عملية)
- **Complex Operations**: اختبار النسخ واللصق والمحاذاة لمجموعات كبيرة
- **Memory Management**: اختبار عدم وجود تسرب في الذاكرة
- **Undo/Redo Performance**: اختبار 20 عملية تراجع/إعادة متتالية

### اختبارات التكامل (Integration Tests)
- **Text Workflow**: إنشاء وتعديل ونسخ النصوص
- **Shape Drawing**: رسم ومحاذاة وتجميع الأشكال
- **Multi-Element Operations**: نسخ ولصق وحذف متعدد
- **Layer Workflow**: إنشاء طبقات وإخفاء وقفل
- **Smart Elements**: إضافة عناصر ذكية مخصصة
- **File Upload**: رفع وعرض الصور والملفات
- **Complex Undo/Redo**: سيناريوهات معقدة للتراجع والإعادة

## تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm run test

# تشغيل الاختبارات مع التغطية
npm run test:coverage

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch

# تشغيل اختبارات محددة
npm run test canvasStore
npm run test performance
npm run test integration
```

## معايير الأداء

### الأهداف المحددة:
- ✅ إضافة 100 عنصر < 1 ثانية
- ✅ تحديد 50 عنصر < 100ms
- ✅ حذف 50 عنصر < 100ms
- ✅ 50 عملية تكبير/تصغير < 500ms
- ✅ 50 عملية تحريك < 500ms
- ✅ نسخ ولصق 30 عنصر < 200ms
- ✅ محاذاة 40 عنصر < 100ms
- ✅ 20 عملية تراجع/إعادة < 200ms لكل منها

### مراقبة الأداء الحي

يمكن استخدام `PerformanceMonitor` لمراقبة الأداء في الوقت الفعلي:

```typescript
import { performanceMonitor } from '@/utils/performanceMonitor';

// بدء المراقبة
performanceMonitor.startMonitoring();

// قياس عملية محددة
performanceMonitor.measureOperation('addElement', () => {
  addElement(newElement);
});

// الحصول على التقرير
console.log(performanceMonitor.getReport());

// إيقاف المراقبة
performanceMonitor.stopMonitoring();
```

## التحسينات المطبقة

### 1. Virtualization
- عرض العناصر المرئية فقط في Viewport
- تقليل عمليات الرسم للعناصر خارج الشاشة

### 2. Memoization
- استخدام `useMemo` و `useCallback` للعمليات الثقيلة
- تخزين مؤقت للعناصر المحسوبة

### 3. Lazy Loading
- تحميل العناصر الذكية عند الحاجة
- تقليل الحمل الأولي

### 4. Debouncing
- تأجيل عمليات التحديث المتكررة
- تحسين استجابة واجهة المستخدم

## التغطية الحالية

- **Statements**: هدف 80%+
- **Branches**: هدف 75%+
- **Functions**: هدف 80%+
- **Lines**: هدف 80%+

## سيناريوهات الاختبار المكتملة

### ✅ العمليات الأساسية
- [x] إنشاء عنصر نص والتعديل عليه
- [x] رسم أشكال متعددة بأحجام مختلفة
- [x] تحديد عناصر متعددة ومحاذاتها
- [x] نسخ ولصق وحذف
- [x] التجميع وفك التجميع
- [x] إضافة عنصر ذكي وتخصيصه
- [x] رفع صورة وعرضها
- [x] Undo/Redo بعد عمليات متعددة
- [x] العمل مع الطبقات (إخفاء/قفل)

### ✅ اختبارات الأداء
- [x] رسم 100+ عنصر ومراقبة الوقت
- [x] Multi-select لـ 50+ عنصر
- [x] Zoom/Pan السلس مع عناصر كثيرة
- [x] اختبار عدم وجود تسرب في الذاكرة

## ملفات الاختبارات

```
src/__tests__/
├── setup.ts                              # إعداد بيئة الاختبار
├── stores/
│   ├── canvasStore.test.ts              # اختبارات العمليات الأساسية
│   └── canvasStore.performance.test.ts  # اختبارات الأداء
└── integration/
    └── canvas-workflow.test.tsx         # اختبارات التكامل الشاملة
```

## اختبارات المستقبل

### المخطط لها:
- [ ] اختبارات E2E باستخدام Playwright
- [ ] اختبارات الأمان
- [ ] اختبارات التوافق عبر المتصفحات
- [ ] اختبارات الوصولية (A11y)
- [ ] اختبارات التحميل (Load Testing)
- [ ] اختبارات FPS الحقيقية مع مراقب الأداء

## المساهمة

عند إضافة ميزات جديدة:
1. أضف اختبارات وحدية للوظائف الجديدة
2. تأكد من عدم انخفاض التغطية
3. اختبر الأداء مع البيانات الكبيرة
4. وثّق أي اختبارات خاصة
5. تأكد من نجاح جميع الاختبارات قبل الدمج

## الموارد

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## النتائج المتوقعة

عند تشغيل `npm run test:coverage`، يجب أن ترى:

```
Test Files  3 passed (3)
     Tests  25+ passed (25+)
  Duration  < 2s

Coverage Report:
  Statements: 80%+
  Branches: 75%+
  Functions: 80%+
  Lines: 80%+
```
