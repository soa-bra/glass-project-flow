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
  return <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                   style={{ 
                     background: 'rgba(255,255,255,0.30)',
                     backdropFilter: 'blur(18px)',
                     WebkitBackdropFilter: 'blur(18px)' 
                   }}>
      <div className="max-w-4xl p-0 overflow-hidden font-arabic transition-all duration-500 ease-out max-h-[90vh] overflow-y-auto"
           style={{
             background: 'rgba(255,255,255,0.4)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: '1px solid rgba(255,255,255,0.2)',
             borderRadius: '24px',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
             zIndex: 9999
           }}>
        <div className="flex items-center justify-between mb-6 p-6">
          <h2 className="text-xl font-bold text-black">طلب موافقة على تعديل ميزانية المشروع</h2>
          <button onClick={handleClose} className="rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition justify-self-end">
            <X size={16} className="text-black" />
          </button>
        </div>

        <div className="space-y-6 px-6">
          {/* الميزانية المطلوبة */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              <DollarSign size={16} className="inline mr-2" />
              الميزانية المطلوبة *
            </label>
            <input type="number" value={requiredBudget} onChange={e => setRequiredBudget(e.target.value)} placeholder="أدخل المبلغ بالريال السعودي" className={`w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none ${errors.requiredBudget ? 'border-red-500' : 'border-black/20'}`} />
            {errors.requiredBudget && <p className="text-red-500 text-xs mt-1">{errors.requiredBudget}</p>}
          </div>

          {/* مبررات الطلب */}
          <div>
            <label className="block text-sm font-bold text-black mb-2">
              <FileText size={16} className="inline mr-2" />
              مبررات الطلب *
            </label>
            <textarea value={justification} onChange={e => setJustification(e.target.value)} placeholder="اكتب مبررات طلب الميزانية الإضافية..." rows={4} className={`w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none resize-none ${errors.justification ? 'border-red-500' : 'border-black/20'}`} />
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
        <div className="flex gap-3 mt-8 p-6">
          <button onClick={handleClose} className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors">
            إلغاء
          </button>
          <button onClick={handleSave} className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            إرسال الطلب
          </button>
        </div>
      </div>
    </div>;
};