export type PermissionCode = string;

export const BOX_PERMISSIONS = {
  settings: ["settings.admin", "settings.security"],
  archive: ["archive.records.read", "archive.records.export", "archive.records.manage"],
  projectManagementBoard: ["project.read", "project.write", "project.approve", "project.files"],
  departments: {
    financial: ["financial.read", "financial.write", "financial.approve"],
    legal: ["legal.read", "legal.write", "legal.approve"],
    hr: ["hr.read", "hr.write", "hr.approve"],
  },
} as const;

export const ACTION_PERMISSIONS = {
  "settings.open": ["settings.admin", "settings.security"],
  "archive.open": ["archive.records.read"],
  "archive.export": ["archive.records.export"],
  "archive.manage": ["archive.records.manage"],
  "project.open": ["project.read"],
  "project.edit": ["project.write"],
  "project.archive": ["project.approve"],
  "project.delete": ["project.approve"],
  "project.files.open": ["project.files"],
  "financial.open": ["financial.read"],
  "financial.edit": ["financial.write"],
  "financial.approve": ["financial.approve"],
  "legal.open": ["legal.read"],
  "legal.edit": ["legal.write"],
  "legal.approve": ["legal.approve"],
  "hr.open": ["hr.read"],
  "hr.edit": ["hr.write"],
  "hr.approve": ["hr.approve"],
} as const;

export type BoxRef = keyof typeof BOX_PERMISSIONS;
export type ActionCode = keyof typeof ACTION_PERMISSIONS;

const hasAnyPermission = (required: readonly PermissionCode[], granted: ReadonlySet<PermissionCode>) =>
  required.some((permission) => granted.has(permission));

export const canAccessBox = (boxRef: BoxRef, granted: ReadonlySet<PermissionCode>) => {
  const required = BOX_PERMISSIONS[boxRef];

  if (Array.isArray(required)) {
    return hasAnyPermission(required, granted);
  }

  return Object.values(required).some((permissions) => hasAnyPermission(permissions, granted));
};

export const canRunAction = (actionCode: ActionCode, granted: ReadonlySet<PermissionCode>) =>
  hasAnyPermission(ACTION_PERMISSIONS[actionCode], granted);
