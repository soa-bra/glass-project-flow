# دليل إعداد Supabase - SoaBra Glass Project Flow

## نظرة عامة

يستخدم مشروع SoaBra Supabase كخدمة backend شاملة توفر:
- قاعدة بيانات PostgreSQL مع Row Level Security (RLS)
- المصادقة والترخيص
- التخزين للملفات والصور
- Real-time subscriptions للتعاون المباشر
- Edge Functions للذكاء الصناعي

## 🚀 البدء السريع

### المتطلبات الأساسية
```bash
# تثبيت Supabase CLI
npm install -g @supabase/cli

# التحقق من الإصدار
supabase --version
```

### الإعداد المحلي

#### 1. بدء Supabase محلياً
```bash
# في مجلد المشروع
supabase start

# انتظر حتى تكتمل العملية (قد تستغرق دقائق في المرة الأولى)
```

#### 2. تطبيق المخطط
```bash
# تطبيق الجداول والسياسات
supabase db push

# أو إعادة تعيين كاملة
supabase db reset
```

#### 3. تكوين متغيرات البيئة
```bash
# نسخ متغيرات البيئة من خرج supabase start
cp .env.example .env.local

# تحديث المتغيرات:
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=[المفتاح من خرج supabase start]
```

### روابط الخدمة المحلية

بعد `supabase start`:
- **Studio UI**: http://127.0.0.1:54323
- **API Gateway**: http://127.0.0.1:54321  
- **Database URL**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Storage**: http://127.0.0.1:54321/storage/v1

## 🗄️ هيكل قاعدة البيانات

### الجداول الأساسية

#### 📋 Boards (اللوحات)
```sql
-- اللوحة الرئيسية للتعاون
- id (UUID): المعرف الفريد
- title (TEXT): عنوان اللوحة  
- owner_id (UUID): مالك اللوحة
- settings (JSONB): إعدادات اللوحة
- is_public (BOOLEAN): هل اللوحة عامة
```

#### 🎯 Board Objects (عناصر اللوحة)
```sql
-- العناصر داخل اللوحة (نص، أشكال، صور)
- id (UUID): المعرف الفريد
- board_id (UUID): معرف اللوحة
- type (ENUM): نوع العنصر
- position (JSONB): موقع العنصر {x, y}
- size (JSONB): حجم العنصر {width, height}
- style (JSONB): التنسيق والألوان
- content (TEXT): المحتوى النصي
```

#### 🔗 Links (الروابط)
```sql  
-- روابط بين العناصر
- from_object_id, to_object_id: العناصر المترابطة
- style (JSONB): نمط الرابط
```

#### 👥 Board Permissions (الأذونات)
```sql
-- نظام الأدوار: host/editor/viewer
- user_id, board_id: المستخدم واللوحة
- role (ENUM): الدور المخصص
```

### الجداول المساعدة

- **snapshots**: لقطات للنسخ الاحتياطية
- **op_log**: سجل العمليات للمزامنة المباشرة
- **projects, project_phases, project_tasks**: إدارة المشاريع
- **telemetry_events**: تحليلات الاستخدام

## 🔐 نظام الأذونات (RLS)

### الأدوار المتاحة

| الدور | الصلاحيات |
|-------|-----------|
| **host** | مالك اللوحة - صلاحيات كاملة |
| **editor** | تحرير العناصر والروابط |
| **viewer** | عرض فقط |

### أمثلة السياسات

```sql
-- عرض اللوحات المتاحة
"Users can view accessible boards": 
  owner_id = auth.uid() OR is_public = true OR has_board_access()

-- تحرير العناصر
"Editors can update objects":
  user_has_board_role(board_id, auth.uid(), 'editor')
```

## 📁 نظام التخزين

### Bucket: board-assets

```bash
# هيكل المجلدات
board-assets/
├── {board_id}/
│   ├── images/
│   │   ├── screenshot_001.png
│   │   └── upload_avatar.jpg
│   ├── documents/
│   │   └── requirements.pdf
│   └── exports/
│       └── board_export.json
```

### سياسات الوصول

- **المشاهدون**: يمكنهم عرض ملفات اللوحات المتاحة لهم
- **المحررون**: يمكنهم رفع وحذف الملفات
- **الهيكل**: `{board_id}/{file_name}` لربط الملفات باللوحات

## 🔄 Real-time و التعاون المباشر

### الجداول المفعلة للـ Real-time

- `boards` - تغييرات إعدادات اللوحة
- `board_objects` - حركة وتعديل العناصر
- `links` - إضافة وحذف الروابط  
- `op_log` - سجل العمليات للمزامنة
- `board_permissions` - تغييرات الأذونات

### مثال الاستخدام

```javascript
// الاشتراك في تغييرات لوحة معينة
const subscription = supabase
  .channel(`board:${boardId}`)
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'board_objects' },
    (payload) => handleObjectChange(payload)
  )
  .subscribe()
```

## 🛠️ أوامر الصيانة

### إعادة تعيين قاعدة البيانات
```bash
# مسح كامل وإعادة بناء
supabase db reset

# تطبيق التغييرات الجديدة فقط  
supabase db push
```

### النسخ الاحتياطي والاستعادة
```bash
# نسخ احتياطي
supabase db dump > backup.sql

# استعادة
supabase db reset
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres < backup.sql
```

### مراقبة الأداء
```bash
# عرض الاتصالات النشطة
supabase db ls

# مراقبة السجلات
supabase logs db
```

## 🧪 البيانات التجريبية

### إنشاء لوحة تجريبية
```sql
-- إنشاء لوحة
INSERT INTO public.boards (title, owner_id, settings) 
VALUES ('لوحة تجريبية', auth.uid(), '{"theme": "light"}');

-- إضافة عناصر
INSERT INTO public.board_objects (board_id, type, position, content)
VALUES 
  (board_id, 'text', '{"x": 100, "y": 100}', 'مرحبا بكم'),
  (board_id, 'sticky_note', '{"x": 300, "y": 200}', 'ملاحظة مهمة');
```

### إدارة الأذونات
```sql
-- منح صلاحية محرر
INSERT INTO public.board_permissions (board_id, user_id, role, granted_by)
VALUES (board_id, target_user_id, 'editor', auth.uid());

-- عرض أذونات لوحة
SELECT bp.*, u.email 
FROM public.board_permissions bp
JOIN auth.users u ON u.id = bp.user_id
WHERE bp.board_id = 'your-board-id';
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

#### خطأ RLS
```
Row-level security policy violation
```
**الحل**: تأكد من وجود أذونات للمستخدم في `board_permissions`

#### فشل الاتصال
```  
Connection refused
```
**الحل**: تأكد من تشغيل `supabase start` وانتظار اكتمال البدء

#### مشاكل التخزين
```
Storage operation not permitted
```
**الحل**: تحقق من سياسات Storage والمسار الصحيح `{board_id}/file`

### فحص النظام
```bash
# حالة الخدمات
supabase status

# اختبار الاتصال
curl http://127.0.0.1:54321/rest/v1/boards \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## 📚 موارد إضافية

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Storage API](https://supabase.com/docs/guides/storage)

## 🔧 النشر للإنتاج

### متغيرات البيئة الإنتاجية
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### الأمان الإنتاجي
- تفعيل تأكيد البريد الإلكتروني
- تحديد معدل الطلبات (Rate Limiting) 
- مراجعة سياسات RLS
- تفعيل SSL للاتصالات

---

**ملاحظة**: هذا النظام مصمم للعمل حصرياً مع Supabase. لا توجد خدمات خارجية مطلوبة.