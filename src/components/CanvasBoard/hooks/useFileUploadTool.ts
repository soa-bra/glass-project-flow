import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CanvasElement } from '@/types/canvas';

export interface FileUploadController {
  handleFileUpload: (file: File) => Promise<void>;
  isValidFile: (file: File) => boolean;
  getFileType: (file: File) => 'image' | 'document' | 'video' | 'unknown';
}

export const useFileUploadTool = (
  onElementAdd: (element: CanvasElement) => void
): FileUploadController => {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_TYPES = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'],
    document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    video: ['video/mp4', 'video/webm', 'video/ogg']
  };

  const isValidFile = useCallback((file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      return false;
    }

    const allSupportedTypes = [
      ...SUPPORTED_TYPES.image,
      ...SUPPORTED_TYPES.document,
      ...SUPPORTED_TYPES.video
    ];

    return allSupportedTypes.includes(file.type);
  }, []);

  const getFileType = useCallback((file: File): 'image' | 'document' | 'video' | 'unknown' => {
    if (SUPPORTED_TYPES.image.includes(file.type)) return 'image';
    if (SUPPORTED_TYPES.document.includes(file.type)) return 'document';
    if (SUPPORTED_TYPES.video.includes(file.type)) return 'video';
    return 'unknown';
  }, []);

  const createFileURL = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  const handleFileUpload = useCallback(async (file: File): Promise<void> => {
    if (!isValidFile(file)) {
      throw new Error('نوع الملف غير مدعوم أو حجمه كبير جداً');
    }

    const fileType = getFileType(file);
    const fileURL = createFileURL(file);

    // Create canvas element based on file type
    const element: CanvasElement = {
      id: uuidv4(),
      type: 'upload',
      position: { x: 100, y: 100 },
      size: fileType === 'image' ? { width: 300, height: 200 } : { width: 200, height: 100 },
      rotation: 0,
      locked: false,
      content: file.name,
      style: {
        fillColor: 'transparent',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        borderStyle: 'solid',
        opacity: 1
      },
      layerId: 'default',
      visible: true,
      data: {
        fileType,
        fileName: file.name,
        fileSize: file.size,
        fileURL,
        mimeType: file.type
      }
    };

    onElementAdd(element);
  }, [isValidFile, getFileType, createFileURL, onElementAdd]);

  return {
    handleFileUpload,
    isValidFile,
    getFileType
  };
};