# Step 11 Appendix — RLS Policy Mapping (Updated from Live DB Output)

- المصدر: مخرجات `pg_policies` الحية (2026-05-03)
- الحالة: In Progress (policy coverage expanded)

## Policy Inventory (Live)
| schemaname | tablename | policyname |
|---|---|---|
| public | audit_events | audit insert auth |
| public | audit_events | audit read own |
| public | board_invite_links | Hosts can manage invite links |
| public | board_join_requests | Anyone with valid token can create join requests |
| public | board_join_requests | Board hosts can view join requests |
| public | board_join_requests | Hosts can manage join requests |
| public | board_objects | Authenticated editors can create objects |
| public | board_objects | Authenticated editors can delete objects |
| public | board_objects | Authenticated editors can update objects |
| public | board_objects | Authenticated users can view board objects |
| public | board_permissions | Authenticated hosts can manage permissions |
| public | board_permissions | Authenticated users can view board permissions |
| public | boards | Authenticated hosts can update boards |
| public | boards | Authenticated owners can delete boards |
| public | boards | Authenticated users can create boards |
| public | boards | Authenticated users can view accessible boards |
| public | central_boards | owners manage central_boards |
| public | department_projects | manage department_projects |
| public | departments | owners manage departments |
| public | dependencies | auth manage dependencies |
| public | dependencies | auth read dependencies |
| public | dependencies | owner delete dependencies |
| public | dependencies | owner update dependencies |
| public | engine_jobs | owners manage engine_jobs |
| public | event_dlq | owner reads dlq |
| public | event_outbox | owner reads outbox |
| public | invoice_items | Users can manage own invoice items |
| public | invoice_payments | Users can manage own invoice payments |
| public | invoices | Users can create own invoices |
| public | invoices | Users can delete own invoices |
| public | invoices | Users can update own invoices |
| public | invoices | Users can view own invoices |
| public | links | Authenticated editors can manage links |
| public | links | Authenticated users can view links |
| public | op_log | Editors can log operations |
| public | op_log | Users can view operations |
| public | permissions | auth read permissions |
| public | permissions | owner manages permissions |
| public | profiles | users insert own profile |
| public | profiles | users read own profile |
| public | profiles | users update own profile |
| public | project_cards | owners manage project_cards |
| public | projects | owners manage projects |
| public | role_permissions | auth read role_permissions |
| public | role_permissions | owner manages role_permissions |
| public | smart_element_data | Editors can create smart element data |
| public | smart_element_data | Editors can delete smart element data |
| public | smart_element_data | Editors can update smart element data |
| public | smart_element_data | Users can view smart element data |
| public | snapshots | Editors can create snapshots |
| public | snapshots | Hosts can delete snapshots |
| public | snapshots | Users can view snapshots |
| public | task_cards | owners manage task_cards |
| public | task_tool_engine_links | manage task_tool_engine_links |
| public | tasks | tasks owner delete |
| public | tasks | tasks owner manage |
| public | tasks | tasks owner update |
| public | tasks | tasks visibility |
| public | telemetry_events | Users can insert own telemetry |
| public | telemetry_events | Users can view own telemetry |
| public | tools | owners manage tools |
| public | user_roles | owner manages roles |
| public | user_roles | users read own roles |

## Coverage Notes
1. سياسات الجداول المركزية (projects/tasks/dependencies/tools/engine_jobs) موجودة ومتسقة مع المصفوفة.
2. سياسات invoice_* موجودة في البيئة الحية ويجب ربطها صراحة في مصفوفة الصلاحيات.
3. سياسات event_outbox/event_dlq owner-only مؤكدة في البيئة الحية.

## Remaining to Close Step 11
1. ربط كل policy بالـ service/hook المقابل داخل التطبيق.
2. إرفاق أدلة runtime allow/deny تحت أدوار متعددة (owner/team_member/unauthorized).
