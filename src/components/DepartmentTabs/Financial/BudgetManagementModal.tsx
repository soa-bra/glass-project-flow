import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, DollarSign, FileText, PieChart, User } from 'lucide-react';
import { BudgetTreeItem } from './types';

interface BudgetManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: BudgetTreeItem | null;
  onUpdate: (budgetId: number, data: any) => void;
}

export const BudgetManagementModal: React.FC<BudgetManagementModalProps> = ({
  isOpen,
  onClose,
  budget,
  onUpdate
}) => {
  const [reviewData, setReviewData] = useState({
    reviewer: '',
    reviewDate: '',
    status: 'pending',
    comments: '',
    approvedAmount: budget?.amount || 0
  });

  const [executionData, setExecutionData] = useState({
    manager: '',
    startDate: '',
    endDate: '',
    currentSpent: 0,
    remainingBudget: budget?.amount || 0,
    milestones: '',
    risks: ''
  });

  const [closureData, setClosureData] = useState({
    actualSpent: 0,
    variance: 0,
    efficiency: 0,
    lessons: '',
    recommendations: ''
  });

  const handleSubmit = () => {
    if (!budget) return;
    
    const updateData = {
      review: reviewData,
      execution: executionData,
      closure: closureData,
      lastUpdated: new Date().toISOString()
    };
    
    onUpdate(budget.id, updateData);
    onClose();
  };

  if (!budget) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/40 backdrop-blur-[20px] border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-black font-arabic text-center">
            إدارة الميزانية: {budget.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="review" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 rounded-2xl">
              <TabsTrigger value="review" className="flex items-center gap-2 font-arabic">
                <CheckCircle className="w-4 h-4" />
                المراجعة والموافقة
              </TabsTrigger>
              <TabsTrigger value="execution" className="flex items-center gap-2 font-arabic">
                <PieChart className="w-4 h-4" />
                المتابعة والتنفيذ
              </TabsTrigger>
              <TabsTrigger value="closure" className="flex items-center gap-2 font-arabic">
                <FileText className="w-4 h-4" />
                التوازن والإغلاق
              </TabsTrigger>
            </TabsList>

            {/* مرحلة المراجعة والموافقة */}
            <TabsContent value="review" className="space-y-6 mt-6">
              <div className="bg-white/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black font-arabic mb-4">مرحلة المراجعة والموافقة</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">المراجع المسؤول</Label>
                    <Input
                      value={reviewData.reviewer}
                      onChange={(e) => setReviewData(prev => ({ ...prev, reviewer: e.target.value }))}
                      placeholder="اسم المراجع"
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">تاريخ المراجعة</Label>
                    <Input
                      type="date"
                      value={reviewData.reviewDate}
                      onChange={(e) => setReviewData(prev => ({ ...prev, reviewDate: e.target.value }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">حالة الموافقة</Label>
                    <Select value={reviewData.status} onValueChange={(value) => setReviewData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="bg-white/40 border-white/30 text-black font-arabic">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد المراجعة</SelectItem>
                        <SelectItem value="approved">موافق عليها</SelectItem>
                        <SelectItem value="rejected">مرفوضة</SelectItem>
                        <SelectItem value="needs_revision">تحتاج تعديل</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">المبلغ المعتمد</Label>
                    <Input
                      type="number"
                      value={reviewData.approvedAmount}
                      onChange={(e) => setReviewData(prev => ({ ...prev, approvedAmount: Number(e.target.value) }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-black font-arabic">ملاحظات المراجعة</Label>
                  <Textarea
                    value={reviewData.comments}
                    onChange={(e) => setReviewData(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="أدخل ملاحظات المراجعة..."
                    className="bg-white/40 border-white/30 text-black font-arabic min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* مرحلة المتابعة والتنفيذ */}
            <TabsContent value="execution" className="space-y-6 mt-6">
              <div className="bg-white/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black font-arabic mb-4">مرحلة المتابعة والتنفيذ</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">مدير التنفيذ</Label>
                    <Input
                      value={executionData.manager}
                      onChange={(e) => setExecutionData(prev => ({ ...prev, manager: e.target.value }))}
                      placeholder="اسم مدير التنفيذ"
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">تاريخ البداية</Label>
                    <Input
                      type="date"
                      value={executionData.startDate}
                      onChange={(e) => setExecutionData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">تاريخ الانتهاء المتوقع</Label>
                    <Input
                      type="date"
                      value={executionData.endDate}
                      onChange={(e) => setExecutionData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">المبلغ المصروف حتى الآن</Label>
                    <Input
                      type="number"
                      value={executionData.currentSpent}
                      onChange={(e) => setExecutionData(prev => ({ ...prev, currentSpent: Number(e.target.value) }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-black font-arabic">المعالم الرئيسية</Label>
                  <Textarea
                    value={executionData.milestones}
                    onChange={(e) => setExecutionData(prev => ({ ...prev, milestones: e.target.value }))}
                    placeholder="أدخل المعالم الرئيسية للتنفيذ..."
                    className="bg-white/40 border-white/30 text-black font-arabic min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black font-arabic">المخاطر والتحديات</Label>
                  <Textarea
                    value={executionData.risks}
                    onChange={(e) => setExecutionData(prev => ({ ...prev, risks: e.target.value }))}
                    placeholder="أدخل المخاطر والتحديات المحتملة..."
                    className="bg-white/40 border-white/30 text-black font-arabic min-h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>

            {/* مرحلة التوازن والإغلاق */}
            <TabsContent value="closure" className="space-y-6 mt-6">
              <div className="bg-white/20 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-black font-arabic mb-4">مرحلة التوازن والإغلاق</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">المبلغ المصروف الفعلي</Label>
                    <Input
                      type="number"
                      value={closureData.actualSpent}
                      onChange={(e) => setClosureData(prev => ({ ...prev, actualSpent: Number(e.target.value) }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">الانحراف (%)</Label>
                    <Input
                      type="number"
                      value={closureData.variance}
                      onChange={(e) => setClosureData(prev => ({ ...prev, variance: Number(e.target.value) }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-black font-arabic">كفاءة التنفيذ (%)</Label>
                    <Input
                      type="number"
                      value={closureData.efficiency}
                      onChange={(e) => setClosureData(prev => ({ ...prev, efficiency: Number(e.target.value) }))}
                      className="bg-white/40 border-white/30 text-black font-arabic"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-black font-arabic">الدروس المستفادة</Label>
                  <Textarea
                    value={closureData.lessons}
                    onChange={(e) => setClosureData(prev => ({ ...prev, lessons: e.target.value }))}
                    placeholder="أدخل الدروس المستفادة من تنفيذ الميزانية..."
                    className="bg-white/40 border-white/30 text-black font-arabic min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-black font-arabic">التوصيات للمستقبل</Label>
                  <Textarea
                    value={closureData.recommendations}
                    onChange={(e) => setClosureData(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="أدخل التوصيات للمشاريع المستقبلية..."
                    className="bg-white/40 border-white/30 text-black font-arabic min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="font-arabic">
            إلغاء
          </Button>
          <Button onClick={handleSubmit} className="bg-black text-white hover:bg-black/90 font-arabic">
            حفظ التحديثات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};