/**
 * usePersistedSettings — load + autosave (debounced) any settings category
 * payload to `public.user_settings`. Returns `{ data, save, saving, loaded }`.
 *
 * @specRef Section 8 (Settings Workspace) — P6 persistence
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { useSettings, useUpsertSettings } from './useSettings';
import type { SettingsCategory } from '@/services/settings/settingsService';

const AUTOSAVE_DEBOUNCE_MS = 800;

export function usePersistedSettings<T extends Record<string, unknown>>(
  category: SettingsCategory,
  defaults: T,
) {
  const { data, isLoading } = useSettings(category);
  const { mutateAsync, isPending } = useUpsertSettings(category);

  const [value, setValue] = useState<T>(defaults);
  const loadedRef = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from DB once
  useEffect(() => {
    if (loadedRef.current || isLoading) return;
    if (data?.payload) {
      setValue({ ...defaults, ...(data.payload as T) });
    }
    loadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoading]);

  const save = useCallback(
    async (next?: T) => {
      const payload = next ?? value;
      await mutateAsync(payload as Record<string, unknown>);
    },
    [mutateAsync, value],
  );

  const setAndAutosave = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? (updater as (p: T) => T)(prev) : updater;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          mutateAsync(next as Record<string, unknown>).catch(() => {
            /* surfaced by react-query devtools */
          });
        }, AUTOSAVE_DEBOUNCE_MS);
        return next;
      });
    },
    [mutateAsync],
  );

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return {
    value,
    setValue: setAndAutosave,
    save,
    saving: isPending,
    loaded: loadedRef.current,
  } as const;
}
