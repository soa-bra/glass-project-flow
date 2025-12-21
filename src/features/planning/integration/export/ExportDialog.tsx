/**
 * ExportDialog Component - Sprint 9
 * مربع حوار التصدير
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Image, 
  FileCode, 
  FileJson, 
  X, 
  Download,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useExportImport } from '@/hooks/useExportImport';
import { ExportFormat } from '@/core/exportEngine';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedElementIds?: string[];
}

const FORMAT_OPTIONS: Array<{
  value: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'pdf',
    label: 'PDF',
    description: 'مستند PDF للطباعة والمشاركة',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    value: 'png',
    label: 'PNG',
    description: 'صورة عالية الجودة',
    icon: <Image className="h-5 w-5" />,
  },
  {
    value: 'svg',
    label: 'SVG',
    description: 'رسومات متجهة قابلة للتحرير',
    icon: <FileCode className="h-5 w-5" />,
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'بيانات للاستيراد لاحقاً',
    icon: <FileJson className="h-5 w-5" />,
  },
];

export const ExportDialog: React.FC<ExportDialogProps> = ({
  open,
  onOpenChange,
  selectedElementIds,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [filename, setFilename] = useState('');
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.92);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [background, setBackground] = useState('#FFFFFF');

  const { 
    isExporting, 
    exportCanvas, 
    exportSelectedElements 
  } = useExportImport({
    onExportSuccess: () => onOpenChange(false),
  });

  const handleExport = async () => {
    const options = {
      filename: filename || undefined,
      scale,
      quality,
      includeMetadata,
      background,
    };

    if (selectedElementIds && selectedElementIds.length > 0) {
      await exportSelectedElements(selectedElementIds, selectedFormat, options);
    } else {
      await exportCanvas(selectedFormat, options);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تصدير اللوحة
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* اختيار الصيغة */}
          <div className="space-y-3">
            <Label>صيغة التصدير</Label>
            <div className="grid grid-cols-2 gap-2">
              {FORMAT_OPTIONS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-right transition-all ${
                    selectedFormat === format.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className={`rounded-lg p-2 ${
                    selectedFormat === format.value
                      ? 'bg-primary text-white'
                      : 'bg-muted'
                  }`}>
                    {format.icon}
                  </div>
                  <div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {format.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* اسم الملف */}
          <div className="space-y-2">
            <Label>اسم الملف (اختياري)</Label>
            <Input
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="canvas-export"
              dir="ltr"
            />
          </div>

          {/* خيارات PNG */}
          <AnimatePresence>
            {selectedFormat === 'png' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>جودة الصورة: {Math.round(quality * 100)}%</Label>
                  <Slider
                    value={[quality * 100]}
                    onValueChange={([v]) => setQuality(v / 100)}
                    min={50}
                    max={100}
                    step={1}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* خيارات المقياس */}
          {(selectedFormat === 'png' || selectedFormat === 'pdf') && (
            <div className="space-y-2">
              <Label>المقياس: {scale}x</Label>
              <Slider
                value={[scale]}
                onValueChange={([v]) => setScale(v)}
                min={1}
                max={4}
                step={0.5}
              />
            </div>
          )}

          {/* لون الخلفية */}
          <div className="space-y-2">
            <Label>لون الخلفية</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="h-10 w-14 cursor-pointer p-1"
              />
              <Input
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1 font-mono"
                dir="ltr"
              />
            </div>
          </div>

          {/* تضمين البيانات الوصفية */}
          <div className="flex items-center justify-between">
            <Label>تضمين البيانات الوصفية</Label>
            <Switch
              checked={includeMetadata}
              onCheckedChange={setIncludeMetadata}
            />
          </div>

          {/* معلومات التحديد */}
          {selectedElementIds && selectedElementIds.length > 0 && (
            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              سيتم تصدير {selectedElementIds.length} عنصر محدد فقط
            </div>
          )}
        </div>

        {/* أزرار الإجراءات */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جارِ التصدير...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                تصدير
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
