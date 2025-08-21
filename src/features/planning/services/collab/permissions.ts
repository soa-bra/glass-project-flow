// src/features/planning/services/collab/permissions.ts
export type Role = 'Owner'|'Editor'|'Commenter'|'Viewer';
export const canEdit = (role: Role)=> role==='Owner'||role==='Editor';
