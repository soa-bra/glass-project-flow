import React, { useState } from 'react';
import { 
  FilePlus, 
  Save, 
  FolderOpen, 
  FileJson,
  FileImage,
  FileText,
  Upload,
  Loader2
} from 'lucide-react';
import { usePlanningStore } from '@/stores/planningStore';
import { useExportImport } from '@/hooks/useExportImport';

interface FileMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileMenuPopover: React.FC<FileMenuPopoverProps> = ({ isOpen, onClose }) => {
  const { createBoard, boards } = usePlanningStore();
  const { exportCanvas, importFromFile, isExporting, isImporting } = useExportImport();
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleNewBoard = () => {
    createBoard('blank');
    onClose();
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
  
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.svg';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        await importFromFile(file, { generateNewIds: true, offsetPosition: { x: 20, y: 20 } });
        onClose();
      }
    };
    input.click();
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border py-2 z-[9999] max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* New */}
        <button
          onClick={handleNewBoard}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right"
        >
          <FilePlus size={16} className="text-sb-ink" />
          <span className="text-[13px] text-sb-ink">لوحة جديدة</span>
          <span className="mr-auto text-[11px] text-sb-ink-40">Ctrl+N</span>
        </button>
        
        {/* Save */}
        <button
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right"
        >
          <Save size={16} className="text-sb-ink" />
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
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right"
        >
          <FolderOpen size={16} className="text-sb-ink" />
          <span className="text-[13px] text-sb-ink">فتح لوحة</span>
          <span className="mr-auto text-[11px] text-sb-ink-40">Ctrl+O</span>
        </button>
        
        {/* Import */}
        <button
          onClick={handleImport}
          disabled={isImporting}
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right disabled:opacity-50"
        >
          {isImporting ? <Loader2 size={16} className="text-sb-ink animate-spin" /> : <Upload size={16} className="text-sb-ink" />}
          <span className="text-[13px] text-sb-ink">استيراد JSON/SVG</span>
        </button>
        
        {boards.length > 0 && (
          <>
            <div className="h-px bg-sb-border my-2" />
            <div className="px-2 max-h-40 overflow-y-auto">
              <p className="px-2 py-1 text-[11px] text-sb-ink-40 font-medium">اللوحات الأخيرة</p>
              {boards.slice(0, 5).map(board => (
                <button
                  key={board.id}
                  className="w-full px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right text-[12px] text-sb-ink truncate"
                >
                  {board.name}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};
