import React, { useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Image, 
  FileText, 
  Film, 
  Music, 
  Archive, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download,
  Edit,
  Trash2,
  Sparkles,
  Brain,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Plus,
  Grid3X3,
  List
} from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileUploadItem {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  aiAnalysis?: {
    type: string;
    description: string;
    suggestedInsertions: string[];
  };
}

interface EnhancedFileUploadPanelProps {
  onFileUpload: (files: File[]) => void;
  onInsertFile?: (file: File, options?: any) => void;
  onSmartInsert?: (file: File, analysis: any) => void;
}

const FileTypeIcon = ({ type }: { type: string }) => {
  if (type.startsWith('image/')) return <FileImage className="w-4 h-4" />;
  if (type.startsWith('video/')) return <FileVideo className="w-4 h-4" />;
  if (type.startsWith('audio/')) return <FileAudio className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
};

const FilePreview = ({ file, preview }: { file: File; preview?: string }) => {
  if (file.type.startsWith('image/') && preview) {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden border">
        <img src={preview} alt={file.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  
  return (
    <div className="w-12 h-12 rounded-lg border flex items-center justify-center bg-muted">
      <FileTypeIcon type={file.type} />
    </div>
  );
};

export const EnhancedFileUploadPanel: React.FC<EnhancedFileUploadPanelProps> = ({
  onFileUpload,
  onInsertFile,
  onSmartInsert
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<FileUploadItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('upload');

  // منطقة السحب والإفلات
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  // معالجة الملفات
  const processFiles = async (files: File[]) => {
    const newUploads: FileUploadItem[] = [];

    for (const file of files) {
      const uploadItem: FileUploadItem = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: 'uploading',
        progress: 0
      };

      // إنشاء معاينة للصور
      if (file.type.startsWith('image/')) {
        uploadItem.preview = URL.createObjectURL(file);
      }

      newUploads.push(uploadItem);
    }

    setUploads(prev => [...prev, ...newUploads]);

    // محاكاة رفع الملفات
    for (const uploadItem of newUploads) {
      await simulateUpload(uploadItem);
    }

    onFileUpload(files);
    toast.success(`تم رفع ${files.length} ملف بنجاح`);
  };

  const simulateUpload = async (uploadItem: FileUploadItem) => {
    // محاكاة تقدم الرفع
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploads(prev => prev.map(item => 
        item.id === uploadItem.id 
          ? { ...item, progress } 
          : item
      ));
    }

    // محاكاة تحليل AI
    const aiAnalysis = await simulateAIAnalysis(uploadItem.file);
    
    setUploads(prev => prev.map(item => 
      item.id === uploadItem.id 
        ? { 
            ...item, 
            status: 'completed',
            aiAnalysis
          } 
        : item
    ));
  };

  const simulateAIAnalysis = async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (file.type.startsWith('image/')) {
      return {
        type: 'صورة',
        description: 'صورة تحتوي على عناصر بصرية مميزة',
        suggestedInsertions: [
          'إدراج كخلفية',
          'إدراج كعنصر مستقل', 
          'تحليل وإستخراج النص',
          'إنشاء عناصر مشابهة'
        ]
      };
    }
    
    return {
      type: 'ملف',
      description: 'ملف جاهز للاستخدام',
      suggestedInsertions: [
        'إدراج كمرفق',
        'تحويل إلى عنصر تفاعلي'
      ]
    };
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setUploads(prev => {
      const item = prev.find(upload => upload.id === id);
      if (item?.preview) {
        URL.revokeObjectURL(item.preview);
      }
      return prev.filter(upload => upload.id !== id);
    });
  };

  const clearAllFiles = () => {
    uploads.forEach(upload => {
      if (upload.preview) {
        URL.revokeObjectURL(upload.preview);
      }
    });
    setUploads([]);
  };

  const handleInsert = (uploadItem: FileUploadItem, type: 'normal' | 'smart' = 'normal') => {
    if (type === 'smart' && uploadItem.aiAnalysis && onSmartInsert) {
      onSmartInsert(uploadItem.file, uploadItem.aiAnalysis);
    } else if (onInsertFile) {
      onInsertFile(uploadItem.file);
    }
    toast.success('تم إدراج الملف في الكانفاس');
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Upload className="w-4 h-4" />
          رفع الملفات
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="upload" className="text-xs">رفع جديد</TabsTrigger>
            <TabsTrigger value="manage" className="text-xs">
              إدارة الملفات ({uploads.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="flex-1 m-0">
            {/* منطقة السحب والإفلات */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                ${dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleFileSelect}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">
                اسحب الملفات هنا أو انقر للاختيار
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                الصور، المستندات، الفيديو، والصوت
              </p>
              
              <div className="flex gap-2 justify-center mb-4">
                <BaseBadge variant="secondary" className="text-xs">
                  <Image className="w-3 h-3 mr-1" />
                  صور
                </BaseBadge>
                <BaseBadge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  مستندات
                </BaseBadge>
                <BaseBadge variant="secondary" className="text-xs">
                  <Film className="w-3 h-3 mr-1" />
                  فيديو
                </BaseBadge>
              </div>

              <Button size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-2" />
                اختيار ملفات
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </TabsContent>

          <TabsContent value="manage" className="flex-1 m-0 flex flex-col">
            {uploads.length > 0 && (
              <>
                {/* أدوات التحكم */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      onClick={() => setViewMode('grid')}
                      className="h-7 w-7 p-0"
                    >
                      <Grid3X3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      onClick={() => setViewMode('list')}
                      className="h-7 w-7 p-0"
                    >
                      <List className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={clearAllFiles}
                    className="text-xs"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    مسح الكل
                  </Button>
                </div>

                {/* قائمة الملفات */}
                <ScrollArea className="flex-1">
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-2' : 'space-y-2'}>
                    {uploads.map((uploadItem) => (
                      <div
                        key={uploadItem.id}
                        className="border rounded-lg p-3 bg-card hover:bg-accent/5 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <FilePreview file={uploadItem.file} preview={uploadItem.preview} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xs font-medium truncate">
                                {uploadItem.file.name}
                              </h4>
                              {uploadItem.status === 'completed' && (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              )}
                              {uploadItem.status === 'error' && (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">
                              {(uploadItem.file.size / 1024 / 1024).toFixed(1)} MB
                            </p>

                            {uploadItem.status === 'uploading' && (
                              <Progress value={uploadItem.progress} className="h-1 mb-2" />
                            )}

                            {uploadItem.status === 'completed' && uploadItem.aiAnalysis && (
                              <div className="mb-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <Brain className="w-3 h-3 text-primary" />
                                  <span className="text-xs text-primary font-medium">
                                    تحليل ذكي
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {uploadItem.aiAnalysis.description}
                                </p>
                                
                                <div className="flex gap-1 mb-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleInsert(uploadItem, 'normal')}
                                    className="h-6 text-xs"
                                  >
                                    إدراج عادي
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleInsert(uploadItem, 'smart')}
                                    className="h-6 text-xs"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    إدراج ذكي
                                  </Button>
                                </div>
                              </div>
                            )}

                            {uploadItem.status === 'completed' && (
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleInsert(uploadItem)}
                                  className="h-6 text-xs"
                                >
                                  <Eye className="w-3 h-3 mr-1" />
                                  معاينة
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => removeFile(uploadItem.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}

            {uploads.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    لا توجد ملفات مرفوعة
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};