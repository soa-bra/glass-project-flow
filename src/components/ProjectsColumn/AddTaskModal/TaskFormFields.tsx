
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X, FileText, Image, Video, Music, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TaskFormData, teamMembers, priorities } from './types';

interface TaskFormFieldsProps {
  taskData: TaskFormData;
  onInputChange: (field: string, value: string) => void;
  onTaskDataChange: (updater: (prev: TaskFormData) => TaskFormData) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
}

export const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  taskData,
  onInputChange,
  onTaskDataChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-6 h-6 text-black/70" />;
    if (type.startsWith('video/')) return <Video className="w-6 h-6 text-black/70" />;
    if (type.startsWith('audio/')) return <Music className="w-6 h-6 text-black/70" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-6 h-6 text-black/70" />;
    return <FileText className="w-6 h-6 text-black/70" />;
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = Array.from(files).map(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const uploadedFile: UploadedFile = { id, file };
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === id ? { ...f, preview: e.target?.result as string } : f)
          );
        };
        reader.readAsDataURL(file);
      }
      
      return uploadedFile;
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Update taskData with file names
    onTaskDataChange(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles.map(f => f.file.name)]
    }));
  };

  const removeFile = (id: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === id);
    if (!fileToRemove) return;

    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    
    // Update taskData
    onTaskDataChange(prev => ({
      ...prev,
      attachments: prev.attachments.filter(name => name !== fileToRemove.file.name)
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-arabic text-right flex items-center gap-2">
          عنوان المهمة 
          <span className="text-[#f1b5b9] text-lg">*</span>
        </Label>
        <Input 
          value={taskData.title} 
          onChange={e => onInputChange('title', e.target.value)} 
          placeholder="أدخل عنوان المهمة" 
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الوصف</Label>
        <Textarea 
          value={taskData.description} 
          onChange={e => onInputChange('description', e.target.value)} 
          placeholder="أدخل وصف المهمة" 
          className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="font-arabic text-right flex items-center gap-2">
            تاريخ الاستحقاق 
            <span className="text-[#f1b5b9] text-lg">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none justify-start text-left font-normal",
                  !taskData.dueDate && "text-black/50"
                )}
              >
                <CalendarIcon className="ml-2 h-4 w-4" />
                {taskData.dueDate ? (
                  format(new Date(taskData.dueDate), "PPP", { locale: ar })
                ) : (
                  <span>اختر تاريخ الاستحقاق</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[10000]" align="start">
              <Calendar 
                mode="single" 
                selected={taskData.dueDate ? new Date(taskData.dueDate) : undefined} 
                onSelect={(date) => onInputChange('dueDate', date ? format(date, 'yyyy-MM-dd') : '')} 
                initialFocus 
                className="p-3 pointer-events-auto" 
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label className="font-arabic text-right flex items-center gap-2">
            المكلف 
            <span className="text-[#f1b5b9] text-lg">*</span>
          </Label>
          <Select value={taskData.assignee} onValueChange={value => onInputChange('assignee', value)}>
            <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
              <SelectValue placeholder="اختر المكلف" />
            </SelectTrigger>
            <SelectContent className="z-[10000] sb-popover-shell text-[#0B0F12] font-arabic">
              {teamMembers.map(member => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-arabic text-right">الأولوية</Label>
        <Select 
          value={taskData.priority} 
          onValueChange={(value: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important') => 
            onTaskDataChange(prev => ({ ...prev, priority: value }))
          }
        >
          <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
            <SelectValue placeholder="اختر الأولوية" />
          </SelectTrigger>
          <SelectContent className="z-[10000] sb-popover-shell text-[#0B0F12] font-arabic">
            {priorities.map(priority => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* منطقة رفع الملفات */}
      <div className="space-y-4">
        <label className="block text-sm font-bold text-black font-arabic">
          المرفقات
        </label>
                     
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-colors cursor-pointer ${
            isDragOver
               ? 'border-black bg-black/5'
               : 'border-black/20 hover:border-black/40'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 text-black/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-black mb-2">
            اسحب الملفات هنا أو انقر للتصفح
          </h3>
          <p className="text-sm text-black/70">
            يدعم جميع أنواع الملفات • الحد الأقصى 50MB لكل ملف
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* قائمة الملفات المرفوعة */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-black">الملفات المحددة:</h4>
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-white/30 rounded-2xl border border-black/10">
                {file.preview ? (
                  <img src={file.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 bg-black/10 rounded-lg flex items-center justify-center">
                    {getFileIcon(file.file.type)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">{file.file.name}</p>
                  <p className="text-xs text-black/70">{formatFileSize(file.file.size)}</p>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
