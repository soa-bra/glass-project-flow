
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { AppDashboardGrid } from '@/components/shared/layout/AppDashboardGrid';
import { AppGridItem } from '@/components/shared/layout/AppGridItem';
import { DollarSign, AlertTriangle, PieChart } from 'lucide-react';
import { BaseBadge as UnifiedBadge } from '@/components/ui/BaseBadge';
import { BaseActionButton as UnifiedButton } from '@/components/shared/BaseActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const BudgetsTab: React.FC = () => {
  const [channelBudgets, setChannelBudgets] = useState([
    { channel: 'الإعلانات الرقمية', allocated: 200000, spent: 156000, remaining: 44000, status: 'on-track' },
    { channel: 'وسائل التواصل الاجتماعي', allocated: 150000, spent: 128000, remaining: 22000, status: 'warning' },
    { channel: 'الفعاليات والمؤتمرات', allocated: 100000, spent: 45000, remaining: 55000, status: 'under-utilized' },
    { channel: 'العلاقات العامة', allocated: 50000, spent: 13000, remaining: 37000, status: 'under-utilized' },
  ]);

  const [isRedistributeOpen, setIsRedistributeOpen] = useState(false);
  const [editBudgets, setEditBudgets] = useState<Record<string, string>>({});

  const budgetOverview = {
    totalBudget: channelBudgets.reduce((s, c) => s + c.allocated, 0),
    spent: channelBudgets.reduce((s, c) => s + c.spent, 0),
    remaining: channelBudgets.reduce((s, c) => s + c.remaining, 0),
    utilizationRate: Number(((channelBudgets.reduce((s, c) => s + c.spent, 0) / channelBudgets.reduce((s, c) => s + c.allocated, 0)) * 100).toFixed(1)),
  };

  const budgetAlerts = [
    { type: 'warning', message: 'وسائل التواصل الاجتماعي تقترب من حد الميزانية (85%)', severity: 'medium' },
    { type: 'info', message: 'فائض في ميزانية الفعاليات يمكن إعادة توزيعه', severity: 'low' },
    { type: 'success', message: 'الإعلانات الرقمية ضمن الحدود المستهدفة', severity: 'low' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track': return <UnifiedBadge variant="success" size="sm">ضمن الخطة</UnifiedBadge>;
      case 'warning': return <UnifiedBadge variant="error" size="sm">تحذير</UnifiedBadge>;
      case 'under-utilized': return <UnifiedBadge variant="warning" size="sm">غير مستغل</UnifiedBadge>;
      default: return <UnifiedBadge variant="default" size="sm">غير معروف</UnifiedBadge>;
    }
  };

  const openRedistribute = () => {
    const budgets: Record<string, string> = {};
    channelBudgets.forEach(c => { budgets[c.channel] = String(c.allocated); });
    setEditBudgets(budgets);
    setIsRedistributeOpen(true);
  };

  const handleSaveRedistribution = () => {
    setChannelBudgets(prev => prev.map(c => {
      const newAllocated = Number(editBudgets[c.channel]) || c.allocated;
      return { ...c, allocated: newAllocated, remaining: newAllocated - c.spent, status: c.spent / newAllocated > 0.85 ? 'warning' : c.spent / newAllocated < 0.5 ? 'under-utilized' : 'on-track' };
    }));
    setIsRedistributeOpen(false);
    toast.success('تم إعادة توزيع الميزانية بنجاح');
  };

  return (
    <div className="mb-6">
      <div className="mb-6">
        <BaseBox variant="operations">
          <div className="flex items-center gap-2 mb-6"><DollarSign className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">نظرة عامة على الميزانية</h3></div>
          <AppDashboardGrid columns={12}>
            <AppGridItem colSpan={3}><div className="text-center p-4 bg-[#a4e2f6] rounded-lg"><h4 className="text-2xl font-bold text-black mb-1">{budgetOverview.totalBudget.toLocaleString()} ر.س</h4><p className="text-sm text-black font-arabic">إجمالي الميزانية</p></div></AppGridItem>
            <AppGridItem colSpan={3}><div className="text-center p-4 bg-[#f1b5b9] rounded-lg"><h4 className="text-2xl font-bold text-black mb-1">{budgetOverview.spent.toLocaleString()} ر.س</h4><p className="text-sm text-black font-arabic">المنفق</p></div></AppGridItem>
            <AppGridItem colSpan={3}><div className="text-center p-4 bg-[#bdeed3] rounded-lg"><h4 className="text-2xl font-bold text-black mb-1">{budgetOverview.remaining.toLocaleString()} ر.س</h4><p className="text-sm text-black font-arabic">المتبقي</p></div></AppGridItem>
            <AppGridItem colSpan={3}><div className="text-center p-4 bg-[#d9d2fd] rounded-lg"><h4 className="text-2xl font-bold text-black mb-1">{budgetOverview.utilizationRate}%</h4><p className="text-sm text-black font-arabic">معدل الاستخدام</p></div></AppGridItem>
          </AppDashboardGrid>
        </BaseBox>
      </div>

      <div className="mb-6">
        <BaseBox variant="operations">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2"><PieChart className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">ميزانيات القنوات</h3></div>
            <UnifiedButton variant="primary" onClick={openRedistribute}>إعادة توزيع الميزانية</UnifiedButton>
          </div>
          <div className="space-y-4">
            {channelBudgets.map((channel, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3"><h4 className="font-medium font-arabic text-black">{channel.channel}</h4>{getStatusBadge(channel.status)}</div>
                  <div className="text-sm text-black">{((channel.spent / channel.allocated) * 100).toFixed(1)}% مستخدم</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><span className="text-black font-arabic">المخصص: </span><span className="font-bold text-black">{channel.allocated.toLocaleString()} ر.س</span></div>
                  <div><span className="text-black font-arabic">المنفق: </span><span className="font-bold text-black">{channel.spent.toLocaleString()} ر.س</span></div>
                  <div><span className="text-black font-arabic">المتبقي: </span><span className="font-bold text-black">{channel.remaining.toLocaleString()} ر.س</span></div>
                </div>
                <div className="mt-3"><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-black h-2 rounded-full" style={{ width: `${(channel.spent / channel.allocated) * 100}%` }}></div></div></div>
              </div>
            ))}
          </div>
        </BaseBox>
      </div>

      <div className="mb-6">
        <BaseBox variant="operations">
          <div className="flex items-center gap-2 mb-6"><AlertTriangle className="h-6 w-6 text-black" /><h3 className="text-xl font-bold text-black font-arabic">تنبيهات الميزانية</h3></div>
          <div className="space-y-3">
            {budgetAlerts.map((alert, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${alert.severity === 'medium' ? 'bg-[#fbe2aa] border-[#fbe2aa]' : alert.severity === 'low' ? 'bg-[#a4e2f6] border-[#a4e2f6]' : 'bg-[#bdeed3] border-[#bdeed3]'}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-arabic text-black">{alert.message}</p>
                  <UnifiedBadge variant={alert.severity === 'medium' ? 'error' : alert.severity === 'low' ? 'info' : 'success'} size="sm">{alert.type === 'warning' ? 'تحذير' : alert.type === 'info' ? 'معلومة' : 'نجح'}</UnifiedBadge>
                </div>
              </div>
            ))}
          </div>
        </BaseBox>
      </div>

      <Dialog open={isRedistributeOpen} onOpenChange={setIsRedistributeOpen}>
        <DialogContent className="max-w-lg bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl">
          <DialogHeader><DialogTitle className="text-xl font-bold text-black font-arabic text-center">إعادة توزيع الميزانية</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            {channelBudgets.map(ch => (
              <div key={ch.channel} className="space-y-1">
                <Label className="text-black font-arabic text-sm">{ch.channel}</Label>
                <div className="flex items-center gap-2">
                  <Input type="number" value={editBudgets[ch.channel] || ''} onChange={e => setEditBudgets(prev => ({ ...prev, [ch.channel]: e.target.value }))} className="rounded-xl" />
                  <span className="text-sm text-black/60 font-arabic whitespace-nowrap">ر.س</span>
                </div>
                <p className="text-[10px] text-black/40 font-arabic">المنفق حالياً: {ch.spent.toLocaleString()} ر.س</p>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <UnifiedButton variant="outline" onClick={() => setIsRedistributeOpen(false)}>إلغاء</UnifiedButton>
            <UnifiedButton variant="primary" onClick={handleSaveRedistribution}>حفظ التوزيع</UnifiedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
