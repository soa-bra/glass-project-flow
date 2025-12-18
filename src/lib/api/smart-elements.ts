import { supabase } from '@/integrations/supabase/client';
import {
  SmartElementType,
  SmartElementDataSchemaMap,
  SmartElementDataType,
  getDefaultSmartElementData,
  parseSmartElementData,
} from '@/types/smart-elements';
import { migrateKanbanLegacyData } from '@/utils/kanbanLegacyMigration';
import type { Json } from '@/integrations/supabase/types';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface CreateSmartElementParams {
  boardId: string;
  type: SmartElementType;
  position: Position;
  size?: Size;
  createdBy: string;
}

interface SmartElementRecord {
  id: string;
  boardObjectId: string;
  smartType: SmartElementType;
  data: Json;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// Default sizes for different smart element types
const DEFAULT_SIZES: Record<SmartElementType, Size> = {
  thinking_board: { width: 400, height: 300 },
  kanban: { width: 800, height: 500 },
  voting: { width: 400, height: 350 },
  brainstorming: { width: 600, height: 400 },
  timeline: { width: 700, height: 200 },
  decisions_matrix: { width: 600, height: 400 },
  gantt: { width: 800, height: 400 },
  interactive_sheet: { width: 600, height: 400 },
  mind_map: { width: 600, height: 500 },
  project_card: { width: 320, height: 200 },
  finance_card: { width: 320, height: 200 },
  csr_card: { width: 320, height: 200 },
  crm_card: { width: 320, height: 200 },
  root_connector: { width: 200, height: 100 },
};

export const smartElementsApi = {
  /**
   * Create a new smart element with board object and smart data
   */
  create: async <T extends SmartElementType>({
    boardId,
    type,
    position,
    size,
    createdBy,
  }: CreateSmartElementParams): Promise<SmartElementRecord | null> => {
    const elementSize = size || DEFAULT_SIZES[type];
    const defaultData = getDefaultSmartElementData(type);

    // Create board object first
    const { data: boardObject, error: boardObjectError } = await supabase
      .from('board_objects')
      .insert({
        board_id: boardId,
        type: 'smart',
        position: { x: position.x, y: position.y },
        size: { width: elementSize.width, height: elementSize.height },
        created_by: createdBy,
        metadata: { smartType: type },
      })
      .select()
      .single();

    if (boardObjectError || !boardObject) {
      console.error('Failed to create board object:', boardObjectError);
      return null;
    }

    // Create smart element data
    const { data: smartData, error: smartDataError } = await supabase
      .from('smart_element_data')
      .insert({
        board_object_id: boardObject.id,
        smart_type: type,
        data: defaultData as Json,
        version: 1,
      })
      .select()
      .single();

    if (smartDataError || !smartData) {
      console.error('Failed to create smart element data:', smartDataError);
      // Rollback board object creation
      await supabase.from('board_objects').delete().eq('id', boardObject.id);
      return null;
    }

    return {
      id: smartData.id,
      boardObjectId: boardObject.id,
      smartType: type,
      data: smartData.data,
      version: smartData.version,
      createdAt: smartData.created_at,
      updatedAt: smartData.updated_at,
    };
  },

  /**
   * Read smart element data by board object ID
   */
  read: async (boardObjectId: string): Promise<SmartElementRecord | null> => {
    const { data, error } = await supabase
      .from('smart_element_data')
      .select('*')
      .eq('board_object_id', boardObjectId)
      .maybeSingle();

    if (error || !data) {
      console.error('Failed to read smart element:', error);
      return null;
    }

    const smartType = data.smart_type as SmartElementType;
    const raw = data.data;

    // ✅ ترحيل كانبان القديم (cardIds + cards record) إلى columns[].cards وحفظه مرة واحدة
    if (smartType === 'kanban') {
      const migrated = migrateKanbanLegacyData(raw);
      const validated = parseSmartElementData('kanban', migrated.data);

      if (migrated.migrated) {
        const { data: updatedRow } = await supabase
          .from('smart_element_data')
          .update({
            data: validated as Json,
            version: data.version + 1,
          })
          .eq('board_object_id', boardObjectId)
          .eq('version', data.version)
          .select('*')
          .maybeSingle();

        if (updatedRow) {
          return {
            id: updatedRow.id,
            boardObjectId: updatedRow.board_object_id,
            smartType: updatedRow.smart_type as SmartElementType,
            data: updatedRow.data,
            version: updatedRow.version,
            createdAt: updatedRow.created_at,
            updatedAt: updatedRow.updated_at,
          };
        }
      }

      return {
        id: data.id,
        boardObjectId: data.board_object_id,
        smartType,
        data: validated as Json,
        version: data.version,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const validated = parseSmartElementData(smartType, raw);

    return {
      id: data.id,
      boardObjectId: data.board_object_id,
      smartType,
      data: validated as unknown as Json,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Read smart element by its own ID
   */
  readById: async (elementId: string): Promise<SmartElementRecord | null> => {
    const { data, error } = await supabase
      .from('smart_element_data')
      .select('*')
      .eq('id', elementId)
      .maybeSingle();

    if (error || !data) {
      console.error('Failed to read smart element by ID:', error);
      return null;
    }

    const smartType = data.smart_type as SmartElementType;
    const raw = data.data;

    if (smartType === 'kanban') {
      const migrated = migrateKanbanLegacyData(raw);
      const validated = parseSmartElementData('kanban', migrated.data);

      if (migrated.migrated) {
        const { data: updatedRow } = await supabase
          .from('smart_element_data')
          .update({
            data: validated as Json,
            version: data.version + 1,
          })
          .eq('board_object_id', data.board_object_id)
          .eq('version', data.version)
          .select('*')
          .maybeSingle();

        if (updatedRow) {
          return {
            id: updatedRow.id,
            boardObjectId: updatedRow.board_object_id,
            smartType: updatedRow.smart_type as SmartElementType,
            data: updatedRow.data,
            version: updatedRow.version,
            createdAt: updatedRow.created_at,
            updatedAt: updatedRow.updated_at,
          };
        }
      }

      return {
        id: data.id,
        boardObjectId: data.board_object_id,
        smartType,
        data: validated as Json,
        version: data.version,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const validated = parseSmartElementData(smartType, raw);

    return {
      id: data.id,
      boardObjectId: data.board_object_id,
      smartType,
      data: validated as unknown as Json,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Update smart element data with optimistic locking
   */
  update: async <T extends SmartElementType>(
    boardObjectId: string,
    updates: Partial<SmartElementDataType<T>>,
    expectedVersion?: number
  ): Promise<SmartElementRecord | null> => {
    // First read current data
    const current = await smartElementsApi.read(boardObjectId);
    if (!current) return null;

    // Optimistic locking check
    if (expectedVersion !== undefined && current.version !== expectedVersion) {
      console.error('Version mismatch - data may have been modified');
      return null;
    }

    // Merge updates with current data
    const currentData = typeof current.data === 'object' ? current.data : {};
    const mergedData = { ...currentData, ...updates };

    // Validate merged data
    const validatedData = parseSmartElementData(current.smartType, mergedData);

    const { data, error } = await supabase
      .from('smart_element_data')
      .update({
        data: validatedData as Json,
        version: current.version + 1,
      })
      .eq('board_object_id', boardObjectId)
      .select()
      .single();

    if (error || !data) {
      console.error('Failed to update smart element:', error);
      return null;
    }

    return {
      id: data.id,
      boardObjectId: data.board_object_id,
      smartType: data.smart_type as SmartElementType,
      data: data.data,
      version: data.version,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  /**
   * Delete smart element (cascade deletes smart_element_data)
   */
  delete: async (boardObjectId: string): Promise<boolean> => {
    const { error } = await supabase
      .from('board_objects')
      .delete()
      .eq('id', boardObjectId);

    if (error) {
      console.error('Failed to delete smart element:', error);
      return false;
    }

    return true;
  },

  /**
   * Validate data against smart element schema
   */
  validate: <T extends SmartElementType>(
    type: T,
    data: unknown
  ): SmartElementDataType<T> => {
    const schema = SmartElementDataSchemaMap[type];
    return schema.parse(data) as SmartElementDataType<T>;
  },

  /**
   * Safe parse - returns default data on validation failure
   */
  safeParse: <T extends SmartElementType>(
    type: T,
    data: unknown
  ): SmartElementDataType<T> => {
    return parseSmartElementData(type, data);
  },

  /**
   * Get all smart elements for a board
   */
  listByBoard: async (boardId: string): Promise<SmartElementRecord[]> => {
    const { data: boardObjects, error: boardError } = await supabase
      .from('board_objects')
      .select('id')
      .eq('board_id', boardId)
      .eq('type', 'smart');

    if (boardError || !boardObjects) {
      console.error('Failed to list board objects:', boardError);
      return [];
    }

    const boardObjectIds = boardObjects.map((obj) => obj.id);
    if (boardObjectIds.length === 0) return [];

    const { data: smartElements, error: smartError } = await supabase
      .from('smart_element_data')
      .select('*')
      .in('board_object_id', boardObjectIds);

    if (smartError || !smartElements) {
      console.error('Failed to list smart elements:', smartError);
      return [];
    }

    // ✅ ترحيل كانبان القديم إن وُجد + حفظه مرة واحدة (بشكل متوازي)
    const records = await Promise.all(
      smartElements.map(async (el) => {
        const smartType = el.smart_type as SmartElementType;

        if (smartType === 'kanban') {
          const migrated = migrateKanbanLegacyData(el.data);
          const validated = parseSmartElementData('kanban', migrated.data);

          if (migrated.migrated) {
            const { data: updatedRow } = await supabase
              .from('smart_element_data')
              .update({
                data: validated as Json,
                version: el.version + 1,
              })
              .eq('board_object_id', el.board_object_id)
              .eq('version', el.version)
              .select('*')
              .maybeSingle();

            if (updatedRow) {
              return {
                id: updatedRow.id,
                boardObjectId: updatedRow.board_object_id,
                smartType: updatedRow.smart_type as SmartElementType,
                data: updatedRow.data,
                version: updatedRow.version,
                createdAt: updatedRow.created_at,
                updatedAt: updatedRow.updated_at,
              };
            }
          }

          return {
            id: el.id,
            boardObjectId: el.board_object_id,
            smartType,
            data: validated as unknown as Json,
            version: el.version,
            createdAt: el.created_at,
            updatedAt: el.updated_at,
          };
        }

        const validated = parseSmartElementData(smartType, el.data);

        return {
          id: el.id,
          boardObjectId: el.board_object_id,
          smartType,
          data: validated as unknown as Json,
          version: el.version,
          createdAt: el.created_at,
          updatedAt: el.updated_at,
        };
      })
    );

    return records;
  },

  /**
   * Batch update multiple smart elements
   */
  batchUpdate: async (
    updates: Array<{
      boardObjectId: string;
      data: Partial<Record<string, unknown>>;
    }>
  ): Promise<number> => {
    let successCount = 0;

    for (const update of updates) {
      const result = await smartElementsApi.update(
        update.boardObjectId,
        update.data as any
      );
      if (result) successCount++;
    }

    return successCount;
  },
};

export type { SmartElementRecord, CreateSmartElementParams, Position, Size };
