import type { CanvasElement } from '@/types/canvas';

const TEXT_PREVIEW_LIMIT = 12000;

const TEXT_FILE_EXTENSIONS = new Set([
  'csv',
  'json',
  'md',
  'markdown',
  'txt',
]);

const getFileExtension = (fileName: string) => {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.at(-1) ?? '' : '';
};

const isTextLikeFile = (file: File) => {
  const extension = getFileExtension(file.name);
  return (
    file.type.startsWith('text/') ||
    file.type === 'application/json' ||
    file.type === 'application/csv' ||
    file.type === 'text/csv' ||
    TEXT_FILE_EXTENSIONS.has(extension)
  );
};

const readTextPreview = async (file: File) => {
  const preview = await file.slice(0, TEXT_PREVIEW_LIMIT).text();
  return file.size <= TEXT_PREVIEW_LIMIT
    ? preview
    : `${preview}\n\n... تم اختصار المعاينة لأن الملف طويل.`;
};

export const createRenderableFileCanvasElement = async (
  file: File,
  position: { x: number; y: number },
): Promise<Omit<CanvasElement, 'id'>> => {
  if (file.type.startsWith('image/')) {
    return {
      type: 'image',
      position,
      size: { width: 300, height: 200 },
      style: {},
      src: URL.createObjectURL(file),
      alt: file.name,
      metadata: {
        source: 'uploaded_file',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    };
  }

  if (isTextLikeFile(file)) {
    const content = await readTextPreview(file);
    return {
      type: 'text',
      position,
      size: { width: 420, height: 280 },
      style: {
        backgroundColor: '#FFFFFF',
        border: '1px solid hsl(var(--border))',
        borderRadius: 12,
        padding: 16,
        fontFamily: 'IBM Plex Sans Arabic, monospace',
        fontSize: 13,
        color: '#111827',
      },
      content,
      textType: 'box',
      data: {
        textType: 'box',
        source: 'uploaded_file',
        renderMode: 'text_preview',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
      metadata: {
        source: 'uploaded_file',
        renderMode: 'text_preview',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      },
    };
  }

  return {
    type: 'file',
    position,
    size: { width: 250, height: 120 },
    style: {},
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    fileUrl: URL.createObjectURL(file),
    metadata: {
      source: 'uploaded_file',
      renderMode: 'file_card',
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    },
  };
};
