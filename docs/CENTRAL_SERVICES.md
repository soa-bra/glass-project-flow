# Central Services — مرجع API

> طبقة `src/services/central/*` هي **المصدر الوحيد** للوصول إلى النموذج المركزي. لا تستورد من Supabase مباشرةً من المكوّنات.

## مبدأ الاستدعاء

```ts
import { ProjectsService, TasksService } from "@/services/central";
```

كل خدمة تتعامل مع جدول واحد أو حدّ مجال مركزي واحد، وتعيد صفوفًا متوافقة مع أنواع `Database["public"]["Tables"]` أو عقودها المشتقة.

## الخدمات المتاحة حاليًا

| Service | المسؤولية الحالية | ملاحظات |
|---|---|---|
| `ProjectsService` | CRUD على `projects` | الأرشفة تتم حاليًا عبر `updateProject({ state: "archived" })` وليس عبر دالة `archive` مستقلة. |
| `TasksService` | CRUD مرتبط بالمهام | يستخدم لاحقًا كأساس لمواءمة تدفقات التنفيذ. |
| `DepartmentsService` | CRUD على `departments` | جزء من المسار المركزي للمساحات الوظيفية. |
| `CentralBoardsService` | CRUD على `central_boards` | يمثل المسار التشغيلي المركزي خارج Planning canvas. |
| `ToolsService` | CRUD على `tools` | مرتبط بالـ central boards والمهام. |
| `EngineJobsService` | CRUD وانتقالات على `engine_jobs` | مرتبط بالنموذج الحدثي والتشغيل غير المتزامن. |
| `DependenciesService` | CRUD على `dependencies` | يمثل علاقات cross-entity المركزية. |
| `SearchService` | بحث متعدد المساحات | واجهة بحث مركزية. |
| `RolesService` | إدارة `user_roles` | جزء من RBAC التشغيلي. |
| `PermissionsService` | فحص `has_permission` وفرضه | الحدّ الأمامي الموحد للصلاحيات. |
| `AuditService` | كتابة وقراءة `audit_events` | يسجل القرارات والعمليات الحساسة. |
| `PlanningBoardsService` | CRUD على `planning_boards` و`planning_elements` | هو الحدّ المركزي الحاكم لـ Planning persistence. |

## React Query Hooks

استخدم `@/hooks/central` بدل استدعاء الخدمات مباشرة من المكوّنات:

```ts
import { useProjects, useCreateProject } from "@/hooks/central";
```

`centralKeys` يوحّد مفاتيح الـ cache ويدعم invalidation المنضبط.

## قواعد ملزمة

- لا `supabase.from(...)` داخل `src/components` أو `src/features` للمجال المركزي؛ مرّ عبر Service أو Hook.
- لا تعريف أنواع يدوية موازية لجداول central عندما يمكن الاعتماد على أنواع Supabase المولدة أو العقود المشتقة منها.
- كل mutation يجب أن يملك مسار invalidation واضحًا.
- كل عملية حساسة يجب أن تمر عبر صلاحيات وتسجيل تدقيقي عند الحاجة.

## ملاحظة تنفيذية

هذا الملف يصف **الحقيقة الحالية القابلة للتنفيذ**، لا الحالة المثالية المستقبلية.
أي سلوك لم يُنفذ بعد يجب أن يوثق في مسار spec alignment، لا أن يُعرض هنا وكأنه موجود بالفعل.
