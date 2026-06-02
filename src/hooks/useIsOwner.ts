/**
 * useIsOwner — يستعلم RPC is_owner(uid) ويعيد الحالة مع التحميل.
 * مصدر الحقيقة الوحيد في الواجهة لقيود الـ Owner.
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useIsOwner(): { isOwner: boolean; loading: boolean } {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["is-owner", user?.id],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_owner", { _user_id: user!.id });
      if (error) return false;
      return Boolean(data);
    },
  });
  return { isOwner: !!data, loading: isLoading };
}
