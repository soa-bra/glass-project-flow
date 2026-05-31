/**
 * React Query bindings for archive_documents (per category).
 *
 * @specRef Section 7 (Archive Workspace)
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveService,
  type ArchiveCategory,
  type ArchiveDocumentInput,
} from '@/services/archive/archiveService';

export const archiveKeys = {
  all: ['archive'] as const,
  category: (c: ArchiveCategory) => ['archive', c] as const,
};

export function useArchiveDocuments(category: ArchiveCategory) {
  return useQuery({
    queryKey: archiveKeys.category(category),
    queryFn: () => archiveService.listByCategory(category),
  });
}

export function useCreateArchiveDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ArchiveDocumentInput) => archiveService.create(input),
    onSuccess: (doc) =>
      qc.invalidateQueries({ queryKey: archiveKeys.category(doc.category as ArchiveCategory) }),
  });
}

export function useDeleteArchiveDocument(category: ArchiveCategory) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: archiveKeys.category(category) }),
  });
}
