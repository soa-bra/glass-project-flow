import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ExpenseData {
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseData) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ExpenseData>({
    description: '',
    amount: 0,
    category: 'تشغيلية',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const categories = [
    'تشغيلية',
    'مواد وأدوات',
    'استشارات',
    'سفر وانتقالات',
    'تسويق وإعلان',
    'رواتب وأجور',
    'أخرى'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.amount > 0) {
      onSave(formData);
      setFormData({
        description: '',
        amount: 0,
        category: 'تشغيلية',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      onClose();
    }
  };

  const handleInputChange = (field: keyof ExpenseData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 rounded-full bg-transparent hover:bg-black/5 border border-black w-8 h-8 flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none z-10"
            aria-label="إغلاق"
          >
            <X className="text-black" size={18} />
          </button>
          
          <DialogHeader className="text-center pb-6">
            <DialogTitle className="text-xl font-bold text-white font-arabic">
              إضافة مصروف جديد
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* وصف المصروف */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                وصف المصروف *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-arabic"
                placeholder="أدخل وصف المصروف"
                required
                dir="rtl"
              />
            </div>

            {/* المبلغ */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                المبلغ (ر.س) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.amount || ''}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 font-arabic"
                placeholder="0.00"
                required
                dir="rtl"
              />
            </div>

            {/* الفئة */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                فئة المصروف *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 font-arabic"
                required
                dir="rtl"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800 text-white">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* التاريخ */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                تاريخ المصروف *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 font-arabic"
                required
                dir="rtl"
              />
            </div>

            {/* ملاحظات */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2 font-arabic">
                ملاحظات إضافية
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none font-arabic"
                placeholder="أضف أي ملاحظات إضافية..."
                dir="rtl"
              />
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
                حفظ المصروف
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};