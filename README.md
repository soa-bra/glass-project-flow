# SoaBra - The Glass Project Flow

منصة التخطيط التعاوني والعصف الذهني المدعومة بالذكاء الصناعي.

## 🏗️ البنية التقنية

- **Frontend**: React 18 + TypeScript (Strict)
- **Graphics**: WebGL (Pixi.js) + OffscreenCanvas + Workers
- **Collaboration**: Yjs + Supabase Realtime
- **Backend**: Supabase (Auth, Postgres, Storage, Edge Functions)
- **AI**: OpenAI API عبر Edge Functions

## 🚀 التشغيل المحلي

### المتطلبات الأساسية
- Node.js ≥ 18
- npm أو yarn أو pnpm
- Docker (للـ Supabase المحلي)

### الإعداد

1. **استنساخ المشروع**
```bash
git clone [repository-url]
cd soabra-glass-project
```

2. **تثبيت التبعيات**
```bash
npm install
```

3. **إعداد Supabase المحلي**
```bash
# تثبيت Supabase CLI
npm install -g @supabase/cli

# بدء Supabase محلياً
supabase start

# تطبيق المايغريشن
supabase db push
```

4. **تكوين متغيرات البيئة**
```bash
cp .env.example .env
# قم بتحديث المتغيرات بالقيم من supabase start
```

5. **تشغيل التطبيق**
```bash
npm run dev
```

الآن افتح [http://localhost:8080](http://localhost:8080) لرؤية التطبيق.

## 🧪 الاختبارات

### اختبارات الوحدة
```bash
npm run test
npm run test:coverage  # مع تقرير التغطية
```

### اختبارات E2E
```bash
npm run e2e
```

### فحص الجودة
```bash
npm run lint        # فحص ESLint
npm run format      # تنسيق بـ Prettier
npm run type-check  # فحص TypeScript
```

## 📁 هيكل المشروع

```
src/
├── apps/brain/              # التطبيق الرئيسي
│   ├── canvas/              # مكونات اللوحة
│   ├── plugins/             # إضافات العناصر الذكية
│   └── workflows/           # سير العمل
├── components/              # المكونات المشتركة
│   ├── Whiteboard/          # مكونات اللوحة البيضاء
│   └── ui/                  # مكونات UI الأساسية
├── lib/                     # مكتبات ومساعدات
│   └── supabase/           # تكامل Supabase
├── hooks/                   # React Hooks مخصصة
├── types/                   # تعريفات TypeScript
└── workers/                 # Web Workers

supabase/
├── functions/               # Edge Functions
├── migrations/              # هجرة قاعدة البيانات
└── config.toml             # تكوين Supabase
```

## 🔧 الأوامر المتاحة

| الأمر | الوصف |
|-------|--------|
| `npm run dev` | تشغيل التطوير المحلي |
| `npm run build` | بناء الإنتاج |
| `npm run preview` | معاينة بناء الإنتاج |
| `npm run lint` | فحص الكود بـ ESLint |
| `npm run lint:fix` | إصلاح مشاكل ESLint |
| `npm run format` | تنسيق الكود بـ Prettier |
| `npm run type-check` | فحص أنواع TypeScript |
| `npm run test` | تشغيل اختبارات الوحدة |
| `npm run test:ui` | تشغيل اختبارات الوحدة بواجهة |
| `npm run test:coverage` | تقرير تغطية الاختبارات |
| `npm run e2e` | اختبارات E2E بـ Playwright |

## 🌐 بيئات النشر

### التطوير
- **URL**: http://localhost:8080
- **Supabase**: محلي عبر Docker
- **Hot Reload**: مُفعّل

### الإنتاج
- **Platform**: Supabase Hosting
- **CI/CD**: GitHub Actions
- **Monitoring**: مدمج مع Supabase

## 📊 مقاييس الأداء

يهدف المشروع لتحقيق:
- **60fps** في العرض
- **TTI ≤ 2.5s** للتحميل الأولي
- **Re-render ≤ 16ms** للتفاعلات
- **Realtime ≤ 150ms** للتحديثات المباشرة

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

### معايير الجودة
- جميع الاختبارات يجب أن تمر
- تغطية الكود ≥ 80%
- لا أخطاء ESLint أو TypeScript
- كود منسق بـ Prettier

## 🔒 الأمان

- **RLS**: مُطبق على جميع جداول قاعدة البيانات
- **Auth**: مُدار بالكامل عبر Supabase
- **API Keys**: محفوظة في Edge Functions فقط
- **CORS**: مُكون بطريقة آمنة

## 📄 الرخصة

هذا المشروع محمي بحقوق الطبع والنشر لشركة SoaBra.

## 📞 الدعم

للاستفسارات والدعم التقني، يرجى التواصل عبر:
- **Email**: support@soabra.com
- **Documentation**: `/docs`
- **Issues**: GitHub Issues

---

**ملاحظة**: هذا مشروع إنتاجي يتطلب الالتزام بمعايير الجودة العالية والأمان المؤسسي.
