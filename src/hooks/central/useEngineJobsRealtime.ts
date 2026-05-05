/**
 * useEngineJobsRealtime — يستمع لتغييرات `engine_jobs` عبر Supabase Realtime
 * ويُبطل ذاكرة React Query لقائمة المحركات لتحديث UI فوريًا (P4).
 */
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useEngineJobsRealtime(enabled = true) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled) return;
    const channel = supabase
      .channel("engine-jobs-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "engine_jobs" },
        () => {
          qc.invalidateQueries({ queryKey: ["central", "engine_jobs"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, qc]);
}
