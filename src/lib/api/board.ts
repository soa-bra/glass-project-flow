/**
 * Board API - Sprint 7
 * حفظ واسترجاع نموذج اللوحة
 */

import { supabase } from '@/integrations/supabase/client';

export interface BoardModel {
  id: string;
  title: string;
  description?: string;
  elements: unknown[];
  settings: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface SaveBoardResult {
  success: boolean;
  boardId?: string;
  version?: number;
  error?: string;
}

export interface LoadBoardResult {
  success: boolean;
  board?: BoardModel;
  error?: string;
}

/**
 * حفظ اللوحة
 */
export async function saveBoard(
  boardId: string,
  data: {
    title?: string;
    description?: string;
    elements?: unknown[];
    settings?: Record<string, unknown>;
  }
): Promise<SaveBoardResult> {
  try {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };
    
    if (data.title) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.settings) updateData.settings = JSON.parse(JSON.stringify(data.settings));

    const { data: board, error } = await supabase
      .from('boards')
      .update(updateData)
      .eq('id', boardId)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      boardId: board.id
    };
  } catch (error) {
    console.error('Error saving board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * تحميل اللوحة
 */
export async function loadBoard(boardId: string): Promise<LoadBoardResult> {
  try {
    const { data: board, error } = await supabase
      .from('boards')
      .select('*')
      .eq('id', boardId)
      .single();

    if (error) throw error;

    // تحميل العناصر
    const { data: elements, error: elementsError } = await supabase
      .from('board_objects')
      .select('*')
      .eq('board_id', boardId)
      .order('z_index', { ascending: true });

    if (elementsError) throw elementsError;

    return {
      success: true,
      board: {
        id: board.id,
        title: board.title,
        description: board.description || undefined,
        elements: elements || [],
        settings: (board.settings as Record<string, unknown>) || {},
        version: 1,
        createdAt: board.created_at || new Date().toISOString(),
        updatedAt: board.updated_at || new Date().toISOString(),
        ownerId: board.owner_id
      }
    };
  } catch (error) {
    console.error('Error loading board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * إنشاء لوحة جديدة
 */
export async function createBoard(
  data: {
    title: string;
    description?: string;
    ownerId: string;
  }
): Promise<SaveBoardResult> {
  try {
    const { data: board, error } = await supabase
      .from('boards')
      .insert({
        title: data.title,
        description: data.description,
        owner_id: data.ownerId,
        settings: {},
        is_public: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      boardId: board.id,
      version: 1
    };
  } catch (error) {
    console.error('Error creating board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * حذف لوحة
 */
export async function deleteBoard(boardId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', boardId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * تكرار لوحة
 */
export async function duplicateBoard(
  boardId: string,
  newOwnerId: string
): Promise<SaveBoardResult> {
  try {
    // تحميل اللوحة الأصلية
    const result = await loadBoard(boardId);
    if (!result.success || !result.board) {
      return { success: false, error: 'Board not found' };
    }

    // إنشاء نسخة
    const createResult = await createBoard({
      title: `${result.board.title} (نسخة)`,
      description: result.board.description,
      ownerId: newOwnerId
    });

    if (!createResult.success || !createResult.boardId) {
      return createResult;
    }

    // نسخ العناصر
    if (result.board.elements.length > 0) {
      const elementsToInsert = result.board.elements.map((el: any) => ({
        ...el,
        id: undefined,
        board_id: createResult.boardId,
        created_at: undefined,
        updated_at: undefined
      }));

      const { error } = await supabase
        .from('board_objects')
        .insert(elementsToInsert);

      if (error) {
        console.error('Error copying elements:', error);
      }
    }

    return createResult;
  } catch (error) {
    console.error('Error duplicating board:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
