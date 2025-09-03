import React, { useState } from 'react';
import { X, Upload, DollarSign, FileText } from 'lucide-react';
interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (request: {
    requiredBudget: number;
    justification: string;
    attachments: File[];
  }) => void;
}
export const ApprovalRequestModal: React.FC<ApprovalRequestModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [requiredBudget, setRequiredBudget] = useState<string>('');
  const [justification, setJustification] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    [key: string]: string;
  }>({});
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };
  const validateForm = () => {
    const newErrors: {
      [key: string]: string;
    } = {};
    if (!requiredBudget || parseFloat(requiredBudget) <= 0) {
      newErrors.requiredBudget = 'الميزانية المطلوبة إلزامية ويجب أن تكون أكبر من صفر';
    }
    if (!justification.trim()) {
      newErrors.justification = 'مبررات الطلب إلزامية';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = () => {
    if (validateForm()) {
      onSave({
        requiredBudget: parseFloat(requiredBudget),
        justification: justification.trim(),
        attachments
      });

      // Reset form
      setRequiredBudget('');
      setJustification('');
      setAttachments([]);
      setErrors({});
      onClose();
    }
  };
  const handleClose = () => {
    setRequiredBudget('');
    setJustification('');
    setAttachments([]);
    setErrors({});
    onClose();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-black/10 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black">طلب موافقة على تعديل ميزانية المشروع</h2>
          <button onClick={handleClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} className="text-black" />
          </button>
        </div>

        <div className="space-y-6">
          {/* الميزانية المطلوبة */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              <DollarSign size={16} className="inline mr-2" />
              الميزانية المطلوبة *
            </label>
            <input type="number" value={requiredBudget} onChange={e => setRequiredBudget(e.target.value)} placeholder="أدخل المبلغ بالريال السعودي" className={`w-full px-4 py-3 bg-transparent border rounded-full text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/20 ${errors.requiredBudget ? 'border-red-500' : 'border-black/20'}`} />
            {errors.requiredBudget && <p className="text-red-500 text-xs mt-1">{errors.requiredBudget}</p>}
          </div>

          {/* مبررات الطلب */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              <FileText size={16} className="inline mr-2" />
              مبررات الطلب *
            </label>
            <textarea value={justification} onChange={e => setJustification(e.target.value)} placeholder="اكتب مبررات طلب الميزانية الإضافية..." rows={4} className={`w-full px-4 py-3 bg-transparent border rounded-2xl text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-black/20 resize-none ${errors.justification ? 'border-red-500' : 'border-black/20'}`} />
            {errors.justification && <p className="text-red-500 text-xs mt-1">{errors.justification}</p>}
          </div>

          {/* المرفقات */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              <Upload size={16} className="inline mr-2" />
              المرفقات (اختياري)
            </label>
            <div className="border border-dashed border-black/20 rounded-2xl p-4 text-center">
              <input type="file" multiple onChange={handleFileChange} className="hidden" id="file-upload" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={24} className="mx-auto mb-2 text-black/50" />
                <p className="text-sm text-black/70">انقر لرفع الملفات</p>
                <p className="text-xs text-black/50 mt-1">PDF, DOC, PNG, JPG</p>
              </label>
            </div>
            {attachments.length > 0 && <div className="mt-2 space-y-1">
                {attachments.map((file, index) => <div key={index} className="text-xs text-black/70 bg-black/5 px-2 py-1 rounded-full">
                    {file.name}
                  </div>)}
              </div>}
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3 mt-8">
          <button onClick={handleClose} className="flex-1 px-4 py-3 bg-transparent border border-black/20 text-black rounded-full text-sm hover:bg-black/5 transition-colors">
            إلغاء
          </button>
          <button onClick={handleSave} className="flex-1 px-4 py-3 bg-black text-white rounded-full text-sm hover:bg-black/80 transition-colors">
            إرسال الطلب
          </button>
        </div>
      </div>
    </div>;
};