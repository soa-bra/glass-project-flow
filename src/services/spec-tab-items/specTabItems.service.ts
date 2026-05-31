/**
 * SpecTabItemsService — CRUD for spec_tab_items table.
 * Backs the 7 spec scaffold tabs (CSR impact/beneficiaries/resources,
 * Training development-paths, KMPA research-pipeline/publications/peer-review).
 *
 * @specRef DepartmentsWorkspace-tabs-boxes-backend.md
 */
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type SpecTabItemRow = Database['public']['Tables']['spec_tab_items']['Row'];
export type SpecTabItemInsert = Database['public']['Tables']['spec_tab_items']['Insert'];
export type SpecTabItemUpdate = Database['public']['Tables']['spec_tab_items']['Update'];

export interface SpecTabScope {
  departmentCode: string;
  tabKey: string;
}

export const SpecTabItemsService = {
  async list({ departmentCode, tabKey }: SpecTabScope): Promise<SpecTabItemRow[]> {
    const { data, error } = await supabase
      .from('spec_tab_items')
      .select('*')
      .eq('department_code', departmentCode)
      .eq('tab_key', tabKey)
      .order('position', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async get(id: string): Promise<SpecTabItemRow | null> {
    const { data, error } = await supabase
      .from('spec_tab_items')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(input: Omit<SpecTabItemInsert, 'owner_id'>): Promise<SpecTabItemRow> {
    const { data: auth } = await supabase.auth.getUser();
    const owner_id = auth.user?.id;
    if (!owner_id) throw new Error('غير مُسجّل الدخول');
    const { data, error } = await supabase
      .from('spec_tab_items')
      .insert({ ...input, owner_id })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, patch: SpecTabItemUpdate): Promise<SpecTabItemRow> {
    const { data, error } = await supabase
      .from('spec_tab_items')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('spec_tab_items').delete().eq('id', id);
    if (error) throw error;
  },
};
