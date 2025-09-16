import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, X, Plus, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccountingEntry {
  type: 'periodic_expense' | 'one_time_expense' | 'recurring_revenue' | 'one_time_revenue';
  amount: number;
  description: string;
  category: string;
  reference: string;
  date: string;
  notes: string;
  attachments?: File[];
  // للمصروفات فقط
  linkedBudgetId?: string;
  // للإيرادات المتكررة
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  startDate?: string;
  endDate?: string;
  // للإيرادات المنفردة
  clientName?: string;
  projectName?: string;
}

interface AccountingEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: AccountingEntry) => void;
}

export const AccountingEntryModal: React.FC<AccountingEntryModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AccountingEntry>({
    type: 'periodic_expense',
    amount: 0,
    description: '',
    category: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    attachments: []
  });

  const [dragActive, setDragActive] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  const entryTypes = [
    { value: 'periodic_expense', label: 'نفقات دورية' },
    { value: 'one_time_expense', label: 'نفقات منفردة' },
    { value: 'recurring_revenue', label: 'إيرادات دائمة' },
    { value: 'one_time_revenue', label: 'إيرادات منفردة' }
  ];

  const categories = [
    'المرتبات والأجور',
    'الإيجارات',
    'المواد والمستلزمات',
    'الخدمات',
    'التسويق والإعلان',
    'الصيانة',
    'المصاريف الإدارية',
    'المبيعات',
    'الاستشارات',
    'أخرى'
  ];

  // بيانات وهمية للميزانيات المعتمدة
  const approvedBudgets = [
    { id: '1', name: 'ميزانية التشغيل السنوية', amount: 500000, remaining: 350000 },
    { id: '2', name: 'ميزانية التسويق الربعية', amount: 100000, remaining: 75000 },
    { id: '3', name: 'ميزانية الموارد البشرية', amount: 200000, remaining: 180000 },
    { id: '4', name: 'ميزانية البحث والتطوير', amount: 150000, remaining: 120000 },
    { id: '5', name: 'ميزانية الصيانة والدعم', amount: 80000, remaining: 60000 }
  ];

  const frequencies = [
    { value: 'monthly', label: 'شهرياً' },
    { value: 'quarterly', label: 'ربع سنوي' },
    { value: 'yearly', label: 'سنوياً' }
  ];

  const isExpenseType = formData.type.includes('expense');
  const isRevenueType = formData.type.includes('revenue');
  const isRecurringType = formData.type.includes('recurring') || formData.type.includes('periodic');

  const handleInputChange = (field: keyof AccountingEntry, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (files: FileList) => {
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...newFiles]
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || !formData.category) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSave(formData);
    
    // Reset form
    setFormData({
      type: 'periodic_expense',
      amount: 0,
      description: '',
      category: '',
      reference: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      attachments: []
    });
    
    onClose();
  };

  const handleAIProcessFiles = async () => {
    if (!formData.attachments || formData.attachments.length === 0) {
      alert('يرجى رفع ملف فاتورة أولاً لمعالجته');
      return;
    }

    setIsProcessingAI(true);
    try {
      // محاكاة معالجة الذكاء الاصطناعي للملفات
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // بيانات وهمية مستخرجة من الفاتورة
      const extractedData = {
        amount: 2500,
        description: 'خدمات استشارية مالية',
        category: 'الاستشارات',
        reference: 'INV-2024-0156',
        date: '2024-01-15',
        notes: 'فاتورة مستخرجة تلقائياً بواسطة الذكاء الاصطناعي',
        frequency: formData.type === 'periodic_expense' ? 'monthly' as const : undefined
      };

      // تحديث البيانات المستخرجة
      setFormData(prev => ({
        ...prev,
        ...extractedData
      }));

      alert('تم استخراج البيانات بنجاح من الفاتورة المرفقة!');
    } catch (error) {
      alert('حدث خطأ أثناء معالجة الملفات');
    } finally {
      setIsProcessingAI(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] p-0 overflow-hidden font-arabic"
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-black font-arabic">
                إضافة قيد محاسبي
              </DialogTitle>
              <p className="text-sm text-black/70 font-arabic">
                إدخال قيد محاسبي جديد في النظام
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 left-4 rounded-full bg-transparent hover:bg-black/10 border border-black w-[32px] h-[32px] flex items-center justify-center transition z-10"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Entry Type */}
            <div>
              <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                نوع القيد *
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {entryTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={cn(
                      "px-4 py-3 rounded-3xl border text-sm font-medium font-arabic transition-all",
                      formData.type === type.value
                        ? "bg-black text-white border-black"
                        : "bg-white/30 text-black border-black/20 hover:border-black/40"
                    )}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                  المبلغ (ريال سعودي) *
                </Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black placeholder:text-black/50 font-arabic px-4 py-3"
                />
              </div>
              <div>
                <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                  الفئة *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                الوصف *
              </Label>
              <Input
                placeholder="وصف القيد المحاسبي"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black placeholder:text-black/50 font-arabic px-4 py-3"
              />
            </div>

            {/* ربط الميزانية - للمصروفات فقط */}
            {isExpenseType && (
              <div>
                <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                  ربط بميزانية معتمدة *
                </Label>
                <Select value={formData.linkedBudgetId || ''} onValueChange={(value) => handleInputChange('linkedBudgetId', value)}>
                  <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                    <SelectValue placeholder="اختر الميزانية المرتبطة" />
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
                    }}
                  >
                    {approvedBudgets.map((budget) => (
                      <SelectItem key={budget.id} value={budget.id}>
                        {budget.name} - متبقي: {budget.remaining.toLocaleString()} ريال
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* خانة التكرار للنفقات الدورية */}
            {isExpenseType && formData.type === 'periodic_expense' && (
                <div>
                  <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                    تكرار النفقة *
                  </Label>
                  <Select value={formData.frequency || ''} onValueChange={(value) => handleInputChange('frequency', value)}>
                    <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                      <SelectValue placeholder="اختر تكرار النفقة" />
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
                      }}
                    >
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
            )}

            {/* حقول خاصة بالإيرادات المتكررة */}
            {isRevenueType && isRecurringType && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                      التكرار *
                    </Label>
                    <Select value={formData.frequency || ''} onValueChange={(value) => handleInputChange('frequency', value)}>
                      <SelectTrigger className="w-full px-4 py-3 rounded-3xl bg-white/30 border border-black/20 focus:border-black text-black placeholder-black/50 text-right font-arabic transition-colors outline-none">
                        <SelectValue placeholder="اختر التكرار" />
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
                        }}
                      >
                        {frequencies.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                      تاريخ البداية *
                    </Label>
                    <Input
                      type="date"
                      value={formData.startDate || formData.date}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black font-arabic px-4 py-3"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                      تاريخ النهاية
                    </Label>
                    <Input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black font-arabic px-4 py-3"
                    />
                  </div>
                </div>
              </>
            )}

            {/* حقول خاصة بالإيرادات المنفردة */}
            {isRevenueType && !isRecurringType && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                    اسم العميل
                  </Label>
                  <Input
                    placeholder="اسم العميل أو الشركة"
                    value={formData.clientName || ''}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black placeholder:text-black/50 font-arabic px-4 py-3"
                  />
                </div>
                <div>
                  <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                    اسم المشروع
                  </Label>
                  <Input
                    placeholder="اسم المشروع المرتبط"
                    value={formData.projectName || ''}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black placeholder:text-black/50 font-arabic px-4 py-3"
                  />
                </div>
              </div>
            )}

            {/* Reference and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                  المرجع
                </Label>
                <Input
                  placeholder="رقم المرجع أو الفاتورة"
                  value={formData.reference}
                  onChange={(e) => handleInputChange('reference', e.target.value)}
                  className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black placeholder:text-black/50 font-arabic px-4 py-3"
                />
              </div>
              <div>
                <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                  التاريخ *
                </Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black font-arabic px-4 py-3"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                ملاحظات إضافية
              </Label>
              <Textarea
                placeholder="أي ملاحظات أو تفاصيل إضافية"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="bg-white/30 border-black/20 rounded-3xl focus:border-black text-black placeholder:text-black/50 font-arabic min-h-[100px]"
                rows={4}
              />
            </div>

            {/* File Upload */}
            <div>
              <Label className="text-sm font-bold text-black font-arabic mb-3 block">
                المرفقات
              </Label>
              
              {/* Drop Zone */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-3xl p-8 text-center transition-colors",
                  dragActive 
                    ? "border-black bg-black/5" 
                    : "border-black/20 hover:border-black/40"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-2">
                  <div className="w-12 h-12 text-black/50 mx-auto">
                    <Plus className="w-full h-full" />
                  </div>
                  <p className="text-lg font-bold text-black font-arabic">
                    اسحب الملفات هنا أو انقر للتحميل
                  </p>
                  <p className="text-sm text-black/70 font-arabic">
                    PDF, DOC, XLS, صور (حتى 10 ميجابايت)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-4 py-2 bg-black/10 hover:bg-black/20 rounded-2xl cursor-pointer text-sm font-medium text-black font-arabic"
                  >
                    اختيار الملفات
                  </label>
                </div>
              </div>

              {/* AI Processing Button */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={handleAIProcessFiles}
                    disabled={isProcessingAI}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-3xl text-white font-medium font-arabic"
                  >
                    {isProcessingAI ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        معالجة البيانات...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 ml-2" />
                        استخراج البيانات بالذكاء الاصطناعي
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* File List */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="space-y-3 mt-4">
                  {formData.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/30 rounded-2xl border border-black/10"
                    >
                      <FileText className="w-5 h-5 text-black/50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate font-arabic">
                          {file.name}
                        </p>
                        <p className="text-xs text-black/70 font-arabic">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => removeAttachment(index)}
                        className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-8 pb-8">
          <div className="flex gap-4 justify-start pt-6 border-t border-white/20">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-black hover:bg-black/90 rounded-full text-white font-medium font-arabic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              حفظ القيد
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/30 hover:bg-white/40 border border-black/20 rounded-full text-black font-medium font-arabic transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};