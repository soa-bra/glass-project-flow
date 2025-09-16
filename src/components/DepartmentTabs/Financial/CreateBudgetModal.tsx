import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { 
  FileText, 
  X, 
  Calendar, 
  DollarSign, 
  BarChart3, 
  Sparkles, 
  Brain,
  Target,
  TrendingUp,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';
import { FormValidator, ValidationSchemas } from '@/utils/validation';
import { toast } from 'sonner';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetCreated?: (budgetData: any) => void;
}

interface BudgetItem {
  id: string;
  name: string;
  amount: string;
  percentage: string;
}

interface BudgetFormData {
  name: string;
  description: string;
  totalAmount: string;
  duration: string;
  startDate: string;
  endDate: string;
  budgetType: string;
  department: string;
  project: string;
  currency: string;
  items: BudgetItem[];
  aiGenerated: boolean;
}

const budgetTypes = [
  { value: 'project', label: 'ميزانية مشروع' },
  { value: 'department', label: 'ميزانية قسم' },
  { value: 'operation', label: 'ميزانية تشغيلية' },
  { value: 'investment', label: 'ميزانية استثمارية' },
  { value: 'marketing', label: 'ميزانية تسويقية' }
];

const departments = [
  { value: 'finance', label: 'الإدارة المالية' },
  { value: 'marketing', label: 'التسويق' },
  { value: 'operations', label: 'العمليات' },
  { value: 'hr', label: 'الموارد البشرية' },
  { value: 'it', label: 'تقنية المعلومات' }
];

const currencies = [
  { value: 'SAR', label: 'ريال سعودي' },
  { value: 'USD', label: 'دولار أمريكي' },
  { value: 'EUR', label: 'يورو' }
];

export const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
  isOpen,
  onClose,
  onBudgetCreated
}) => {
  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    description: '',
    totalAmount: '',
    duration: '',
    startDate: '',
    endDate: '',
    budgetType: '',
    department: '',
    project: '',
    currency: 'SAR',
    items: [],
    aiGenerated: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');

  const validateField = (field: string, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        error = FormValidator.validateField(ValidationSchemas.text, value) || '';
        break;
      case 'totalAmount':
        error = FormValidator.validateField(ValidationSchemas.currency, value) || '';
        break;
      case 'startDate':
      case 'endDate':
        error = FormValidator.validateField(ValidationSchemas.date, value) || '';
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const calculateItemPercentage = (amount: string) => {
    if (!formData.totalAmount || !amount) return '0';
    const percentage = (parseFloat(amount) / parseFloat(formData.totalAmount)) * 100;
    return percentage.toFixed(1);
  };

  const addBudgetItem = () => {
    if (!newItemName.trim() || !newItemAmount.trim()) {
      toast.error('يرجى إدخال اسم العنصر والمبلغ');
      return;
    }

    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName.trim(),
      amount: newItemAmount,
      percentage: calculateItemPercentage(newItemAmount)
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    setNewItemName('');
    setNewItemAmount('');
    toast.success('تم إضافة العنصر بنجاح');
  };

  const removeBudgetItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    toast.success('تم حذف العنصر بنجاح');
  };

  const generateAIBudget = async () => {
    if (!formData.budgetType || !formData.totalAmount) {
      toast.error('يرجى تحديد نوع الميزانية والمبلغ الإجمالي أولاً');
      return;
    }

    setIsGenerating(true);
    
    try {
      // محاكاة استدعاء API للذكاء الاصطناعي
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiGeneratedItems: BudgetItem[] = [
        { id: '1', name: 'التخطيط والتصميم', amount: (parseFloat(formData.totalAmount) * 0.2).toString(), percentage: '20.0' },
        { id: '2', name: 'التنفيذ والتطوير', amount: (parseFloat(formData.totalAmount) * 0.4).toString(), percentage: '40.0' },
        { id: '3', name: 'التسويق والترويج', amount: (parseFloat(formData.totalAmount) * 0.25).toString(), percentage: '25.0' },
        { id: '4', name: 'الإدارة والمتابعة', amount: (parseFloat(formData.totalAmount) * 0.15).toString(), percentage: '15.0' }
      ];

      setFormData(prev => ({
        ...prev,
        items: aiGeneratedItems,
        aiGenerated: true
      }));

      toast.success('تم توليد توزيع الميزانية بالذكاء الاصطناعي');
    } catch (error) {
      toast.error('حدث خطأ في توليد الميزانية');
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeBudget = async () => {
    if (!formData.items.length) {
      toast.error('يرجى إضافة عناصر الميزانية أولاً');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // محاكاة تحسين الميزانية
      const optimizedItems = formData.items.map(item => ({
        ...item,
        amount: (parseFloat(item.amount) * 0.95).toString(),
        percentage: calculateItemPercentage((parseFloat(item.amount) * 0.95).toString())
      }));

      setFormData(prev => ({
        ...prev,
        items: optimizedItems,
        totalAmount: (parseFloat(prev.totalAmount) * 0.95).toString()
      }));

      toast.success('تم تحسين توزيع الميزانية لزيادة الكفاءة بنسبة 5%');
    } catch (error) {
      toast.error('حدث خطأ في تحسين الميزانية');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    const isValid = [
      validateField('name', formData.name),
      validateField('totalAmount', formData.totalAmount),
      validateField('startDate', formData.startDate),
      validateField('endDate', formData.endDate)
    ].every(Boolean);

    if (!isValid) {
      toast.error('يرجى تصحيح الأخطاء في النموذج');
      return;
    }

    if (!formData.budgetType || !formData.department) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (formData.items.length === 0) {
      toast.error('يرجى إضافة عناصر الميزانية');
      return;
    }

    // محاكاة حفظ البيانات
    const budgetData = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    onBudgetCreated?.(budgetData);
    toast.success('تم إنشاء الميزانية بنجاح');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      totalAmount: '',
      duration: '',
      startDate: '',
      endDate: '',
      budgetType: '',
      department: '',
      project: '',
      currency: 'SAR',
      items: [],
      aiGenerated: false
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] p-0 bg-white/40 backdrop-blur-[20px] border border-white/20 rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.1)]"
        style={{ zIndex: 9999 }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-black font-arabic">
                إنشاء ميزانية جديدة
              </DialogTitle>
              <p className="text-sm text-black/70 font-arabic">إعداد وتخصيص ميزانية جديدة للمشاريع والأنشطة</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full bg-transparent hover:bg-black/5 border border-black w-8 h-8 flex items-center justify-center transition focus-visible:ring-2 focus-visible:ring-black/20 focus-visible:outline-none"
            aria-label="إغلاق"
          >
            <X className="text-black" size={18} />
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-bold text-black font-arabic">المعلومات الأساسية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">اسم الميزانية *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="أدخل اسم الميزانية"
                    className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black placeholder-black/50 font-arabic"
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">المبلغ الإجمالي *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black placeholder-black/50 font-arabic pr-12"
                    />
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black/50" />
                  </div>
                  {errors.totalAmount && <p className="text-xs text-red-500">{errors.totalAmount}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black font-arabic">الوصف</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="وصف موجز للميزانية والهدف منها"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black placeholder-black/50 font-arabic resize-none"
                />
              </div>
            </div>

            {/* Budget Settings */}
            <div className="space-y-4">
              <h3 className="font-bold text-black font-arabic">إعدادات الميزانية</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">نوع الميزانية *</label>
                  <Select value={formData.budgetType} onValueChange={(value) => handleInputChange('budgetType', value)}>
                    <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black font-arabic">
                      <SelectValue placeholder="اختر نوع الميزانية" />
                    </SelectTrigger>
                    <SelectContent 
                      className="text-[#0B0F12] font-arabic"
                      style={{
                        background: 'rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {budgetTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">القسم *</label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)}>
                    <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black font-arabic">
                      <SelectValue placeholder="اختر القسم" />
                    </SelectTrigger>
                    <SelectContent 
                      className="text-[#0B0F12] font-arabic"
                      style={{
                        background: 'rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {departments.map(dept => (
                        <SelectItem key={dept.value} value={dept.value}>{dept.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">العملة</label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black font-arabic">
                      <SelectValue placeholder="اختر العملة" />
                    </SelectTrigger>
                    <SelectContent 
                      className="text-[#0B0F12] font-arabic"
                      style={{
                        background: 'rgba(255,255,255,0.4)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '24px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      {currencies.map(currency => (
                        <SelectItem key={currency.value} value={currency.value}>{currency.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">تاريخ البداية *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black font-arabic"
                  />
                  {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-black font-arabic">تاريخ النهاية *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-white/30 border border-black/20 rounded-3xl focus:border-black focus:outline-none text-black font-arabic"
                  />
                  {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
                </div>
              </div>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <h3 className="font-bold text-black font-arabic flex items-center gap-2">
                <Brain className="w-5 h-5" />
                الذكاء الاصطناعي
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button
                  onClick={generateAIBudget}
                  disabled={isGenerating || !formData.budgetType || !formData.totalAmount}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full font-medium font-arabic flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGenerating ? 'جاري التوليد...' : 'توليد ميزانية ذكية'}
                </Button>

                <Button
                  onClick={optimizeBudget}
                  disabled={isGenerating || formData.items.length === 0}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-full font-medium font-arabic flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  {isGenerating ? 'جاري التحسين...' : 'تحسين الميزانية'}
                </Button>
              </div>

              {formData.aiGenerated && (
                <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-2xl border border-blue-200/50">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800 font-arabic">تم توليد هذه الميزانية باستخدام الذكاء الاصطناعي</span>
                </div>
              )}
            </div>

            {/* Budget Items */}
            <div className="space-y-4">
              <h3 className="font-bold text-black font-arabic">عناصر الميزانية</h3>
              
              {/* Add Item Form */}
              <div className="p-4 bg-white/20 rounded-3xl border border-black/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="اسم العنصر"
                    className="px-4 py-3 bg-white/30 border border-black/20 rounded-2xl focus:border-black focus:outline-none text-black placeholder-black/50 font-arabic"
                  />
                  <input
                    type="text"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    placeholder="المبلغ"
                    className="px-4 py-3 bg-white/30 border border-black/20 rounded-2xl focus:border-black focus:outline-none text-black placeholder-black/50 font-arabic"
                  />
                  <Button
                    onClick={addBudgetItem}
                    disabled={!newItemName.trim() || !newItemAmount.trim()}
                    className="px-4 py-3 bg-black/10 hover:bg-black/20 disabled:bg-black/5 disabled:cursor-not-allowed rounded-2xl text-sm font-medium font-arabic flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة عنصر
                  </Button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="space-y-3">
                  {formData.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-white/30 rounded-2xl border border-black/10">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-black font-arabic">{item.name}</h4>
                        <p className="text-xs text-black/70 font-arabic">{item.amount} {formData.currency} ({item.percentage}%)</p>
                      </div>
                      <Button
                        onClick={() => removeBudgetItem(item.id)}
                        size="icon"
                        variant="ghost"
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/20">
          <Button
            onClick={handleClose}
            className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic"
          >
            إلغاء
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic"
          >
            حفظ الميزانية
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};