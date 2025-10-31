import React from 'react';
import { 
  FilePlus, 
  Save, 
  Download, 
  FolderOpen, 
  FileJson,
  FileImage,
  FileText,
  Upload
} from 'lucide-react';
import { usePlanningStore } from '@/stores/planningStore';

interface FileMenuPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FileMenuPopover: React.FC<FileMenuPopoverProps> = ({ isOpen, onClose }) => {
  const { createBoard, boards } = usePlanningStore();
  
  if (!isOpen) return null;
  
  const handleNewBoard = () => {
    createBoard('blank');
    onClose();
  };
  
  const handleExport = (format: 'png' | 'jpg' | 'pdf' | 'json' | 'svg') => {
    console.log(`Exporting as ${format}...`);
    // TODO: Implement export functionality
    onClose();
  };
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 min-w-[16rem] max-w-[calc(100vw-2rem)] sm:w-64 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border py-2 z-50 max-h-[80vh] overflow-y-auto">
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
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
          >
            <FileImage size={16} className="text-sb-ink" />
            <span className="text-[13px] text-sb-ink">PNG صورة</span>
          </button>
          
          <button
            onClick={() => handleExport('jpg')}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
          >
            <FileImage size={16} className="text-sb-ink" />
            <span className="text-[13px] text-sb-ink">JPG صورة</span>
          </button>
          
          <button
            onClick={() => handleExport('pdf')}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
          >
            <FileText size={16} className="text-sb-ink" />
            <span className="text-[13px] text-sb-ink">PDF ملف</span>
          </button>
          
          <button
            onClick={() => handleExport('svg')}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
          >
            <FileImage size={16} className="text-sb-ink" />
            <span className="text-[13px] text-sb-ink">SVG متجهات</span>
          </button>
          
          <button
            onClick={() => handleExport('json')}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg rounded-lg transition-colors text-right"
          >
            <FileJson size={16} className="text-sb-ink" />
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
          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-sb-panel-bg transition-colors text-right"
        >
          <Upload size={16} className="text-sb-ink" />
          <span className="text-[13px] text-sb-ink">استيراد JSON</span>
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
