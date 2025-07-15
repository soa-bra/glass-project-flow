import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExpenseAdded: (expense: ExpenseData) => void;
}

interface ExpenseData {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  attachments: File[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  onExpenseAdded
}) => {
  const { toast } = useToast();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    id: '',
    title: '',
    amount: 0,
    category: 'operations',
    description: '',
    date: new Date().toISOString().split('T')[0],
    attachments: []
  });

  const categories = [
    { value: 'operations', label: 'تشغيلية' },
    { value: 'marketing', label: 'تسويقية' },
    { value: 'development', label: 'تطويرية' },
    { value: 'administrative', label: 'إدارية' },
    { value: 'other', label: 'أخرى' }
  ];

  const handleInputChange = (field: string, value: string | number | File[]) => {
    setExpenseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!expenseData.title.trim()) {
      toast({
        title: "خطأ في التحقق",
        description: "عنوان المصروف مطلوب",
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
        id: Date.now().toString()
      };
      
      onExpenseAdded(newExpense);
      toast({
        title: "تم إضافة المصروف بنجاح",
        description: `تم إضافة مصروف "${expenseData.title}" بقيمة ${expenseData.amount} ريال`
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
      id: '',
      title: '',
      amount: 0,
      category: 'operations',
      description: '',
      date: new Date().toISOString().split('T')[0],
      attachments: []
    });
  };

  const handleClose = () => {
    if (expenseData.title.trim() || expenseData.amount > 0) {
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
              إضافة مصروف جديد
            </DialogTitle>
          </DialogHeader>

          <div className="px-8 pb-8 space-y-6">
            {/* عنوان المصروف */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                عنوان المصروف *
              </label>
              <input
                type="text"
                value={expenseData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black placeholder-gray-500 text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="أدخل عنوان المصروف"
                dir="rtl"
              />
            </div>

            {/* المبلغ والفئة */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-black text-right font-arabic">
                  المبلغ (ريال) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={expenseData.amount}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black placeholder-gray-500 text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="0.00"
                  dir="rtl"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black text-right font-arabic">
                  الفئة
                </label>
                <select
                  value={expenseData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  dir="rtl"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* التاريخ */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                تاريخ المصروف
              </label>
              <input
                type="date"
                value={expenseData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                dir="rtl"
              />
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                الوصف
              </label>
              <textarea
                value={expenseData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black placeholder-gray-500 text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                placeholder="تفاصيل إضافية حول المصروف..."
                dir="rtl"
              />
            </div>

            {/* المرفقات */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black text-right font-arabic">
                المرفقات
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-black text-right font-arabic focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                dir="rtl"
              />
              {expenseData.attachments.length > 0 && (
                <div className="text-sm text-gray-600 text-right font-arabic">
                  تم اختيار {expenseData.attachments.length} ملف
                </div>
              )}
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
                onClick={handleSaveExpense}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-arabic"
              >
                حفظ المصروف
              </Button>
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
              هل أنت متأكد من إضافة هذا المصروف بمبلغ {expenseData.amount} ريال؟
              سيتم خصم هذا المبلغ من ميزانية المشروع.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="font-arabic">إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveExpense} className="font-arabic">
              تأكيد الإضافة
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