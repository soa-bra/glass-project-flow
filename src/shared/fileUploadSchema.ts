import { z } from 'zod';

export const FILE_UPLOAD_IMPORTANCE_VALUES = ['Low', 'Medium', 'High'] as const;

export const fileUploadImportanceSchema = z.enum(FILE_UPLOAD_IMPORTANCE_VALUES);

export const fileUploadPolicySchema = z.object({
  maxFiles: z.number().int().positive().optional(),
  maxSizeBytes: z.number().int().positive(),
  allowedMimeTypes: z.array(z.string()).optional(),
});

export const uploadedFileMetadataSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  size: z.number().nonnegative(),
});

export const projectFileUploadFormSchema = z.object({
  fileCount: z.number().int().positive(),
  fileTitle: z.string().trim().min(1),
  importance: fileUploadImportanceSchema,
  tags: z.array(z.string().trim().min(1)),
  selectedTasks: z.array(z.string().min(1)),
});

export type FileUploadImportance = z.infer<typeof fileUploadImportanceSchema>;
export type FileUploadPolicy = z.infer<typeof fileUploadPolicySchema>;
export type UploadedFileMetadata = z.infer<typeof uploadedFileMetadataSchema>;
export type ProjectFileUploadForm = z.infer<typeof projectFileUploadFormSchema>;

export interface FileUploadValidationError {
  code: 'too_many_files' | 'unsupported_type' | 'file_too_large' | 'no_files' | 'missing_title';
  title: string;
  description: string;
}

export const PLANNING_FILE_UPLOAD_POLICY = fileUploadPolicySchema.parse({
  maxFiles: 1,
  maxSizeBytes: 20 * 1024 * 1024,
  allowedMimeTypes: ['text/plain', 'application/pdf', 'image/png', 'image/jpeg'],
});

export const PROJECT_FILE_UPLOAD_POLICY = fileUploadPolicySchema.parse({
  maxSizeBytes: 50 * 1024 * 1024,
});

export const validateUploadFiles = (
  files: readonly Pick<File, 'name' | 'size' | 'type'>[],
  policy: FileUploadPolicy,
): FileUploadValidationError | null => {
  if (files.length === 0) {
    return {
      code: 'no_files',
      title: 'لم يتم اختيار ملفات',
      description: 'يرجى اختيار ملف واحد على الأقل للرفع',
    };
  }

  if (policy.maxFiles && files.length > policy.maxFiles) {
    return {
      code: 'too_many_files',
      title: 'عدد الملفات غير مدعوم',
      description: `يمكن رفع ${policy.maxFiles} ملف(ات) كحد أقصى في هذه الواجهة`,
    };
  }

  const unsupportedFile = files.find(
    (file) => policy.allowedMimeTypes && !policy.allowedMimeTypes.includes(file.type),
  );

  if (unsupportedFile) {
    return {
      code: 'unsupported_type',
      title: 'نوع ملف غير مدعوم',
      description: `الملف ${unsupportedFile.name} لا يطابق أنواع الملفات المسموحة`,
    };
  }

  const oversizedFile = files.find((file) => file.size > policy.maxSizeBytes);

  if (oversizedFile) {
    return {
      code: 'file_too_large',
      title: 'حجم الملف كبير جداً',
      description: `الملف ${oversizedFile.name} يتجاوز الحد المسموح (${formatFileSize(policy.maxSizeBytes)})`,
    };
  }

  return null;
};

export const validateProjectFileUploadForm = (form: ProjectFileUploadForm): FileUploadValidationError | null => {
  const result = projectFileUploadFormSchema.safeParse(form);

  if (result.success) return null;

  const missingTitle = result.error.issues.some((issue) => issue.path[0] === 'fileTitle');

  if (missingTitle) {
    return {
      code: 'missing_title',
      title: 'عنوان الملف مطلوب',
      description: 'يرجى إدخال عنوان للملف',
    };
  }

  return {
    code: 'no_files',
    title: 'لم يتم اختيار ملفات',
    description: 'يرجى اختيار ملف واحد على الأقل للرفع',
  };
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getSharedProjectFileType = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return 'archive';
  if (mimeType) return 'document';
  return 'other';
};
