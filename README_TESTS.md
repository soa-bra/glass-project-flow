# اختبارات نظام التخطيط المتكامل

## نظرة عامة

تم تطوير مجموعة شاملة من الاختبارات لضمان جودة وأداء نظام التخطيط المتكامل في سـوبــرا.

## هيكل الاختبارات

### اختبارات الوحدات (Unit Tests)
- **Canvas Store**: اختبار إضافة، تحديث، وحذف العناصر
- **Smart Elements**: اختبار العناصر الذكية وبياناتها
- **Layer Management**: اختبار إدارة الطبقات والرؤية والقفل
- **History Management**: اختبار التراجع والإعادة

### اختبارات الأداء (Performance Tests)
- **Large Datasets**: اختبار معالجة 100+ عنصر
- **Viewport Operations**: اختبار التكبير والتحريك
- **FPS Monitoring**: مراقبة معدل الإطارات

### اختبارات التكامل (Integration Tests)
- **Element Interaction**: اختبار التفاعل بين العناصر
- **Multi-Selection**: اختبار التحديد المتعدد
- **Drag & Drop**: اختبار السحب والإفلات

## تشغيل الاختبارات

```bash
# تشغيل جميع الاختبارات
npm run test

# تشغيل الاختبارات مع التغطية
npm run test:coverage

# تشغيل الاختبارات في وضع المراقبة
npm run test:watch

# تشغيل اختبارات محددة
npm run test SmartElements
```

## معايير الأداء

### الأهداف المحددة:
- ✅ FPS ≥ 30 إطار في الثانية
- ✅ إضافة 100 عنصر < 1 ثانية
- ✅ تحديث Viewport < 500ms لـ 50 عملية
- ✅ استجابة التفاعل < 100ms

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

## تحسينات الأداء المطبقة

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

## اختبارات المستقبل

### المخطط لها:
- [ ] اختبارات E2E باستخدام Playwright
- [ ] اختبارات الأمان
- [ ] اختبارات التوافق عبر المتصفحات
- [ ] اختبارات الوصولية (A11y)
- [ ] اختبارات التحميل (Load Testing)

## المساهمة

عند إضافة ميزات جديدة:
1. أضف اختبارات وحدية للوظائف الجديدة
2. تأكد من عدم انخفاض التغطية
3. اختبر الأداء مع البيانات الكبيرة
4. وثّق أي اختبارات خاصة

## الموارد

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
