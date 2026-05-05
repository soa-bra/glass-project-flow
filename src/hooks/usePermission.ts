/**
 * usePermission — يستعلم عن صلاحية مستخدم عبر RPC `has_permission`.
 *
 * يُرجِع { allowed, loading, reason } ويُخزَّن النتيجة في React Query حتى
 * تُبطل عند تغيّر الجلسة أو تحديث الدور.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface PermissionResult {
  allowed: boolean;
  loading: boolean;
  reason: string | null;
}

export function usePermission(permissionCode: string): PermissionResult {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["permission", user?.id, permissionCode],
    queryFn: async (): Promise<{ allowed: boolean; reason: string | null }> => {
      if (!user) return { allowed: false, reason: "not_authenticated" };
      const { data, error } = await supabase.rpc("has_permission", {
        _user_id: user.id,
        _permission_code: permissionCode,
      });
      if (error) return { allowed: false, reason: error.message };
      return { allowed: !!data, reason: data ? null : "missing_permission" };
    },
    enabled: !!user,
    staleTime: 60_000,
  });

  return {
    allowed: !!data?.allowed,
    loading: isLoading,
    reason: data?.reason ?? null,
  };
}
