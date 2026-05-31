import React, { useState } from 'react';
import { Link2, Copy, Check, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface InviteLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inviteUrl: string | null;
  isLoading: boolean;
  onCreateLink: () => Promise<unknown>;
  onDeactivateLink: () => Promise<void>;
}

export const InviteLinkDialog: React.FC<InviteLinkDialogProps> = ({
  isOpen,
  onClose,
  inviteUrl,
  isLoading,
  onCreateLink,
  onDeactivateLink,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!inviteUrl) return;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      toast.success('تم نسخ الرابط');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('فشل في نسخ الرابط');
    }
  };

  const handleCreateLink = async () => {
    await onCreateLink();
  };

  const handleDeactivate = async () => {
    await onDeactivateLink();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[360px] bg-white rounded-[18px] shadow-[0_12px_28px_rgba(0,0,0,0.15)] p-5"
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-bold text-sb-ink">دعوة مشاركين</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-sb-panel-bg transition-colors"
          >
            <X size={16} className="text-sb-ink-40" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {inviteUrl ? (
            <motion.div
              key="has-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="p-3 bg-sb-panel-bg rounded-xl">
                <p className="text-[11px] text-sb-ink-60 mb-2">رابط الدعوة المؤقت:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className="flex-1 px-3 py-2 text-[12px] bg-white border border-sb-border rounded-lg text-sb-ink-70 select-all"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-colors ${
                      copied 
                        ? 'bg-[#3DBE8B] text-white' 
                        : 'bg-sb-ink text-white hover:opacity-90'
                    }`}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#FFF4CC] rounded-xl">
                <p className="text-[11px] text-sb-ink-80 leading-relaxed">
                  <strong>ملاحظة:</strong> هذا الرابط صالح فقط خلال الجلسة الحالية. 
                  سيتم إلغاؤه تلقائياً عند إغلاق الجلسة.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCreateLink}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-[12px] font-medium text-sb-ink-60 bg-sb-panel-bg rounded-lg hover:bg-sb-ink-20 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin mx-auto" />
                  ) : (
                    'إنشاء رابط جديد'
                  )}
                </button>
                <button
                  onClick={handleDeactivate}
                  className="flex-1 px-4 py-2.5 text-[12px] font-medium text-[#E5564D] bg-[#FFE1E0] rounded-lg hover:bg-[#E5564D]/20 transition-colors"
                >
                  إلغاء الرابط
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="text-center py-6">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-sb-panel-bg flex items-center justify-center">
                  <Link2 size={24} className="text-sb-ink-40" />
                </div>
                <p className="text-[13px] text-sb-ink-70 mb-1">
                  أنشئ رابط دعوة مؤقت
                </p>
                <p className="text-[11px] text-sb-ink-40">
                  سيتمكن المدعوون من طلب الانضمام للجلسة
                </p>
              </div>

              <button
                onClick={handleCreateLink}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sb-ink text-white text-[13px] font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Link2 size={16} />
                    إنشاء رابط دعوة
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};
