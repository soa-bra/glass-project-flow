/**
 * Kanban legacy data migration
 * ترحيل بيانات كانبان القديمة إلى البنية الجديدة (columns[].cards)
 */

type AnyRecord = Record<string, any>;

function isRecord(v: unknown): v is AnyRecord {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function migrateKanbanLegacyData(input: unknown): { migrated: boolean; data: unknown } {
  if (!isRecord(input)) return { migrated: false, data: input };

  const columns = Array.isArray(input.columns) ? input.columns : null;
  if (!columns) return { migrated: false, data: input };

  const hasLegacyCardIds = columns.some((c) => isRecord(c) && Array.isArray((c as AnyRecord).cardIds));
  const hasRootCardsRecord = isRecord((input as AnyRecord).cards);

  if (!hasLegacyCardIds && !hasRootCardsRecord) {
    return { migrated: false, data: input };
  }

  const cardsRecord: Record<string, any> = hasRootCardsRecord ? ((input as AnyRecord).cards as AnyRecord) : {};

  const migratedColumns = columns
    .filter((c) => isRecord(c))
    .map((col) => {
      const cardIds = Array.isArray(col.cardIds) ? (col.cardIds as unknown[]) : null;

      const cardsFromIds = cardIds
        ? cardIds
            .map((id) => {
              const key = typeof id === 'string' ? id : null;
              if (!key) return null;
              const fromRecord = cardsRecord[key];
              const base = isRecord(fromRecord) ? fromRecord : {};
              return {
                ...base,
                id: key,
              };
            })
            .filter(Boolean)
        : [];

      const existingCards = Array.isArray(col.cards) ? col.cards : null;
      const cards = (existingCards ?? cardsFromIds ?? [])
        .filter(Boolean)
        .map((c: any, idx: number) => ({
          ...c,
          id: typeof c?.id === 'string' ? c.id : `card-${idx}`,
          title: typeof c?.title === 'string' ? c.title : 'بطاقة',
          order: typeof c?.order === 'number' ? c.order : idx,
        }));

      // إزالة cardIds من العمود
      const { cardIds: _discard, ...rest } = col as AnyRecord;
      return {
        ...rest,
        cards,
      };
    });

  const { cards: _rootCards, ...rest } = input as AnyRecord;

  return {
    migrated: true,
    data: {
      ...rest,
      columns: migratedColumns,
    },
  };
}
