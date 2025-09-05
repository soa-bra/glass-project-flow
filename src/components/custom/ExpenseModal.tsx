import React, { useState } from 'react';
import { X, CalendarIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: {
    category: string;
    amount: number;
    description: string;
    date: string;
  }) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    category: 'رواتب الفريق والمكافآت',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    'رواتب الفريق والمكافآت',
    'أدوات وبرمجيات متخصصة',
    'استشارات خارجية وخدمات',
    'مصاريف إدارية وأخرى'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0 && formData.description.trim()) {
      onSave(formData);
      setFormData({
        category: 'رواتب الفريق والمكافآت',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         style={{ 
           background: 'rgba(255,255,255,0.30)',
           backdropFilter: 'blur(18px)',
           WebkitBackdropFilter: 'blur(18px)' 
         }}>
      <div className="w-full max-w-4xl overflow-y-auto font-arabic"
           style={{
             background: 'rgba(255,255,255,0.3)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: '1px solid rgba(255,255,255,0.2)',
             borderRadius: '24px',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
             zIndex: 9999,
             transformOrigin: 'top center',
             position: 'fixed',
             top: '50%',
             left: '50%',
             transform: 'translate(-50%, -50%)',
             height: 'auto',
             maxHeight: '90vh'
           }}>
        <div className="flex justify-between items-center mb-6 p-6">
          <h2 className="text-xl font-bold text-black">إضافة مصروف جديد</h2>
          <button
            onClick={onClose}
            className="rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition justify-self-end"
          >
            <X size={16} className="text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              الفئة
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                <SelectValue placeholder="اختر الفئة" />
              </SelectTrigger>
              <SelectContent 
                className="z-[10000] text-[#0B0F12] font-arabic"
                style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            zIndex: 9999,
            transformOrigin: 'top center',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 'auto',
            maxHeight: '90vh',
                }}
              >
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              المبلغ (ر.س)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
              placeholder="أدخل المبلغ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              الوصف
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none"
              placeholder="وصف المصروف"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              التاريخ
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none justify-start text-left font-normal",
                    !formData.date && "text-black/50"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formData.date ? (
                    format(new Date(formData.date), "PPP", { locale: ar })
                  ) : (
                    <span>اختر التاريخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[10000]" align="start">
                <Calendar 
                  mode="single" 
                  selected={formData.date ? new Date(formData.date) : undefined} 
                  onSelect={(date) => setFormData({ ...formData, date: date ? format(date, 'yyyy-MM-dd') : '' })} 
                  initialFocus 
                  className="p-3 pointer-events-auto" 
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              حفظ المصروف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};