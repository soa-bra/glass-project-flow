import type { ArchiveCategoryKey, ArchiveRecord } from "./archiveData";

export type ArchivePermissionScope =
  | "archive.records.read"
  | "archive.records.export"
  | "archive.records.manage";

export interface ArchiveSearchInput {
  query?: string;
}

export interface ArchiveFilterInput {
  type?: string;
  owner?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface ArchiveExportPayload {
  category: ArchiveCategoryKey;
  exportedAt: string;
  records: ArchiveRecord[];
}

export interface ArchiveCategoryServiceContract {
  category: ArchiveCategoryKey;
  source: "central-projects" | "unified-archive";
  requiredScopes: {
    read: ArchivePermissionScope;
    export: ArchivePermissionScope;
    manage: ArchivePermissionScope;
  };
}

export const ARCHIVE_CATEGORY_SERVICE_CONTRACTS: Record<
  ArchiveCategoryKey,
  ArchiveCategoryServiceContract
> = {
  projects: {
    category: "projects",
    source: "central-projects",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  documents: {
    category: "documents",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  hr: {
    category: "hr",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  financial: {
    category: "financial",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  legal: {
    category: "legal",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  organizational: {
    category: "organizational",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  knowledge: {
    category: "knowledge",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  templates: {
    category: "templates",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
  policies: {
    category: "policies",
    source: "unified-archive",
    requiredScopes: {
      read: "archive.records.read",
      export: "archive.records.export",
      manage: "archive.records.manage",
    },
  },
};

