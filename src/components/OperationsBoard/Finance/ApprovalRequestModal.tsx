import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ApprovalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestSubmitted: (request: ApprovalRequestData) => void;
}

interface ApprovalRequestData {
  id: string;
  requestedAmount: number;
  justification: string;
  attachments: File[];
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
}

export const ApprovalRequestModal: React.FC<ApprovalRequestModalProps> = ({
  isOpen,
  onClose,
  onRequestSubmitted
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [requestData, setRequestData] = useState<ApprovalRequestData>({
    id: '',
    requestedAmount: 0,
    justification: '',
    attachments: [],
    requestDate: new Date().toISOString(),
    status: 'pending',
    requestedBy: 'مدير المشروع' // سيتم استبدالها بالمستخدم الحالي
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
    if (requestData.justification.trim().length < 20) {
      toast({
        title: "خطأ في التحقق",
        description: "مبررات الطلب يجب أن تكون أكثر تفصيلاً (20 حرف على الأقل)",
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
        id: Date.now().toString()
      };
      
      onRequestSubmitted(newRequest);
      toast({
        title: "تم إرسال طلب الموافقة بنجاح",
        description: `تم إرسال طلب موافقة على ميزانية ${requestData.requestedAmount} ريال إلى المدير المالي`
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
      id: '',
      requestedAmount: 0,
      justification: '',
      attachments: [],
      requestDate: new Date().toISOString(),
      status: 'pending',
      requestedBy: 'مدير المشروع'
    });
  };

  const handleClose = () => {
    if (requestData.requestedAmount > 0 || requestData.justification.trim()) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleInputChange('attachments', Array.from(e.target.files));
    }
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
            <p className="text-sm text-gray-600 text-right font-arabic mt-2">
              سيتم إرسال هذا الطلب إلى المدير المالي والأدمن للمراجعة والموافقة
            </p>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            {/* الميزانية المطلوبة */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                الميزانية المطلوبة (ريال) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={requestData.requestedAmount}
                onChange={(e) => handleInputChange('requestedAmount', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black placeholder-gray-500 text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="أدخل المبلغ المطلوب"
                dir="rtl"
              />
              <p className="text-xs text-gray-500 text-right font-arabic">
                سيتم إضافة هذا المبلغ إلى ميزانية المشروع في حالة الموافقة
              </p>
            </div>

            {/* مبررات الطلب */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                مبررات الطلب *
              </label>
              <textarea
                value={requestData.justification}
                onChange={(e) => handleInputChange('justification', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black placeholder-gray-500 text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="اشرح بالتفصيل سبب الحاجة لهذه الميزانية الإضافية وكيف سيتم استخدامها..."
                dir="rtl"
              />
              <div className="flex justify-between items-center text-xs text-gray-500 font-arabic">
                <span>الحد الأدنى: 20 حرف</span>
                <span className="text-right">{requestData.justification.length} حرف</span>
              </div>
            </div>

            {/* المرفقات */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                المرفقات
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                dir="rtl"
              />
              <p className="text-xs text-gray-500 text-right font-arabic">
                يمكنك إرفاق عروض أسعار، خطط العمل، أو أي مستندات داعمة
              </p>
              {requestData.attachments.length > 0 && (
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-sm text-gray-700 text-right font-arabic">
                    المرفقات المحددة:
                  </div>
                  {requestData.attachments.map((file, index) => (
                    <div key={index} className="text-xs text-gray-600 text-right font-arabic mt-1">
                      • {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* معلومات إضافية */}
            <div className="bg-blue-50/50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium text-blue-800 text-right font-arabic">
                معلومات مهمة:
              </h4>
              <ul className="text-xs text-blue-700 text-right font-arabic space-y-1">
                <li>• سيتم إرسال إشعار فوري للمدير المالي والأدمن</li>
                <li>• ستظهر حالة الطلب في تبويب الميزانيات</li>
                <li>• يمكن متابعة حالة الطلب من لوحة الإدارات المالية</li>
                <li>• في حالة الموافقة، ستتم إضافة المبلغ تلقائياً لميزانية المشروع</li>
              </ul>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 py-3 text-black border-black/30 hover:bg-black/5 font-arabic"
              >
                إلغاء
              </Button>
              <Button
                onClick={handleSubmitRequest}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-arabic"
              >
                إرسال الطلب
              </Button>
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
              هل أنت متأكد من إرسال طلب موافقة على ميزانية إضافية بمبلغ {requestData.requestedAmount} ريال؟
              سيتم إرسال إشعار فوري للمدير المالي والأدمن.
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

      {/* حوار تأكيد الإلغاء */}
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