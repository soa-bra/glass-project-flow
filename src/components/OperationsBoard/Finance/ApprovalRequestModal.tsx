import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (request: ApprovalRequestData) => void;
}

interface ApprovalRequestData {
  id: number;
  requestedAmount: number;
  justification: string;
  attachments: File[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
}

export const ApprovalRequestModal: React.FC<ApprovalRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [requestData, setRequestData] = useState<Omit<ApprovalRequestData, 'id' | 'submittedAt' | 'status' | 'submittedBy'>>({
    requestedAmount: 0,
    justification: '',
    attachments: []
  });

  const handleInputChange = (field: string, value: string | number | File[]) => {
    setRequestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (requestData.requestedAmount <= 0) {
      toast({
        title: "خطأ في التحقق",
        description: "الميزانية المطلوبة يجب أن تكون أكبر من صفر",
        variant: "destructive"
      });
      return false;
    }
    if (!requestData.justification.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "مبررات الطلب مطلوبة",
        variant: "destructive"
      });
      return false;
    }
    if (requestData.justification.trim().length < 50) {
      toast({
        title: "خطأ في التحقق",
        description: "مبررات الطلب يجب أن تكون أكثر تفصيلاً (50 حرف على الأقل)",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmitRequest = () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmSubmitRequest = () => {
    try {
      const newRequest: ApprovalRequestData = {
        ...requestData,
        id: Date.now(),
        submittedAt: new Date().toISOString(),
        status: 'pending',
        submittedBy: 'مدير المشروع' // في التطبيق الحقيقي، سيتم جلب هذا من نظام المصادقة
      };
      
      onRequestSubmitted(newRequest);
      toast({
        title: "تم إرسال الطلب بنجاح",
        description: `تم إرسال طلب الموافقة على ميزانية بقيمة ${requestData.requestedAmount.toLocaleString()} ريال`
      });
      
      resetForm();
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: "فشل إرسال الطلب",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setRequestData({
      requestedAmount: 0,
      justification: '',
      attachments: []
    });
  };

  const handleClose = () => {
    if (requestData.justification.trim() || requestData.requestedAmount > 0) {
      setShowCancelDialog(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const confirmClose = () => {
    resetForm();
    setShowCancelDialog(false);
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      handleInputChange('attachments', [...requestData.attachments, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = requestData.attachments.filter((_, i) => i !== index);
    handleInputChange('attachments', newAttachments);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 font-arabic" style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px'
        }}>
          <button 
            onClick={handleClose} 
            className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black/30 w-[32px] h-[32px] flex items-center justify-center transition z-10"
          >
            <X size={18} className="text-black" />
          </button>

          <DialogHeader className="px-8 pt-8 pb-4">
            <DialogTitle className="text-2xl font-bold text-right font-arabic">
              طلب موافقة على ميزانية إضافية
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            {/* الميزانية المطلوبة */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                الميزانية المطلوبة (ريال سعودي) *
              </label>
              <input
                type="number"
                value={requestData.requestedAmount || ''}
                onChange={(e) => handleInputChange('requestedAmount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 text-right font-arabic">
                أدخل المبلغ الإضافي المطلوب لإكمال المشروع
              </p>
            </div>

            {/* مبررات الطلب */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                مبررات الطلب *
              </label>
              <textarea
                value={requestData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                placeholder="اشرح بالتفصيل أسباب طلب الميزانية الإضافية، والغرض من استخدامها، وكيف ستساهم في نجاح المشروع..."
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm text-right font-arabic resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
              <div className="flex justify-between text-xs text-gray-500 font-arabic">
                <span>الحد الأدنى: 50 حرف</span>
                <span>{requestData.justification.length} / 500</span>
              </div>
            </div>

            {/* المرفقات */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                المرفقات الداعمة
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*,.xls,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="attachments-upload"
                  multiple
                />
                <label
                  htmlFor="attachments-upload"
                  className="w-full p-3 border border-dashed border-gray-300 rounded-lg bg-white/30 backdrop-blur-sm cursor-pointer hover:bg-white/40 transition-colors flex items-center justify-center gap-2 font-arabic"
                >
                  <Upload size={20} className="text-gray-500" />
                  <span className="text-gray-600">
                    اضغط لإضافة ملفات داعمة (اختياري)
                  </span>
                </label>
              </div>
              <p className="text-xs text-gray-500 text-right font-arabic">
                يمكنك إرفاق عروض أسعار، مخططات، أو أي وثائق داعمة للطلب
              </p>

              {/* قائمة المرفقات */}
              {requestData.attachments.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-right text-gray-700 font-arabic">
                    الملفات المرفقة:
                  </p>
                  {requestData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white/40 rounded-lg border border-gray-200">
                      <button
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-arabic"
                      >
                        حذف
                      </button>
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-sm text-gray-700 font-arabic">{file.name}</span>
                        <FileText size={16} className="text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ملاحظة هامة */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800 text-right font-arabic">
                <strong>ملاحظة:</strong> سيتم إرسال هذا الطلب إلى المدير المالي والإدارة العليا للمراجعة والموافقة. 
                قد تستغرق عملية المراجعة من 2-5 أيام عمل حسب قيمة المبلغ المطلوب.
              </p>
            </div>

            {/* أزرار الإرسال والإلغاء */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-arabic"
              >
                إلغاء
              </button>
              <button
                onClick={handleSubmitRequest}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-arabic"
              >
                إرسال الطلب
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* حوار تأكيد الإرسال */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد إرسال الطلب</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من إرسال طلب الموافقة على ميزانية إضافية بقيمة {requestData.requestedAmount.toLocaleString()} ريال؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSubmitRequest} className="font-arabic">
              تأكيد الإرسال
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من إلغاء طلب الموافقة؟ سيتم فقدان جميع البيانات المدخلة.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">العودة</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose} className="font-arabic">
              تأكيد الإلغاء
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};