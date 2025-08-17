import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Hook for optimized file uploads with chunking and Web Workers
 * نظام رفع ملفات محسن مع التقطيع والـ Web Workers
 */

interface FileUploadConfig {
  maxFileSize?: number; // بالبايت
  chunkSize?: number; // بالبايت
  allowedTypes?: string[];
  maxConcurrentUploads?: number;
  enableWorker?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  result?: any;
  id: string;
}

interface ProcessedFile {
  id: string;
  file: File;
  thumbnail?: string;
  metadata: any;
  chunks?: ArrayBuffer[];
}

const DEFAULT_CONFIG: Required<FileUploadConfig> = {
  maxFileSize: 50 * 1024 * 1024, // 50MB
  chunkSize: 5 * 1024 * 1024, // 5MB chunks
  allowedTypes: ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt'],
  maxConcurrentUploads: 3,
  enableWorker: true
};

export function useFileUpload(config: FileUploadConfig = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(new Map());
  const [isProcessing, setIsProcessing] = useState(false);
  
  const workerRef = useRef<Worker | null>(null);
  const pendingTasks = useRef<Map<string, (result: any) => void>>(new Map());

  // إنشاء Web Worker
  const initializeWorker = useCallback(() => {
    if (!finalConfig.enableWorker || workerRef.current) return;
    
    try {
      workerRef.current = new Worker(
        new URL('../workers/fileProcessor.worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      workerRef.current.onmessage = (event) => {
        const { id, type, result, error } = event.data;
        const resolver = pendingTasks.current.get(id);
        
        if (resolver) {
          if (error) {
            resolver({ error });
          } else {
            resolver(result);
          }
          pendingTasks.current.delete(id);
        }

        // تحديث progress للـ chunking
        if (type === 'CHUNK_PROGRESS') {
          updateUploadProgress(id, result.percentage, 'processing');
        }
      };
      
      workerRef.current.onerror = (error) => {
        // Handle worker error
        toast.error('خطأ في معالج الملفات');
      };
    } catch (error) {
      // Web Workers not supported, fallback to main thread
      finalConfig.enableWorker = false;
    }
  }, [finalConfig.enableWorker]);

  // إرسال مهمة للـ Worker
  const sendToWorker = useCallback((type: string, payload: any): Promise<any> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        initializeWorker();
        if (!workerRef.current) {
          resolve({ error: 'Worker not available' });
          return;
        }
      }

      const id = crypto.randomUUID();
      pendingTasks.current.set(id, resolve);
      
      workerRef.current.postMessage({
        type,
        payload,
        id
      });
    });
  }, [initializeWorker]);

  // تحديث تقدم الرفع
  const updateUploadProgress = useCallback((id: string, progress: number, status: UploadProgress['status'], error?: string, result?: any) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      const upload = newUploads.get(id);
      if (upload) {
        newUploads.set(id, {
          ...upload,
          progress,
          status,
          error,
          result: result || upload.result
        });
      }
      return newUploads;
    });
  }, []);

  // التحقق من صحة الملف
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // فحص الحجم
    if (file.size > finalConfig.maxFileSize) {
      return {
        valid: false,
        error: `حجم الملف كبير جداً. الحد الأقصى: ${(finalConfig.maxFileSize / 1024 / 1024).toFixed(1)}MB`
      };
    }

    // فحص النوع
    const isAllowed = finalConfig.allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: 'نوع الملف غير مدعوم'
      };
    }

    return { valid: true };
  }, [finalConfig]);

  // معالجة الملف
  const processFile = useCallback(async (file: File): Promise<ProcessedFile> => {
    const id = crypto.randomUUID();
    
    setUploads(prev => new Map(prev).set(id, {
      file,
      progress: 0,
      status: 'processing',
      id
    }));

    try {
      let result;
      
      if (finalConfig.enableWorker) {
        result = await sendToWorker('PROCESS_FILE', file);
      } else {
        // معالجة على الخيط الرئيسي (fallback)
        result = await processFileMainThread(file);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      updateUploadProgress(id, 100, 'completed', undefined, result);
      
      return {
        id,
        file,
        thumbnail: result.thumbnail,
        metadata: result
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'خطأ في معالجة الملف';
      updateUploadProgress(id, 0, 'error', errorMessage);
      throw error;
    }
  }, [finalConfig.enableWorker, sendToWorker, updateUploadProgress]);

  // معالجة على الخيط الرئيسي (fallback)
  const processFileMainThread = useCallback(async (file: File) => {
    // تنفيذ بسيط للمعالجة بدون Worker
    if (file.type.startsWith('image/')) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        category: 'image',
        thumbnail: await createSimpleThumbnail(file)
      };
    }
    
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      category: 'other'
    };
  }, []);

  // إنشاء thumbnail بسيط
  const createSimpleThumbnail = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = 200;
        canvas.height = 200;
        ctx?.drawImage(img, 0, 0, 200, 200);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // رفع ملف واحد مع chunking
  const uploadFile = useCallback(async (file: File, onProgress?: (progress: number) => void): Promise<ProcessedFile> => {
    const validation = validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      throw new Error(validation.error);
    }

    setIsProcessing(true);
    
    try {
      const processedFile = await processFile(file);
      
      // محاكاة رفع الملف مع chunks
      if (file.size > finalConfig.chunkSize) {
        const chunks = await sendToWorker('CHUNK_FILE', { 
          file, 
          chunkSize: finalConfig.chunkSize 
        });
        
        if (chunks.error) {
          throw new Error(chunks.error);
        }
        
        // رفع chunks بشكل متتالي
        for (let i = 0; i < chunks.length; i++) {
          const progress = ((i + 1) / chunks.length) * 100;
          onProgress?.(progress);
          updateUploadProgress(processedFile.id, progress, 'uploading');
          
          // محاكاة delay للرفع
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      updateUploadProgress(processedFile.id, 100, 'completed');
      toast.success(`تم رفع ${file.name} بنجاح`);
      
      return processedFile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في رفع الملف';
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [validateFile, processFile, sendToWorker, finalConfig.chunkSize, updateUploadProgress]);

  // رفع ملفات متعددة
  const uploadFiles = useCallback(async (files: File[], onProgress?: (overall: number, fileProgress: Map<string, number>) => void): Promise<ProcessedFile[]> => {
    const results: ProcessedFile[] = [];
    const fileProgress = new Map<string, number>();
    
    // رفع بحد أقصى من الملفات المتزامنة
    const chunks = [];
    for (let i = 0; i < files.length; i += finalConfig.maxConcurrentUploads) {
      chunks.push(files.slice(i, i + finalConfig.maxConcurrentUploads));
    }
    
    for (const chunk of chunks) {
      const promises = chunk.map(async (file) => {
        try {
          const result = await uploadFile(file, (progress) => {
            fileProgress.set(file.name, progress);
            const overall = Array.from(fileProgress.values()).reduce((a, b) => a + b, 0) / files.length;
            onProgress?.(overall, new Map(fileProgress));
          });
          return result;
        } catch (error) {
          // Handle file upload failure silently
          return null;
        }
      });
      
      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults.filter(Boolean) as ProcessedFile[]);
    }
    
    return results;
  }, [uploadFile, finalConfig.maxConcurrentUploads]);

  // إزالة upload من القائمة
  const removeUpload = useCallback((id: string) => {
    setUploads(prev => {
      const newUploads = new Map(prev);
      newUploads.delete(id);
      return newUploads;
    });
  }, []);

  // مسح جميع uploads
  const clearUploads = useCallback(() => {
    setUploads(new Map());
  }, []);

  // تنظيف الموارد
  const cleanup = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    pendingTasks.current.clear();
  }, []);

  return {
    uploads: Array.from(uploads.values()),
    isProcessing,
    uploadFile,
    uploadFiles,
    removeUpload,
    clearUploads,
    cleanup,
    config: finalConfig
  };
}