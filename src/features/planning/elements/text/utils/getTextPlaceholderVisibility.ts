interface GetTextPlaceholderVisibilityInput {
  content?: string;
  isEditing: boolean;
}

export const getTextPlaceholderVisibility = ({ content, isEditing }: GetTextPlaceholderVisibilityInput): boolean => {
  const normalized = (content || '').replace(/<br\s*\/?>/gi, '').replace(/&nbsp;/gi, ' ').replace(/<[^>]+>/g, ' ').trim();

  if (isEditing) {
    return normalized.length === 0;
  }

  return normalized.length === 0;
};

export default getTextPlaceholderVisibility;
