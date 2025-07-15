import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Upload, File } from 'lucide-react';

interface ApprovalRequestData {
  requestedBudget: number;
  justification: string;
  attachments: File[];
}

interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: ApprovalRequestData) => void;
  userRole?: string;
}

export const ApprovalRequestModal: React.FC<ApprovalRequestModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  userRole = 'team_member'
}) => {
  const [formData, setFormData] = useState<ApprovalRequestData>({
    requestedBudget: 0,
    justification: '',
    attachments: []
  });

  const [dragActive, setDragActive] = useState(false);

  // Check if user has permission (Project Manager or above)
  const hasPermission = ['project_manager', 'department_manager', 'admin', 'owner'].includes(userRole);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission) {
      alert('غير مصرح لك بتقديم طلبات الموافقة المالية');
      return;
    }
    
    if (formData.requestedBudget > 0 && formData.justification.trim()) {
      onSubmit(formData);
      setFormData({
        requestedBudget: 0,
        justification: '',
        attachments: []
      });
      onClose();
    }
  };

  const handleInputChange = (field: keyof ApprovalRequestData, value: string | number | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!hasPermission) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="sm:max-w-md w-[95%] rounded-3xl border-0 shadow-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <div className="relative text-center p-6">
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            
            <DialogHeader className="pb-4">
              <DialogTitle className="text-xl font-bold text-white font-arabic">
                غير مصرح
              </DialogTitle>
            </DialogHeader>

            <p className="text-white/90 mb-4 font-arabic">
              هذه الميزة متاحة فقط لمدير المشروع فأعلى
            </p>
            
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors font-arabic"
            >
              موافق
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg w-[95%] rounded-3xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-xl font-bold text-white font-arabic">
              طلب موافقة مالية
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* الميزانية المطلوبة */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                الميزانية المطلوبة (ر.س) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.requestedBudget || ''}
                onChange={(e) => handleInputChange('requestedBudget', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-arabic"
                placeholder="أدخل المبلغ المطلوب"
                required
                dir="rtl"
              />
            </div>

            {/* مبررات الطلب */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                مبررات الطلب *
              </label>
              <textarea
                value={formData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none font-arabic"
                placeholder="اشرح سبب طلب الميزانية الإضافية وكيف ستُستخدم..."
                required
                dir="rtl"
              />
            </div>

            {/* المرفقات */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                المرفقات (اختياري)
              </label>
              
              {/* منطقة رفع الملفات */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-white/50 bg-white/10' 
                    : 'border-white/20 bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                
                <Upload className="w-8 h-8 text-white/70 mx-auto mb-2" />
                <p className="text-white/90 font-arabic mb-1">
                  اسحب الملفات هنا أو انقر للتحديد
                </p>
                <p className="text-white/60 text-xs font-arabic">
                  PDF, DOC, XLS, JPG, PNG (حد أقصى 10 ملفات)
                </p>
              </div>

              {/* قائمة الملفات المرفقة */}
              {formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-white/90 font-arabic">
                    الملفات المرفقة ({formData.attachments.length}):
                  </p>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-white/70" />
                        <span className="text-white/90 text-sm font-arabic">
                          {file.name}
                        </span>
                        <span className="text-white/60 text-xs">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors font-arabic"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-medium transition-colors font-arabic"
              >
                تقديم الطلب
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};