/**
 * Cross-Workspace Search hook — يستخدم React Query مع debounce بسيط عبر staleTime.
 */
import { useQuery } from "@tanstack/react-query";
import { searchAll, type SearchHit } from "@/services/central/search.service";

export function useCrossWorkspaceSearch(query: string) {
  return useQuery<SearchHit[]>({
    queryKey: ["central", "search", query.trim().toLowerCase()],
    queryFn: () => searchAll(query),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
}
