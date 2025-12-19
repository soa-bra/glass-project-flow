/**
 * Versions API - Sprint 7
 * إدارة اللقطات والتاريخ
 */

import { supabase } from '@/integrations/supabase/client';

export interface Snapshot {
  id: string;
  boardId: string;
  name: string;
  description?: string;
  data: unknown;
  fileSize: number;
  createdAt: string;
  createdBy: string;
}

export interface VersionHistoryEntry {
  id: string;
  boardId: string;
  version: number;
  changeType: 'create' | 'update' | 'delete';
  elementId?: string;
  previousData?: unknown;
  newData?: unknown;
  userId: string;
  timestamp: string;
}

/**
 * إنشاء لقطة
 */
export async function createSnapshot(
  boardId: string,
  name: string,
  description: string | undefined,
  data: unknown,
  userId: string
): Promise<{ success: boolean; snapshot?: Snapshot; error?: string }> {
  try {
    const jsonData = JSON.stringify(data);
    const fileSize = new Blob([jsonData]).size;

    const { data: snapshot, error } = await supabase
      .from('snapshots')
      .insert({
        board_id: boardId,
        name,
        description,
        data: data as any,
        file_size: fileSize,
        created_by: userId
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      snapshot: {
        id: snapshot.id,
        boardId: snapshot.board_id,
        name: snapshot.name,
        description: snapshot.description || undefined,
        data: snapshot.data,
        fileSize: snapshot.file_size || 0,
        createdAt: snapshot.created_at || new Date().toISOString(),
        createdBy: snapshot.created_by
      }
    };
  } catch (error) {
    console.error('Error creating snapshot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * تحميل اللقطات
 */
export async function loadSnapshots(
  boardId: string
): Promise<{ success: boolean; snapshots: Snapshot[]; error?: string }> {
  try {
    const { data: snapshots, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      snapshots: (snapshots || []).map(s => ({
        id: s.id,
        boardId: s.board_id,
        name: s.name,
        description: s.description || undefined,
        data: s.data,
        fileSize: s.file_size || 0,
        createdAt: s.created_at || new Date().toISOString(),
        createdBy: s.created_by
      }))
    };
  } catch (error) {
    console.error('Error loading snapshots:', error);
    return {
      success: false,
      snapshots: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * استعادة لقطة
 */
export async function restoreSnapshot(
  snapshotId: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const { data: snapshot, error } = await supabase
      .from('snapshots')
      .select('*')
      .eq('id', snapshotId)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: snapshot.data
    };
  } catch (error) {
    console.error('Error restoring snapshot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * حذف لقطة
 */
export async function deleteSnapshot(
  snapshotId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('snapshots')
      .delete()
      .eq('id', snapshotId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting snapshot:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * تحميل سجل التغييرات
 */
export async function loadVersionHistory(
  boardId: string,
  limit = 50
): Promise<{ success: boolean; entries: VersionHistoryEntry[]; error?: string }> {
  try {
    const { data: entries, error } = await supabase
      .from('op_log')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      entries: (entries || []).map((e, index) => ({
        id: e.id,
        boardId: e.board_id,
        version: limit - index,
        changeType: e.operation_type as 'create' | 'update' | 'delete',
        elementId: e.object_id,
        newData: e.data,
        userId: e.user_id,
        timestamp: e.created_at || new Date().toISOString()
      }))
    };
  } catch (error) {
    console.error('Error loading version history:', error);
    return {
      success: false,
      entries: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * مقارنة نسختين
 */
export function compareVersions(
  version1: unknown,
  version2: unknown
): { added: string[]; removed: string[]; modified: string[] } {
  const v1Elements = (version1 as any)?.elements || [];
  const v2Elements = (version2 as any)?.elements || [];

  const v1Ids = new Set(v1Elements.map((e: any) => e.id));
  const v2Ids = new Set(v2Elements.map((e: any) => e.id));

  const added: string[] = [];
  const removed: string[] = [];
  const modified: string[] = [];

  // العناصر المضافة
  for (const id of v2Ids) {
    if (!v1Ids.has(id)) {
      added.push(id as string);
    }
  }

  // العناصر المحذوفة
  for (const id of v1Ids) {
    if (!v2Ids.has(id)) {
      removed.push(id as string);
    }
  }

  // العناصر المعدلة
  for (const v2El of v2Elements) {
    if (v1Ids.has(v2El.id)) {
      const v1El = v1Elements.find((e: any) => e.id === v2El.id);
      if (JSON.stringify(v1El) !== JSON.stringify(v2El)) {
        modified.push(v2El.id);
      }
    }
  }

  return { added, removed, modified };
}
