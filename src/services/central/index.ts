/**
 * Central Services — public API.
 *
 * Single re-export surface for all central CRUD services. Feature code
 * MUST import from `@/services/central` (never deep paths) to keep the
 * boundary stable and refactor-safe.
 */
export * as ProjectsService from "./projects.service";
export * as TasksService from "./tasks.service";
export * as DepartmentsService from "./departments.service";
export * as CentralBoardsService from "./centralBoards.service";
export * as ToolsService from "./tools.service";
export * as EngineJobsService from "./engineJobs.service";
export * as DependenciesService from "./dependencies.service";
export * as SearchService from "./search.service";
export * as RolesService from "./roles.service";
