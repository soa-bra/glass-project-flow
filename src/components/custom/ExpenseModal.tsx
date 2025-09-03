import React, { useState } from 'react';
import { X } from 'lucide-react';

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
      <div className="w-full max-w-md font-arabic transition-all duration-500 ease-out"
           style={{
             background: 'rgba(255,255,255,0.4)',
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             border: '1px solid rgba(255,255,255,0.2)',
             borderRadius: '24px',
             boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
             zIndex: 9999,
             padding: '2rem'
           }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">إضافة مصروف جديد</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X size={20} className="text-black" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              الفئة
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-full border border-black/10 bg-white/50 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/20"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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
              className="w-full px-4 py-3 rounded-full border border-black/10 bg-white/50 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/20"
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
              className="w-full px-4 py-3 rounded-full border border-black/10 bg-white/50 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/20"
              placeholder="وصف المصروف"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              التاريخ
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-3 rounded-full border border-black/10 bg-white/50 text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-black/20"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full border border-black/20 text-black hover:bg-black/5 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
            >
              حفظ المصروف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};