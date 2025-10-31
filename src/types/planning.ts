// أنواع اللوحات
export interface CanvasBoard {
  id: string;
  name: string;
  description?: string;
  type: 'blank' | 'template' | 'from_file';
  status: 'active' | 'archived' | 'draft';
  lastModified: Date;
  createdAt: Date;
  thumbnailUrl?: string;
  owner: string;
  collaborators?: string[];
  tags?: string[];
}

// أنواع القوالب
export interface CanvasTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  previewElements: any[];
}

// حالة الملف المرفوع
export interface UploadedFile {
  id: string;
  name: string;
  type: 'text' | 'image' | 'pdf';
  size: number;
  url: string;
  uploadedAt: Date;
  analyzed?: boolean;
  analysisResult?: any;
}
