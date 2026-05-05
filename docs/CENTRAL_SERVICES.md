# Central Services — مرجع API

> طبقة `src/services/central/*` هي **المصدر الوحيد** للوصول إلى النموذج المركزي. لا تستورد من Supabase مباشرةً من المكوّنات.

## مبدأ الاستدعاء

```ts
import { ProjectsService, TasksService } from "@/services/central";

const projects = await ProjectsService.list({ ownerId });
```

كل خدمة تتعامل مع جدول واحد + علاقاته القريبة فقط، وتعيد صفوفًا مطابقة لـ `Database["public"]["Tables"]`.

## الخدمات المتاحة

| Service | الجدول | العمليات |
|---|---|---|
| `ProjectsService` | `projects` | `list, get, create, update, archive, delete` |
| `TasksService` | `tasks` | `listByProject, get, create, update, complete, delete` |
| `DepartmentsService` | `departments` | `list, get, create, update, archive` |
| `CentralBoardsService` | `central_boards` | `list, get, create, update` |
| `ToolsService` | `tools` | `listByBoard, get, create, update, retire` |
| `EngineJobsService` | `engine_jobs` | `list, get, create, transition` |
| `DependenciesService` | `dependencies` | `listFor, create, delete` |
| `SearchService` | متعدد | `crossWorkspace(query)` |
| `RolesService` | `user_roles` | `list, assign, revoke` |
| `AuditService` | `audit_events` | `log, query` |

## React Query Hooks

استخدم `@/hooks/central` بدل استدعاء الخدمات مباشرة من المكوّنات:

```ts
import { useProjects, useCreateProject } from "@/hooks/central";

const { data, isLoading } = useProjects();
const create = useCreateProject();
```

`centralKeys` يوحّد مفاتيح الـ cache ويُمكِّن invalidation الذكي.

## Command Gateway

العمليات الكاتبة الحساسة تُلَفّ بـ `withAuthorizationAndAudit`:

```ts
import { withAuthorizationAndAudit } from "@/services/central/withAuthorizationAndAudit";

export const archiveProject = withAuthorizationAndAudit(
  { permission: "project:archive", resource_type: "project", action: "project.archive" },
  (id: string) => ProjectsService.archive(id),
  { resolveResourceId: ([id]) => id },
);
```

السلوك:
1. فحص `has_permission` (RPC).
2. تنفيذ.
3. كتابة `audit_events` (allowed/denied).
4. إن فشل audit log لا تُسقَط العملية الأصلية.

## قواعد ملزِمة

- ✗ لا `supabase.from(...)` داخل `src/components` أو `src/features` — مرّ دائمًا عبر Service أو Hook.
- ✗ لا تعريف types يدويًا لجداول central — استخدم `Database["public"]["Tables"][...]["Row"]`.
- ✓ كل mutation يجب أن تستدعي `queryClient.invalidateQueries({ queryKey: centralKeys.x })`.
