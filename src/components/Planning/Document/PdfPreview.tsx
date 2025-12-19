/**
 * معاينة PDF
 * يعرض مستند PDF مع إمكانيات التنقل والتكبير
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Maximize2,
  Minimize2,
  X,
  FileText,
  Loader2
} from 'lucide-react';

interface PdfPreviewProps {
  url: string;
  fileName?: string;
  onClose?: () => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function PdfPreview({
  url,
  fileName = 'document.pdf',
  onClose,
  fullscreen = false,
  onToggleFullscreen
}: PdfPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 50));
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [url, fileName]);

  const handleIframeLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setLoading(false);
    setError('فشل في تحميل المستند');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`
        bg-white rounded-[18px] overflow-hidden flex flex-col
        ${fullscreen 
          ? 'fixed inset-4 z-50 shadow-2xl' 
          : 'w-full h-full'
        }
      `}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[hsl(var(--panel))] border-b border-[#DADCE0]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[hsl(var(--accent-red))]" />
            <span className="text-[13px] font-semibold text-[hsl(var(--ink))] max-w-[200px] truncate">
              {fileName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1 hover:bg-[hsl(var(--panel))] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomOut size={16} className="text-[hsl(var(--ink-60))]" />
            </button>
            <span className="text-[12px] text-[hsl(var(--ink))] min-w-[40px] text-center font-medium">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1 hover:bg-[hsl(var(--panel))] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ZoomIn size={16} className="text-[hsl(var(--ink-60))]" />
            </button>
          </div>

          {/* Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1 bg-white rounded-lg px-2 py-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 hover:bg-[hsl(var(--panel))] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} className="text-[hsl(var(--ink-60))]" />
              </button>
              <span className="text-[12px] text-[hsl(var(--ink))] min-w-[60px] text-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 hover:bg-[hsl(var(--panel))] rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} className="text-[hsl(var(--ink-60))]" />
              </button>
            </div>
          )}

          {/* Actions */}
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            title="تحميل"
          >
            <Download size={16} className="text-[hsl(var(--ink-60))]" />
          </button>

          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title={fullscreen ? 'تصغير' : 'تكبير'}
            >
              {fullscreen ? (
                <Minimize2 size={16} className="text-[hsl(var(--ink-60))]" />
              ) : (
                <Maximize2 size={16} className="text-[hsl(var(--ink-60))]" />
              )}
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
              title="إغلاق"
            >
              <X size={16} className="text-[hsl(var(--ink-60))]" />
            </button>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative overflow-auto bg-[#525659]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--panel))]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-[hsl(var(--accent-blue))] animate-spin" />
              <span className="text-[13px] text-[hsl(var(--ink-60))]">جاري تحميل المستند...</span>
            </div>
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--panel))]">
            <div className="flex flex-col items-center gap-3 text-center">
              <FileText size={48} className="text-[hsl(var(--ink-30))]" />
              <p className="text-[14px] text-[hsl(var(--ink-60))]">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                }}
                className="px-4 py-2 bg-[hsl(var(--accent-blue))] text-white text-[12px] font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        ) : (
          <div 
            className="flex justify-center p-4"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <iframe
              src={`${url}#page=${currentPage}&toolbar=0&navpanes=0`}
              className="w-full max-w-[800px] h-[calc(100vh-200px)] bg-white shadow-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={fileName}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Simple PDF Thumbnail
export function PdfThumbnail({ 
  url, 
  onClick 
}: { 
  url: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden cursor-pointer
        border border-[#DADCE0] hover:border-[hsl(var(--accent-blue))] transition-colors
        group"
    >
      {/* PDF Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-[hsl(var(--panel))]">
        <FileText size={32} className="text-[hsl(var(--accent-red))]" />
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 
        flex items-center justify-center transition-colors">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <Maximize2 size={18} className="text-[hsl(var(--ink))]" />
        </motion.div>
      </div>

      {/* PDF Badge */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[hsl(var(--accent-red))] rounded text-[9px] text-white font-bold">
        PDF
      </div>
    </div>
  );
}

export default PdfPreview;
