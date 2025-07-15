import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Upload, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: (expense: ExpenseData) => void;
}

interface ExpenseData {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  receipt?: File;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onExpenseAdded
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [expenseData, setExpenseData] = useState<Omit<ExpenseData, 'id'>>({
    category: '',
    description: '',
    amount: 0,
    date: '',
    receipt: undefined
  });

  const handleInputChange = (field: string, value: string | number | File) => {
    setExpenseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!expenseData.category.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "فئة المصروف مطلوبة",
        variant: "destructive"
      });
      return false;
    }
    if (!expenseData.description.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "وصف المصروف مطلوب",
        variant: "destructive"
      });
      return false;
    }
    if (expenseData.amount <= 0) {
      toast({
        title: "خطأ في التحقق",
        description: "مبلغ المصروف يجب أن يكون أكبر من صفر",
        variant: "destructive"
      });
      return false;
    }
    if (!expenseData.date) {
      toast({
        title: "خطأ في التحقق",
        description: "تاريخ المصروف مطلوب",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSaveExpense = () => {
    if (!validateForm()) return;
    setShowConfirmDialog(true);
  };

  const confirmSaveExpense = () => {
    try {
      const newExpense: ExpenseData = {
        ...expenseData,
        id: Date.now()
      };
      
      onExpenseAdded(newExpense);
      toast({
        title: "تم إضافة المصروف بنجاح",
        description: `تم إضافة مصروف بقيمة ${expenseData.amount} ريال`
      });
      
      resetForm();
      setShowConfirmDialog(false);
      onClose();
    } catch (error) {
      toast({
        title: "فشل إضافة المصروف",
        description: "حاول مرة أخرى",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setExpenseData({
      category: '',
      description: '',
      amount: 0,
      date: '',
      receipt: undefined
    });
  };

  const handleClose = () => {
    if (expenseData.description.trim() || expenseData.amount > 0) {
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
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('receipt', file);
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
              إضافة مصروف جديد
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            {/* فئة المصروف */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                فئة المصروف *
              </label>
              <select
                value={expenseData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              >
                <option value="">اختر فئة المصروف</option>
                <option value="مواد خام">مواد خام</option>
                <option value="معدات">معدات</option>
                <option value="خدمات">خدمات</option>
                <option value="نقل ولوجستيات">نقل ولوجستيات</option>
                <option value="تسويق وإعلان">تسويق وإعلان</option>
                <option value="استشارات">استشارات</option>
                <option value="مصاريف إدارية">مصاريف إدارية</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* وصف المصروف */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                وصف المصروف *
              </label>
              <textarea
                value={expenseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="أدخل وصف تفصيلي للمصروف..."
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm text-right font-arabic resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>

            {/* المبلغ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                المبلغ (ريال سعودي) *
              </label>
              <input
                type="number"
                value={expenseData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
                min="0"
                step="0.01"
              />
            </div>

            {/* التاريخ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                تاريخ المصروف *
              </label>
              <input
                type="date"
                value={expenseData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500"
                dir="rtl"
              />
            </div>

            {/* رفع الإيصال */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-right text-gray-700 font-arabic">
                إيصال المصروف (اختياري)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <label
                  htmlFor="receipt-upload"
                  className="w-full p-3 border border-dashed border-gray-300 rounded-lg bg-white/30 backdrop-blur-sm cursor-pointer hover:bg-white/40 transition-colors flex items-center justify-center gap-2 font-arabic"
                >
                  <Upload size={20} className="text-gray-500" />
                  <span className="text-gray-600">
                    {expenseData.receipt ? expenseData.receipt.name : 'اضغط لرفع الإيصال'}
                  </span>
                </label>
              </div>
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-arabic"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveExpense}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-arabic"
              >
                حفظ المصروف
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* حوار تأكيد الحفظ */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الحفظ</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من إضافة هذا المصروف بقيمة {expenseData.amount} ريال؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveExpense} className="font-arabic">
              تأكيد الحفظ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="font-arabic" dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">تأكيد الإلغاء</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من إلغاء إضافة المصروف؟ سيتم فقدان جميع البيانات المدخلة.
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