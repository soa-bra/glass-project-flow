import React, { useState } from 'react';
import {
  FilePlus,
  Save,
  FolderOpen,
  FileJson,
  FileImage,
  FileText,
  Upload,
  Loader2,
  LayoutTemplate,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePlanningStore } from '@/stores/planningStore';
import { useCanvasStore } from '@/stores/canvasStore';
import { useExportImport } from '@/hooks/useExportImport';
import { createRenderableFileCanvasElement } from '@/features/planning/utils/fileCanvasElements';
import TemplateSelector from '@/features/planning/ui/widgets/TemplateSelector';

interface FileMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const BOARD_IMPORT_FILE_TYPES = '.json,.svg,.fig';

const RENDERABLE_UPLOAD_FILE_TYPES = [
  'image/*',
  '.pdf',
  '.doc',
  '.docx',
  '.txt',
  '.md',
  '.markdown',
  '.json',
  '.pages',
  '.csv',
  '.xls',
  '.xlsx',
  '.numbers',
].join(',');

export const FileMenuPopover: React.FC<FileMenuPopoverProps> = ({ isOpen, onClose }) => {
  const { createBoard, boards, currentBoard, saveBoard, setCurrentBoard } = usePlanningStore();
  const { addElement } = useCanvasStore();
  const { exportCanvas, importFromFile, isExporting, isImporting } = useExportImport();
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);

  if (!isOpen) return null;

  const handleNewBoard = () => {
    void createBoard('blank');
    onClose();
  };

  const closeTemplateSelector = () => {
    setIsTemplateSelectorOpen(false);
    onClose();
  };

  const handleSaveBoard = async () => {
    if (!currentBoard) {
      toast.error('لا توجد لوحة مفتوحة لحفظها');
      return;
    }

    setIsSaving(true);
    try {
      await saveBoard(currentBoard.id);
      toast.success('تم حفظ اللوحة');
      onClose();
    } catch (error) {
      console.warn('[file_menu] save board failed', error);
      toast.error('تعذر حفظ اللوحة');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'png' | 'pdf' | 'json' | 'svg') => {
    setExportingFormat(format);
    try {
      await exportCanvas(format, {
        filename: `canvas-export-${Date.now()}`,
        quality: 0.92,
        scale: 2,
        background: '#ffffff'
      });
    } finally {
      setExportingFormat(null);
      onClose();
    }
  };

  const handleBoardImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = BOARD_IMPORT_FILE_TYPES;
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        await importFromFile(file, { generateNewIds: true, offsetPosition: { x: 20, y: 20 } });
        toast.success('تم فتح اللوحة');
        onClose();
      } catch (error) {
        console.warn('[file_menu] board import failed', error);
        toast.error('تعذر فتح اللوحة');
      }
    };
    input.click();
  };

  const handleRenderableFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = RENDERABLE_UPLOAD_FILE_TYPES;
    input.onchange = async (event) => {
      const files = Array.from((event.target as HTMLInputElement).files ?? []);
      if (files.length === 0) return;

      setIsUploadingFiles(true);
      try {
        await Promise.all(
          files.map(async (file, index) => {
            const element = await createRenderableFileCanvasElement(file, {
              x: 100 + index * 28,
              y: 100 + index * 28,
            });
            addElement(element);
          }),
        );
        toast.success(`تم إدراج ${files.length} ملف`);
        onClose();
      } catch (error) {
        console.warn('[file_menu] renderable upload failed', error);
        toast.error('تعذر إدراج بعض الملفات');
      } finally {
        setIsUploadingFiles(false);
      }
    };
    input.click();
  };

  const handleOpenRecentBoard = (board: typeof boards[number]) => {
    setCurrentBoard(board);
    toast.success(`تم فتح اللوحة: ${board.name}`);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border py-2 z-dropdown max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* New */}
        <button
          onClick={handleNewBoard}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right"
        >
          <FilePlus size={16} className="text-sb-ink" />
          <span className="text-[13px] text-sb-ink">لوحة جديدة</span>
          <span className="mr-auto text-[11px] text-sb-ink-40">Ctrl+N</span>
        </button>

        <button
          onClick={() => setIsTemplateSelectorOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right"
        >
          <LayoutTemplate size={16} className="text-sb-ink" />
          <span className="text-[13px] text-sb-ink">لوحة من قالب</span>
        </button>

        {/* Save */}
        <button
          onClick={() => void handleSaveBoard()}
          disabled={isSaving || !currentBoard}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <Save size={16} className="text-sb-ink" />}
          <span className="text-[13px] text-sb-ink">حفظ</span>
          <span className="mr-auto text-[11px] text-sb-ink-40">Ctrl+S</span>
        </button>

        <div className="h-px bg-sb-border my-2" />

        {/* Export submenu */}
        <div className="px-2">
          <p className="px-2 py-1 text-[11px] text-sb-ink-40 font-medium">تصدير كـ</p>

          <button
            onClick={() => handleExport('png')}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right disabled:opacity-50"
          >
            {exportingFormat === 'png' ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <FileImage size={16} className="text-sb-ink" />}
            <span className="text-[13px] text-sb-ink">PNG صورة</span>
          </button>

          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right disabled:opacity-50"
          >
            {exportingFormat === 'pdf' ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <FileText size={16} className="text-sb-ink" />}
            <span className="text-[13px] text-sb-ink">PDF ملف</span>
          </button>

          <button
            onClick={() => handleExport('svg')}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right disabled:opacity-50"
          >
            {exportingFormat === 'svg' ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <FileImage size={16} className="text-sb-ink" />}
            <span className="text-[13px] text-sb-ink">SVG متجهات</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right disabled:opacity-50"
          >
            {exportingFormat === 'json' ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <FileJson size={16} className="text-sb-ink" />}
            <span className="text-[13px] text-sb-ink">JSON نسخة احتياطية</span>
          </button>
        </div>

        <div className="h-px bg-sb-border my-2" />

        {/* Open */}
        <button
          onClick={handleBoardImport}
          disabled={isImporting}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right disabled:opacity-50"
        >
          {isImporting ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <FolderOpen size={16} className="text-sb-ink" />}
          <span className="text-[13px] text-sb-ink">فتح لوحة</span>
          <span className="mr-auto text-[11px] text-sb-ink-40">Ctrl+O</span>
        </button>

        {/* Import */}
        <button
          onClick={handleRenderableFileUpload}
          disabled={isUploadingFiles}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right disabled:opacity-50"
        >
          {isUploadingFiles ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <Upload size={16} className="text-sb-ink" />}
          <span className="text-[13px] text-sb-ink">رفع ملف إلى اللوحة</span>
        </button>

        {boards.length > 0 && (
          <>
            <div className="h-px bg-sb-border my-2" />
            <div className="px-2 max-h-40 overflow-y-auto">
              <p className="px-2 py-1 text-[11px] text-sb-ink-40 font-medium">اللوحات الأخيرة</p>
              {boards.slice(0, 5).map(board => (
                <button
                  key={board.id}
                  onClick={() => handleOpenRecentBoard(board)}
                  className="w-full px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right text-[12px] text-sb-ink truncate"
                >
                  {board.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {isTemplateSelectorOpen && (
        <TemplateSelector onClose={closeTemplateSelector} />
      )}
    </>
  );
};