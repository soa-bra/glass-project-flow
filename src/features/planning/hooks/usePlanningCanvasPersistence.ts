import { usePlanningElementPersistence } from './usePlanningElementPersistence';
import { usePlanningStoreSync } from './usePlanningStoreSync';

type UsePlanningCanvasPersistenceOptions = {
  selfDisplayName?: string;
  canPersist: boolean;
};

/**
 * Official Planning Canvas persistence path.
 *
 * Element rows flow through `planning_elements` via store sync + debounced
 * persistence. Board snapshots remain metadata-only and must not be used as an
 * alternate element source.
 */
export function usePlanningCanvasPersistence(
  boardId: string | null,
  options: UsePlanningCanvasPersistenceOptions,
) {
  const sync = usePlanningStoreSync(boardId, options.selfDisplayName);
  const persistence = usePlanningElementPersistence(boardId, options.canPersist);

  return {
    ...sync,
    persistence,
  };
}

export default usePlanningCanvasPersistence;
