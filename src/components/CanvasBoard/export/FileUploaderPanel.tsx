import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Upload, FileText, Image, File, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderPanelProps {
  selectedTool: string;
  onFileAnalyzed: (result: any) => void;
}

export const FileUploaderPanel: React.FC<FileUploaderPanelProps> = ({
  selectedTool,
  onFileAnalyzed
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (selectedTool !== 'upload') return null;

  const supportedTypes = [
    { type: 'text', extensions: ['.txt', '.md', '.doc', '.docx'], icon: FileText, color: 'text-blue-600' },
    { type: 'image', extensions: ['.jpg', '.jpeg', '.png', '.gif'], icon: Image, color: 'text-green-600' },
    { type: 'document', extensions: ['.pdf', '.rtf'], icon: File, color: 'text-red-600' }
  ];

  const getFileIcon = (fileName: string) => {
    const ext = '.' + fileName.split('.').pop()?.toLowerCase();
    for (const type of supportedTypes) {
      if (type.extensions.includes(ext)) {
        return { Icon: type.icon, color: type.color };
      }
    }
    return { Icon: File, color: 'text-gray-600' };
  };

  const handleFileSelect = (selectedFile: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > maxSize) {
      toast.error('حجم الملف كبير جداً (الحد الأقصى 10 ميجابايت)');
      return;
    }

    setFile(selectedFile);
    toast.success('تم تحديد الملف بنجاح');
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('يرجى اختيار ملف أولاً');
      return;
    }

    setLoading(true);
    try {
      // محاكاة تحليل الملف
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileType = file.type;
      let analysisResult;

      if (fileType.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        analysisResult = {
          type: 'text',
          content: text,
          elements: [
            { type: 'text', content: 'عنوان رئيسي', x: 100, y: 100 },
            { type: 'text', content: 'فقرة مهمة', x: 100, y: 200 },
            { type: 'sticky', content: 'ملاحظة من الملف', x: 300, y: 150 }
          ],
          summary: `تم تحليل ${text.length} حرف وتوليد ${3} عنصر`
        };
      } else if (fileType.startsWith('image/')) {
        analysisResult = {
          type: 'image',
          url: URL.createObjectURL(file),
          elements: [
            { type: 'image', content: file.name, x: 150, y: 150, width: 300, height: 200 }
          ],
          summary: `تم رفع الصورة: ${file.name}`
        };
      } else {
        analysisResult = {
          type: 'document',
          name: file.name,
          elements: [
            { type: 'text', content: `محتوى من ${file.name}`, x: 100, y: 100 }
          ],
          summary: `تم تحليل المستند: ${file.name}`
        };
      }

      onFileAnalyzed(analysisResult);
      toast.success('تم تحليل الملف وإضافة العناصر بنجاح');
      setFile(null);
    } catch (error) {
      // Error handled silently
      toast.error('فشل في تحليل الملف');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const { Icon: FileIcon, color } = file ? getFileIcon(file.name) : { Icon: Upload, color: 'text-gray-400' };

  return (
    <ToolPanelContainer title="رفع وتحليل ملف">
      <div className="space-y-4">
        {/* منطقة الرفع */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
            id="file-input"
            accept=".txt,.md,.doc,.docx,.pdf,.jpg,.jpeg,.png,.gif"
          />
          
          <div className="flex flex-col items-center gap-3">
            <FileIcon className={`w-12 h-12 ${color}`} />
            
            {file ? (
              <div className="text-center">
                <p className="font-medium font-arabic text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} ميجابايت
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium font-arabic text-sm mb-1">
                  اسحب الملف هنا أو انقر للاختيار
                </p>
                <p className="text-xs text-gray-500">
                  يدعم النصوص والصور والمستندات
                </p>
              </div>
            )}
            
            <label
              htmlFor="file-input"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full text-sm font-arabic transition-colors"
            >
              اختيار ملف
            </label>
          </div>
        </div>

        {/* أنواع الملفات المدعومة */}
        <div>
          <h4 className="text-sm font-medium font-arabic mb-2">الملفات المدعومة</h4>
          <div className="grid gap-2">
            {supportedTypes.map((type, index) => {
              const TypeIcon = type.icon;
              return (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <TypeIcon className={`w-4 h-4 ${type.color}`} />
                  <span className="font-arabic">{type.extensions.join(', ')}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* زر التحليل */}
        <Button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="w-full rounded-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              جاري التحليل...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              رفع وتحليل
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 font-arabic">
          💡 سيتم تحليل المحتوى وتحويله إلى عناصر قابلة للتحرير على اللوحة
        </div>
      </div>
    </ToolPanelContainer>
  );
};