import type { CanvasElement } from '@/types/canvas';
import type { SmartElementType } from '@/types/smart-elements';
import * as XLSX from 'xlsx';

const TEXT_PREVIEW_LIMIT = 12000;
const SHEET_ROW_LIMIT = 1000;
const SHEET_COLUMN_LIMIT = 100;

const SMART_TEXT_FILE_EXTENSIONS = new Set([
  'json',
  'md',
  'markdown',
  'pages',
  'txt',
]);

const SMART_SHEET_FILE_EXTENSIONS = new Set([
  'csv',
  'numbers',
  'xls',
  'xlsx',
]);

const IMAGE_FILE_EXTENSIONS = new Set([
  'jpg',
  'jpeg',
  'png',
]);

const TEXT_FILE_MIME_TYPES = new Set([
  'application/json',
  'text/markdown',
  'text/plain',
]);

const SHEET_FILE_MIME_TYPES = new Set([
  'application/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
]);

export type RenderableUploadedFileKind =
  | 'image'
  | 'smart_text_doc'
  | 'interactive_sheet'
  | 'pdf'
  | 'file_card';

export const getFileExtension = (fileName: string) => {
  const parts = fileName.toLowerCase().split('.');
  return parts.length > 1 ? parts.at(-1) ?? '' : '';
};

export const getRenderableUploadedFileKind = (
  file: Pick<File, 'name' | 'type'>,
): RenderableUploadedFileKind => {
  const extension = getFileExtension(file.name);

  if (file.type.startsWith('image/') || IMAGE_FILE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (file.type === 'application/pdf' || extension === 'pdf') {
    return 'pdf';
  }

  if (SHEET_FILE_MIME_TYPES.has(file.type) || SMART_SHEET_FILE_EXTENSIONS.has(extension)) {
    return 'interactive_sheet';
  }

  if (
    file.type.startsWith('text/') ||
    TEXT_FILE_MIME_TYPES.has(file.type) ||
    SMART_TEXT_FILE_EXTENSIONS.has(extension)
  ) {
    return 'smart_text_doc';
  }

  return 'file_card';
};

const getUploadedFileMetadata = (file: File, renderMode: string) => ({
  source: 'uploaded_file',
  renderMode,
  fileName: file.name,
  fileType: file.type,
  fileSize: file.size,
});

const buildSmartElement = (
  smartType: SmartElementType,
  position: { x: number; y: number },
  size: { width: number; height: number },
  data: Record<string, unknown>,
  metadata: Record<string, unknown>,
): Omit<CanvasElement, 'id'> => ({
  type: 'smart',
  smartType,
  position,
  size,
  style: {},
  data: {
    smartType,
    ...data,
  },
  metadata,
});

const readTextPreview = async (file: File) => {
  const preview = await file.slice(0, TEXT_PREVIEW_LIMIT).text();
  return file.size <= TEXT_PREVIEW_LIMIT
    ? preview
    : `${preview}\n\n... تم اختصار المعاينة لأن الملف طويل.`;
};

const readSmartTextContent = async (file: File) => {
  const extension = getFileExtension(file.name);

  if (extension === 'pages') {
    return `تم إدراج ${file.name} كمستند نصي ذكي. يمكن تحرير المحتوى من داخل المستند.`;
  }

  const content = await readTextPreview(file);
  if (extension !== 'json') return content;

  try {
    return JSON.stringify(JSON.parse(content), null, 2);
  } catch {
    return content;
  }
};

const getTextFormat = (fileName: string): 'plain' | 'rich' | 'markdown' => {
  const extension = getFileExtension(fileName);
  return extension === 'md' || extension === 'markdown' ? 'markdown' : 'plain';
};

const countWords = (content: string) => {
  const words = content.trim().split(/\s+/).filter(Boolean);
  return words.length;
};

const columnIndexToName = (index: number) => XLSX.utils.encode_col(index);

const createFallbackSheetCells = (file: File) => ({
  A1: {
    value: `تم إدراج ${file.name} كورقة بيانات ذكية.`,
    format: { type: 'text' as const, bold: true },
  },
  A2: {
    value: 'يمكن تحرير الخلايا يدوياً من داخل الورقة.',
    format: { type: 'text' as const },
  },
});

const readSheetData = async (file: File) => {
  const extension = getFileExtension(file.name);

  if (extension === 'numbers') {
    return {
      rows: 20,
      columns: 10,
      cells: createFallbackSheetCells(file),
    };
  }

  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = sheetName ? workbook.Sheets[sheetName] : null;

    if (!sheet) {
      return {
        rows: 20,
        columns: 10,
        cells: createFallbackSheetCells(file),
      };
    }

    const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      raw: false,
      defval: '',
    });

    const rows = rawRows
      .filter((row): row is unknown[] => Array.isArray(row))
      .slice(0, SHEET_ROW_LIMIT)
      .map((row) => row.slice(0, SHEET_COLUMN_LIMIT));

    const cells = rows.reduce<Record<string, { value: string | number | boolean | null; format?: { type: 'text' } }>>(
      (accumulator, row, rowIndex) => {
        row.forEach((value, columnIndex) => {
          if (value === '') return;
          const cellRef = `${columnIndexToName(columnIndex)}${rowIndex + 1}`;
          accumulator[cellRef] = {
            value: typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
              ? value
              : String(value),
            format: { type: 'text' },
          };
        });
        return accumulator;
      },
      {},
    );

    const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);

    return {
      rows: Math.max(20, rows.length || 1),
      columns: Math.max(10, columnCount || 1),
      cells: Object.keys(cells).length > 0 ? cells : createFallbackSheetCells(file),
    };
  } catch (error) {
    console.warn('[file_uploader] sheet parse failed', error);
    return {
      rows: 20,
      columns: 10,
      cells: createFallbackSheetCells(file),
    };
  }
};

const createSmartTextDocumentElement = async (
  file: File,
  position: { x: number; y: number },
): Promise<Omit<CanvasElement, 'id'>> => {
  const content = await readSmartTextContent(file);
  const metadata = getUploadedFileMetadata(file, 'smart_text_doc');

  return buildSmartElement(
    'smart_text_doc',
    position,
    { width: 500, height: 400 },
    {
      title: file.name,
      content,
      format: getTextFormat(file.name),
      aiAssist: true,
      readOnly: false,
      showToolbar: true,
      autoSave: true,
      wordCount: countWords(content),
      sections: [],
    },
    metadata,
  );
};

const createInteractiveSheetElement = async (
  file: File,
  position: { x: number; y: number },
): Promise<Omit<CanvasElement, 'id'>> => {
  const sheetData = await readSheetData(file);
  const metadata = getUploadedFileMetadata(file, 'interactive_sheet');

  return buildSmartElement(
    'interactive_sheet',
    position,
    { width: 600, height: 400 },
    {
      title: file.name,
      ...sheetData,
      columnWidths: {},
      rowHeights: {},
      frozenRows: 0,
      frozenColumns: 0,
      linkedElements: [],
      showGridLines: true,
      showRowNumbers: true,
      showColumnHeaders: true,
      allowFormulas: true,
      allowAIAnalysis: true,
    },
    metadata,
  );
};

export const createRenderableFileCanvasElement = async (
  file: File,
  position: { x: number; y: number },
): Promise<Omit<CanvasElement, 'id'>> => {
  const fileKind = getRenderableUploadedFileKind(file);

  if (fileKind === 'image') {
    return {
      type: 'image',
      position,
      size: { width: 300, height: 200 },
      style: {},
      src: URL.createObjectURL(file),
      alt: file.name,
      metadata: getUploadedFileMetadata(file, 'image'),
    };
  }

  if (fileKind === 'smart_text_doc') {
    return createSmartTextDocumentElement(file, position);
  }

  if (fileKind === 'interactive_sheet') {
    return createInteractiveSheetElement(file, position);
  }

  const fileUrl = URL.createObjectURL(file);
  if (fileKind === 'pdf') {
    return {
      type: 'file',
      position,
      size: { width: 480, height: 620 },
      style: {},
      fileName: file.name,
      fileType: file.type || 'application/pdf',
      fileSize: file.size,
      fileUrl,
      metadata: getUploadedFileMetadata(file, 'pdf_preview'),
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
    fileUrl,
    metadata: getUploadedFileMetadata(file, 'file_card'),
  };
};
