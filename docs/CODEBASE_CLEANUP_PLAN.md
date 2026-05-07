# خطة شاملة لمراجعة وتنظيف قاعدة الكود

## الهدف
توحيد البنية، إزالة التكرار، اكتشاف الأجزاء غير المستخدمة، وتحديث الهوكس والاستدعاءات بين المكونات والطبقات بشكل قابل للقياس والتنفيذ التدريجي.

## ملاحظات أولية من فحص سريع
- المشروع كبير جدًا ومتعدد الطبقات (features, engine, hooks, stores, components) مع كثافة عالية في `src/components` و`src/features/planning`.
- يوجد مؤشرات تكرار بالاسم/الدور (مثل مكونات متقاربة الوظيفة في مسارات متعددة) تستدعي جردًا منهجيًا قبل الحذف.
- فحص TypeScript يمر بنجاح، لكن lint غير قابل للتنفيذ حاليًا في البيئة بسبب اعتماديات غير متاحة محليًا.

## نطاق المراجعة (End-to-End)
1. **طبقة العرض UI**: كل المكونات، خصوصًا الأدلة المكررة حسب المجال (DepartmentTabs / OperationsBoard / custom).
2. **طبقة المنطق Hooks**: مراجعة الاعتمادات، stale closures، استدعاءات hooks الداخلية، وتطابقها مع أحدث state shape.
3. **طبقة الحالة State**: stores + slices + selectors + history/transactions.
4. **طبقة المحرك Engine**: canvas interaction/rendering/io/collaboration.
5. **طبقة الخدمات Services/API**: توحيد patterns، إزالة wrappers غير المستخدمة، وتدقيق العقود types.
6. **طبقة الأنواع Types**: إزالة الأنواع اليتيمة، توحيد التسمية، ومنع التكرار بين ملفات types.

## منهجية التنفيذ العملية

### المرحلة 1: جرد شامل آلي (Inventory)
- استخراج خريطة الاستيراد/التصدير لكل ملف.
- إنشاء تقارير:
  - exports غير المستعملة.
  - الملفات غير المشار إليها.
  - المكونات ذات الأسماء المتقاربة والواجهات المتطابقة جزئيًا.
- المخرجات: `docs/reports/inventory-*.md`.

### المرحلة 2: كشف التكرار (Duplication)
- مقارنة المكونات حسب:
  - اسم/مسار/props contract.
  - تشابه JSX وbusiness logic.
- تصنيف التكرار:
  - **تكرار صالح** (اختلاف مجال واضح).
  - **تكرار قابل للدمج** (نفس السلوك مع اختلافات بسيطة).
  - **تكرار ضار** (نسخ متباعدة تسبب divergence).
- المخرجات: `docs/reports/duplication-matrix.md`.

### المرحلة 3: تدقيق hooks والاستدعاءات
- لكل hook:
  - مطابقة dependencies في `useEffect/useMemo/useCallback`.
  - التحقق من referential stability.
  - فحص side-effects غير المنظفة.
- لكل مكوّن مستهلك:
  - التأكد أن hook الصحيح يُستدعى (وليس نسخة legacy).
  - مطابقة args/return مع آخر type contracts.
- المخرجات: `docs/reports/hooks-callgraph.md`.

### المرحلة 4: التحقق الوظيفي والتقني
- Type safety: `npm run typecheck`.
- Lint: إصلاح بيئة الاعتماديات ثم `npm run lint`.
- اختبارات: تشغيل وحدات/تكامل حسب النطاق المتأثر.
- قياسات الأداء قبل/بعد لأي refactor واسع.

### المرحلة 5: التنظيف المرحلي الآمن
- ترتيب الأولوية:
  1) Dead code المؤكد.
  2) التكرار الضار.
  3) التوحيد البنيوي (shared abstractions).
- تطبيق تغييرات صغيرة متسلسلة مع checkpoints.
- منع كسر API الداخلي عبر طبقة توافق مؤقتة عند الحاجة.

### المرحلة 6: الحوكمة ومنع عودة التكرار
- إضافة قواعد CI:
  - منع imports دائرية.
  - تنبيهات exports غير مستخدمة.
  - حدود تعقيد/حجم للملفات الحرجة.
- تعريف مسار واضح لأي مكون جديد (متى يكون shared vs domain-specific).


### Quality gates موثقة للـ CI والتنظيف الدوري

> الهدف من هذه البوابات هو منع عودة dead exports، الدورات بين الملفات، مسارات الاستيراد legacy، والملفات الحرجة عالية التعقيد بعد كل دفعة تنظيف. تُشغّل كبوابة غير مدمّرة أولًا (`continue-on-error: true`) لمدة دورة أو دورتين، ثم تتحول إلى blocking بعد تثبيت baseline موثق في `docs/reports/`.

1. **Unused exports / unused files**
   - **الأداة المقترحة:** `knip` لأنها تفحص exports والملفات غير المستخدمة مع دعم TypeScript/Vite.
   - **الأمر المحلي:**
     ```bash
     npx knip --production --reporter compact
     ```
   - **سياسة CI:** يفشل الـ job عند ظهور exports أو files جديدة غير مبررة. أي false positive لا يُستثنى إلا بعد توثيق السبب في `docs/reports/zero-reference-allowlist.md`، خصوصًا للحالات غير المرئية في static graph مثل Web Workers أو registry wiring.

2. **Circular imports**
   - **الأداة المقترحة:** `madge` لفحص cycles في شجرة `src`.
   - **الأمر المحلي:**
     ```bash
     npx madge --extensions ts,tsx --circular src
     ```
   - **سياسة CI:** أي دورة جديدة داخل `src` تعتبر blocking. الدورات القديمة توثق في baseline مستقل مع مالك وموعد إزالة، ولا تُستخدم لتبرير دورات إضافية.

3. **Legacy import paths**
   - **الأداة المقترحة:** قاعدة ESLint `no-restricted-imports` للمسارات المحددة، أو `eslint-plugin-boundaries` عند الحاجة لقواعد طبقية بين features/engine/shared.
   - **الأمر المحلي بعد إضافة/تحديث القاعدة:**
     ```bash
     npm run lint
     ```
   - **سياسة CI:** حظر الاستيراد من aliases أو compatibility paths القديمة، مثل imports التي تتجاوز public entrypoints للـ feature أو تستورد من ملفات migration/legacy بعد انتهاء مهلة الترحيل. أي استثناء يجب أن يحتوي تاريخ انتهاء وسببًا تقنيًا.

4. **High-complexity critical files**
   - **الأداة المقترحة:** ESLint rule `complexity` و/أو `max-lines` للملفات الحرجة، مع رفعها تدريجيًا إلى blocking بعد baseline. يمكن استخدام `npx eslint "src/**/*.{ts,tsx}" --max-warnings=0` عندما تُثبت القواعد في config.
   - **النطاق الحرج المبدئي:** `src/hooks`, `src/stores`, `src/engine`, `src/features/planning`, وملفات worker/runtime entrypoints مثل `src/workers/fileProcessor.worker.ts`.
   - **الأمر المحلي الحالي:**
     ```bash
     npm run lint
     ```
   - **سياسة CI:** أي زيادة جديدة في complexity أو حجم ملف حرج تحتاج refactor أو تقرير مبرر في `docs/reports/`. الهدف العملي: إبقاء الدوال الجديدة تحت حد complexity متفق عليه، وتقسيم الملفات الحرجة بدل إضافة منطق متشعب إليها.

#### قالب job مقترح

```yaml
codebase-quality-gates:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 22
        cache: npm
    - run: npm ci
    - run: npm run typecheck
    - run: npm run lint
    - run: npx knip --production --reporter compact
    - run: npx madge --extensions ts,tsx --circular src
```

#### طريقة التشغيل قبل فتح PR

```bash
npm run typecheck
npm run lint
npx knip --production --reporter compact
npx madge --extensions ts,tsx --circular src
```

#### طريقة التعامل مع النتائج

- **unused exports/files:** إذا كان الإدخال runtime-loaded أو registry-wired، أضفه إلى `docs/reports/zero-reference-allowlist.md` مع دليل bootstrap/registration وأمر تحقق. وإلا يُعامل كمرشح حذف أو دمج.
- **circular imports:** اكسر الدورة بتقديم interface/shared type أو نقل dependency إلى طبقة أدنى؛ لا تضف barrel export جديدًا إذا كان سيخفي الدورة.
- **legacy import paths:** استبدلها بـ public entrypoint أو alias حديث، ثم أضف restriction لمنع عودتها.
- **high-complexity critical files:** استخرج pure helpers أو hooks أصغر، وأضف اختبارًا للنقاط الحساسة قبل refactor وبعده.

## معايير القبول (Definition of Done)
- لا يوجد dead code مؤكد داخل النطاق المستهدف.
- كل hook رئيسي موثق بسلوك واضح واختبار واحد على الأقل للحالات الحساسة.
- انخفاض ملموس في عدد الملفات المتكررة وظيفيًا.
- اجتياز typecheck + lint + الاختبارات المتفق عليها.
- وجود تقرير نهائي يوضح: ما حُذف، ما دُمج، وما تُرك مع مبرر.

## خطة تنفيذ على دفعات (اقتراح)
- **دفعة A:** `src/hooks` + `src/stores` + `src/features/planning/state`.
- **دفعة B:** `src/components/DepartmentTabs` + `src/components/OperationsBoard`.
- **دفعة C:** `src/engine/canvas` + `src/features/planning/canvas`.
- **دفعة D:** `src/services` + `src/api` + `src/types`.

كل دفعة تنتهي بـ:
1) تقرير فروقات.
2) قائمة الحذف/الدمج.
3) نتائج الاختبارات.
