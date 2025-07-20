
export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  size: string;
  uploadDate: string;
  classification: 'Low' | 'Medium' | 'High';
  version: string;
  uploadedBy: string;
  tags: string[];
  folderId?: string;
  projectId?: string;
  linkedTask?: string;
  comments?: Comment[];
}

export const projectFiles: ProjectFile[] = [
  // وثائق المشروع
  { 
    id: 'file1', 
    name: 'وثيقة متطلبات المشروع.pdf', 
    type: 'document', 
    size: '3.2 MB',
    uploadDate: '2024-01-20',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'أحمد محمد',
    tags: ['وثيقة', 'متطلبات', 'مشروع'],
    projectId: 'current'
  },
  { 
    id: 'file2', 
    name: 'خطة المشروع التفصيلية.docx', 
    type: 'document', 
    size: '1.8 MB',
    uploadDate: '2024-01-19',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'فاطمة أحمد',
    tags: ['خطة', 'مشروع', 'تفصيلية'],
    projectId: 'current'
  },
  { 
    id: 'file3', 
    name: 'مواصفات النظام الفنية.pdf', 
    type: 'document', 
    size: '4.1 MB',
    uploadDate: '2024-01-18',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'خالد سعد',
    tags: ['مواصفات', 'نظام', 'فنية'],
    projectId: 'current'
  },
  // تصاميم وواجهات
  { 
    id: 'file4', 
    name: 'تصميم واجهة المستخدم.fig', 
    type: 'image', 
    size: '15.7 MB',
    uploadDate: '2024-01-17',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'نورا عبدالله',
    tags: ['تصميم', 'واجهة', 'مستخدم'],
    projectId: 'current'
  },
  { 
    id: 'file5', 
    name: 'نماذج أولية للتطبيق.sketch', 
    type: 'image', 
    size: '22.3 MB',
    uploadDate: '2024-01-16',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'فاطمة أحمد',
    tags: ['نماذج', 'أولية', 'تطبيق'],
    projectId: 'current'
  },
  { 
    id: 'file6', 
    name: 'أيقونات النظام.svg', 
    type: 'image', 
    size: '892 KB',
    uploadDate: '2024-01-15',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'نورا عبدالله',
    tags: ['أيقونات', 'نظام', 'SVG'],
    projectId: 'current'
  },
  // عروض تقديمية
  { 
    id: 'file7', 
    name: 'عرض المشروع للعميل.pptx', 
    type: 'document', 
    size: '8.9 MB',
    uploadDate: '2024-01-14',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'أحمد محمد',
    tags: ['عرض', 'مشروع', 'عميل'],
    projectId: 'current'
  },
  { 
    id: 'file8', 
    name: 'تقرير التقدم الشهري.pptx', 
    type: 'document', 
    size: '5.6 MB',
    uploadDate: '2024-01-13',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'خالد سعد',
    tags: ['تقرير', 'تقدم', 'شهري'],
    projectId: 'current'
  },
  // ملفات الوسائط
  { 
    id: 'file9', 
    name: 'فيديو شرح النظام.mp4', 
    type: 'video', 
    size: '125.3 MB',
    uploadDate: '2024-01-12',
    classification: 'Low',
    version: 'v1.0',
    uploadedBy: 'فاطمة أحمد',
    tags: ['فيديو', 'شرح', 'نظام'],
    projectId: 'current'
  },
  { 
    id: 'file10', 
    name: 'تسجيل اجتماع الفريق.mp4', 
    type: 'video', 
    size: '89.7 MB',
    uploadDate: '2024-01-11',
    classification: 'Low',
    version: 'v1.0',
    uploadedBy: 'نورا عبدالله',
    tags: ['تسجيل', 'اجتماع', 'فريق'],
    projectId: 'current'
  },
  { 
    id: 'file11', 
    name: 'صور واجهة النظام.zip', 
    type: 'archive', 
    size: '12.4 MB',
    uploadDate: '2024-01-10',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'أحمد محمد',
    tags: ['صور', 'واجهة', 'نظام'],
    projectId: 'current'
  },
  // ملفات البرمجة والكود
  { 
    id: 'file12', 
    name: 'كود المشروع الأساسي.zip', 
    type: 'archive', 
    size: '45.2 MB',
    uploadDate: '2024-01-09',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'خالد سعد',
    tags: ['كود', 'مشروع', 'أساسي'],
    projectId: 'current'
  },
  { 
    id: 'file13', 
    name: 'ملفات قاعدة البيانات.sql', 
    type: 'other', 
    size: '2.8 MB',
    uploadDate: '2024-01-08',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'فاطمة أحمد',
    tags: ['قاعدة بيانات', 'SQL', 'ملفات'],
    projectId: 'current'
  },
  { 
    id: 'file14', 
    name: 'ملفات الإعدادات والبيئة.json', 
    type: 'other', 
    size: '156 KB',
    uploadDate: '2024-01-07',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'أحمد محمد',
    tags: ['إعدادات', 'بيئة', 'JSON'],
    projectId: 'current'
  },
  // ملفات البيانات والتقارير
  { 
    id: 'file15', 
    name: 'بيانات العملاء.xlsx', 
    type: 'document', 
    size: '3.7 MB',
    uploadDate: '2024-01-06',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'نورا عبدالله',
    tags: ['بيانات', 'عملاء', 'جدول'],
    projectId: 'current'
  },
  { 
    id: 'file16', 
    name: 'تقرير الاختبارات.xlsx', 
    type: 'document', 
    size: '1.9 MB',
    uploadDate: '2024-01-05',
    classification: 'Medium',
    version: 'v1.0',
    uploadedBy: 'خالد سعد',
    tags: ['تقرير', 'اختبارات', 'جدول'],
    projectId: 'current'
  },
  // أرشيف ونسخ احتياطية
  { 
    id: 'file17', 
    name: 'نسخة احتياطية كاملة.zip', 
    type: 'archive', 
    size: '256.8 MB',
    uploadDate: '2024-01-04',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'أحمد محمد',
    tags: ['نسخة احتياطية', 'كاملة', 'أرشيف'],
    projectId: 'current'
  },
  { 
    id: 'file18', 
    name: 'أرشيف الإصدار السابق.tar.gz', 
    type: 'archive', 
    size: '178.4 MB',
    uploadDate: '2024-01-03',
    classification: 'High',
    version: 'v1.0',
    uploadedBy: 'فاطمة أحمد',
    tags: ['أرشيف', 'إصدار سابق', 'ضغط'],
    projectId: 'current'
  }
];

// Helper function to filter files by project ID
export const getProjectFiles = (projectId?: string) => {
  if (!projectId) return projectFiles;
  return projectFiles.filter(file => file.projectId === projectId);
};

// Helper function to get file count by type
export const getFileCountByType = (files: ProjectFile[], type: string) => {
  return files.filter(file => file.type === type).length;
};
