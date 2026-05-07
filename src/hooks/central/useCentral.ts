/**
 * Central Hooks — React Query bindings for the central services.
 *
 * All cache keys live in `centralKeys` so invalidations stay consistent.
 */
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  CentralBoardsService,
  DepartmentsService,
  DependenciesService,
  EngineJobsService,
  ProjectsService,
  TasksService,
  ToolsService,
} from "@/services/central";
import type {
  CentralBoard,
  CentralBoardCreateInput,
  Department,
  DepartmentCreateInput,
  Dependency,
  EngineJob,
  EngineJobCreateInput,
  Project,
  ProjectCreateInput,
  ProjectUpdateInput,
  Task,
  TaskCreateInput,
  TaskUpdateInput,
  Tool,
  ToolCreateInput,
} from "@/types/central";

export const centralKeys = {
  projects: ["central", "projects"] as const,
  project: (id: string) => ["central", "projects", id] as const,
  tasks: (projectId: string) => ["central", "tasks", projectId] as const,
  departments: ["central", "departments"] as const,
  centralBoards: ["central", "central_boards"] as const,
  tools: (boardId?: string) =>
    boardId ? (["central", "tools", boardId] as const) : (["central", "tools"] as const),
  engineJobs: ["central", "engine_jobs"] as const,
  dependencies: ["central", "dependencies"] as const,
};

// ── Projects ────────────────────────────────────────────────────────────────
export function useProjects(): UseQueryResult<Project[]> {
  return useQuery({ queryKey: centralKeys.projects, queryFn: ProjectsService.listProjects });
}

export function useProject(id: string | null): UseQueryResult<Project | null> {
  return useQuery({
    queryKey: id ? centralKeys.project(id) : ["central", "projects", "null"],
    queryFn: () => (id ? ProjectsService.getProject(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ProjectCreateInput) => ProjectsService.createProject(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.projects }),
  });
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ProjectUpdateInput }) =>
      ProjectsService.updateProject(id, patch),
    onSuccess: (p) => {
      qc.invalidateQueries({ queryKey: centralKeys.projects });
      qc.invalidateQueries({ queryKey: centralKeys.project(p.id) });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProjectsService.deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.projects }),
  });
}

// ── Tasks ───────────────────────────────────────────────────────────────────
export function useProjectTasks(projectId: string | null): UseQueryResult<Task[]> {
  return useQuery({
    queryKey: projectId ? centralKeys.tasks(projectId) : ["central", "tasks", "null"],
    queryFn: () => (projectId ? TasksService.listTasksByProject(projectId) : Promise.resolve([])),
    enabled: !!projectId,
  });
}

export function useCreateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TaskCreateInput) => TasksService.createTask(input),
    onSuccess: (t) => qc.invalidateQueries({ queryKey: centralKeys.tasks(t.linked_project_id) }),
  });
}

export function useUpdateTask() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TaskUpdateInput }) =>
      TasksService.updateTask(id, patch),
    onSuccess: (t) => qc.invalidateQueries({ queryKey: centralKeys.tasks(t.linked_project_id) }),
  });
}

// ── Departments ─────────────────────────────────────────────────────────────
export function useDepartments(): UseQueryResult<Department[]> {
  return useQuery({
    queryKey: centralKeys.departments,
    queryFn: DepartmentsService.listDepartments,
  });
}
export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: DepartmentCreateInput) => DepartmentsService.createDepartment(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.departments }),
  });
}

// ── Central Boards ──────────────────────────────────────────────────────────
export function useCentralBoards(): UseQueryResult<CentralBoard[]> {
  return useQuery({
    queryKey: centralKeys.centralBoards,
    queryFn: CentralBoardsService.listCentralBoards,
  });
}
export function useCreateCentralBoard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CentralBoardCreateInput) =>
      CentralBoardsService.createCentralBoard(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.centralBoards }),
  });
}

// ── Tools ───────────────────────────────────────────────────────────────────
export function useBoardTools(centralBoardId?: string): UseQueryResult<Tool[]> {
  return useQuery({
    queryKey: centralKeys.tools(centralBoardId),
    queryFn: () => ToolsService.listTools(centralBoardId),
  });
}
export function useCreateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ToolCreateInput) => ToolsService.createTool(input),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: centralKeys.tools(t.central_board_id) });
      qc.invalidateQueries({ queryKey: centralKeys.tools() });
    },
  });
}

// ── Engine Jobs ─────────────────────────────────────────────────────────────
export function useEngineJobs(): UseQueryResult<EngineJob[]> {
  return useQuery({
    queryKey: centralKeys.engineJobs,
    queryFn: EngineJobsService.listEngineJobs,
  });
}
export function useCreateEngineJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: EngineJobCreateInput) => EngineJobsService.createEngineJob(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: centralKeys.engineJobs }),
  });
}

// ── Dependencies ────────────────────────────────────────────────────────────
export function useDependencies(): UseQueryResult<Dependency[]> {
  return useQuery({
    queryKey: centralKeys.dependencies,
    queryFn: DependenciesService.listDependencies,
  });
}
