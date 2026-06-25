/**
 * Archive Service — central CRUD for `public.archive_documents`.
 * Powers Archive workspace categories.
 *
 * @specRef Section 7 (Archive Workspace)
 */
import { supabase } from '@/integrations/supabase/client';
import { audit } from '@/services/audit';
import { z } from 'zod';

export const archiveCategorySchema = z.enum([
  'documents',
  'projects',
  'tasks',
  'hr',
  'financial',
  'legal',
  'organizational',
  'knowledge',
  'templates',
  'policies',
]);
export type ArchiveCategory = z.infer<typeof archiveCategorySchema>;

export const archiveDocumentCreateSchema = z.object({
  category: archiveCategorySchema,
  title: z.string().min(1).max(200),
  description: z.string().optional().nullable(),
  file_url: z.string().url().optional().nullable(),
  version: z.string().optional().default('v1'),
  tags: z.array(z.string()).optional().default([]),
  status: z.string().optional().default('active'),
  metadata: z.record(z.unknown()).optional().default({}),
});
export type ArchiveDocumentInput = z.infer<typeof archiveDocumentCreateSchema>;

export interface ArchiveDocument {
  id: string;
  owner_id: string;
  category: string;
  title: string;
  description: string | null;
  file_url: string | null;
  version: string | null;
  tags: string[];
  status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const archiveService = {
  async listByCategory(category: ArchiveCategory): Promise<ArchiveDocument[]> {
    const { data, error } = await supabase
      .from('archive_documents')
      .select('*')
      .eq('category', category)
      .order('updated_at', { ascending: false });
    void audit({
      resource_type: 'archive_document',
      action: 'list',
      metadata: { category },
      decision: error ? 'error' : 'allowed',
      reason: error?.message,
    });
    if (error) throw error;
    return (data ?? []) as ArchiveDocument[];
  },

  async create(input: ArchiveDocumentInput): Promise<ArchiveDocument> {
    const parsed = archiveDocumentCreateSchema.parse(input);
    const { data, error } = await supabase
      .from('archive_documents')
      .insert(parsed as never)
      .select('*')
      .single();
    void audit({
      resource_type: 'archive_document',
      action: 'create',
      metadata: { category: parsed.category, title: parsed.title },
      decision: error ? 'error' : 'allowed',
      reason: error?.message,
    });
    if (error) throw error;
    return data as ArchiveDocument;
  },

  async update(id: string, patch: Partial<ArchiveDocumentInput>): Promise<ArchiveDocument> {
    const { data, error } = await supabase
      .from('archive_documents')
      .update(patch as never)
      .eq('id', id)
      .select('*')
      .single();
    void audit({
      resource_type: 'archive_document',
      action: 'update',
      resource_id: id,
      decision: error ? 'error' : 'allowed',
      reason: error?.message,
    });
    if (error) throw error;
    return data as ArchiveDocument;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('archive_documents').delete().eq('id', id);
    void audit({
      resource_type: 'archive_document',
      action: 'delete',
      resource_id: id,
      decision: error ? 'error' : 'allowed',
      reason: error?.message,
    });
    if (error) throw error;
  },
};
