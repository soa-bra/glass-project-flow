/**
 * ImportDialog Component - Sprint 9
 * مربع حوار الاستيراد
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileJson, 
  FileCode, 
  X, 
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useExportImport } from '@/hooks/useExportImport';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generateNewIds, setGenerateNewIds] = useState(true);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [validationError, setValidationError] = useState<string | null>(null);

  const { isImporting, importFromFile } = useExportImport({
    onImportSuccess: () => {
      onOpenChange(false);
      resetState();
    },
  });

  const resetState = () => {
    setSelectedFile(null);
    setValidationStatus('idle');
    setValidationError(null);
    setOffsetX(0);
    setOffsetY(0);
  };

  const validateFile = useCallback(async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (!['json', 'svg'].includes(extension || '')) {
      setValidationStatus('invalid');
      setValidationError('صيغة غير مدعومة. يُقبل فقط JSON و SVG');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationStatus('invalid');
      setValidationError('حجم الملف كبير جداً (الحد الأقصى 10MB)');
      return false;
    }

    setValidationStatus('valid');
    setValidationError(null);
    return true;
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      await validateFile(file);
    }
  }, [validateFile]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      await validateFile(file);
    }
  }, [validateFile]);

  const handleImport = async () => {
    if (!selectedFile || validationStatus !== 'valid') return;

    await importFromFile(selectedFile, {
      generateNewIds,
      offsetPosition: { x: offsetX, y: offsetY },
    });
  };

  const getFileIcon = () => {
    if (!selectedFile) return null;
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'json') return <FileJson className="h-8 w-8 text-blue-500" />;
    if (ext === 'svg') return <FileCode className="h-8 w-8 text-green-500" />;
    return <Upload className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            استيراد ملف
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* منطقة السحب والإفلات */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-all ${
              dragActive
                ? 'border-primary bg-primary/5'
                : selectedFile
                ? 'border-border bg-muted/30'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <input
              type="file"
              accept=".json,.svg"
              onChange={handleFileSelect}
              className="absolute inset-0 cursor-pointer opacity-0"
            />

            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-2"
                >
                  <div className="flex justify-center">{getFileIcon()}</div>
                  <div className="font-medium">{selectedFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </div>
                  
                  {validationStatus === 'valid' && (
                    <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      ملف صالح
                    </div>
                  )}
                  
                  {validationStatus === 'invalid' && (
                    <div className="flex items-center justify-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-4 w-4" />
                      {validationError}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="no-file"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <div className="text-muted-foreground">
                    اسحب وأفلت ملف هنا
                  </div>
                  <div className="text-sm text-muted-foreground">
                    أو انقر لاختيار ملف
                  </div>
                  <div className="text-xs text-muted-foreground">
                    JSON, SVG (الحد الأقصى 10MB)
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* خيارات الاستيراد */}
          <AnimatePresence>
            {selectedFile && validationStatus === 'valid' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* توليد معرفات جديدة */}
                <div className="flex items-center justify-between">
                  <Label>توليد معرفات جديدة</Label>
                  <Switch
                    checked={generateNewIds}
                    onCheckedChange={setGenerateNewIds}
                  />
                </div>

                {/* إزاحة الموقع */}
                <div className="space-y-2">
                  <Label>إزاحة الموقع</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">X</Label>
                      <Input
                        type="number"
                        value={offsetX}
                        onChange={(e) => setOffsetX(Number(e.target.value))}
                        dir="ltr"
                      />
                    </div>
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Y</Label>
                      <Input
                        type="number"
                        value={offsetY}
                        onChange={(e) => setOffsetY(Number(e.target.value))}
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            onClick={handleImport}
            disabled={isImporting || !selectedFile || validationStatus !== 'valid'}
            className="flex-1 gap-2"
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جارِ الاستيراد...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                استيراد
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
