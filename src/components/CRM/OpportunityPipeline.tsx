// CRM Opportunity Pipeline Component
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { opportunitiesAPI } from '@/api/crm/opportunities';
import { Opportunity, OpportunityStage } from '@/lib/prisma';
import { ArrowRight, Plus, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

const stageLabels: Record<OpportunityStage, string> = {
  LEAD: 'عملاء محتملون',
  QUALIFY: 'تأهيل',
  PROPOSAL: 'عرض مقدم',
  WON: 'تم الإغلاق',
  LOST: 'مرفوض'
};

const stageColors: Record<OpportunityStage, string> = {
  LEAD: 'bg-gray-100 text-gray-800',
  QUALIFY: 'bg-blue-100 text-blue-800',
  PROPOSAL: 'bg-orange-100 text-orange-800',
  WON: 'bg-green-100 text-green-800',
  LOST: 'bg-red-100 text-red-800'
};

interface OpportunityCardProps {
  opportunity: Opportunity;
  onMove: (id: string, stage: OpportunityStage) => void;
  onEdit: (opportunity: Opportunity) => void;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onMove, onEdit }) => {
  const getAvailableStages = (): OpportunityStage[] => {
    const transitions: Record<OpportunityStage, OpportunityStage[]> = {
      LEAD: ['QUALIFY'],
      QUALIFY: ['PROPOSAL', 'LOST'],
      PROPOSAL: ['WON', 'LOST'],
      WON: [],
      LOST: []
    };
    return transitions[opportunity.stage];
  };

  return (
    <Card className="mb-3 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-sm">{opportunity.account?.name || `عميل ${opportunity.accountId}`}</h4>
          <BaseBadge className={stageColors[opportunity.stage]}>
            {stageLabels[opportunity.stage]}
          </BaseBadge>
        </div>
        
        {opportunity.value && (
          <p className="text-lg font-bold text-black mb-2 font-arabic">
            {opportunity.value.toLocaleString('ar-SA')} ر.س
          </p>
        )}
        
        {opportunity.expectedClose && (
          <p className="text-xs text-muted-foreground mb-3">
            التاريخ المتوقع: {new Date(opportunity.expectedClose).toLocaleDateString('ar-SA')}
          </p>
        )}

        <div className="flex gap-2 flex-wrap">
          {getAvailableStages().map(stage => (
            <Button
              key={stage}
              size="sm"
              variant="outline"
              onClick={() => onMove(opportunity.id, stage)}
              className="text-xs"
            >
              نقل إلى {stageLabels[stage]}
              <ArrowRight className="w-3 h-3 mr-1" />
            </Button>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(opportunity)}
            className="text-xs"
          >
            تعديل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const OpportunityPipeline: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [pipelineStats, setPipelineStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

  const [newOpportunity, setNewOpportunity] = useState({
    accountId: '',
    value: '',
    expectedClose: '',
    accountName: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [oppsData, statsData] = await Promise.all([
        opportunitiesAPI.getOpportunities(),
        opportunitiesAPI.getPipelineStats()
      ]);
      setOpportunities(oppsData);
      setPipelineStats(statsData);
    } catch (error) {
      toast.error('فشل في تحميل بيانات المبيعات');
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleMoveOpportunity = async (id: string, stage: OpportunityStage) => {
    try {
      await opportunitiesAPI.moveOpportunity(id, stage);
      toast.success(`تم نقل الفرصة إلى ${stageLabels[stage]}`);
      loadData();
    } catch (error) {
      toast.error('فشل في نقل الفرصة');
      // Error handled silently
    }
  };

  const handleCreateOpportunity = async () => {
    try {
      // For demo purposes, we'll create the account automatically
      // In real implementation, this would be selected from existing accounts
      await opportunitiesAPI.createOpportunity({
        accountId: newOpportunity.accountId || 'demo-account',
        value: newOpportunity.value ? parseFloat(newOpportunity.value) : undefined,
        expectedClose: newOpportunity.expectedClose ? new Date(newOpportunity.expectedClose) : undefined
      });
      
      toast.success('تم إنشاء الفرصة بنجاح');
      setIsCreateModalOpen(false);
      setNewOpportunity({ accountId: '', value: '', expectedClose: '', accountName: '' });
      loadData();
    } catch (error) {
      toast.error('فشل في إنشاء الفرصة');
      // Error handled silently
    }
  };

  const groupedOpportunities = opportunities.reduce((acc, opp) => {
    if (!acc[opp.stage]) {
      acc[opp.stage] = [];
    }
    acc[opp.stage].push(opp);
    return acc;
  }, {} as Record<OpportunityStage, Opportunity[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-arabic">مسار المبيعات</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              فرصة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إنشاء فرصة جديدة</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="accountName">اسم العميل</Label>
                <Input
                  id="accountName"
                  value={newOpportunity.accountName}
                  onChange={(e) => setNewOpportunity(prev => ({ 
                    ...prev, 
                    accountName: e.target.value,
                    accountId: `account-${Date.now()}` // Generate demo ID
                  }))}
                  placeholder="أدخل اسم العميل"
                />
              </div>
              <div>
                <Label htmlFor="value">القيمة المتوقعة (ر.س)</Label>
                <Input
                  id="value"
                  type="number"
                  value={newOpportunity.value}
                  onChange={(e) => setNewOpportunity(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="expectedClose">التاريخ المتوقع للإغلاق</Label>
                <Input
                  id="expectedClose"
                  type="date"
                  value={newOpportunity.expectedClose}
                  onChange={(e) => setNewOpportunity(prev => ({ ...prev, expectedClose: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreateOpportunity} className="w-full">
                إنشاء الفرصة
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI Cards */}
      {pipelineStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">إجمالي المسار</p>
                  <p className="text-lg font-bold font-arabic">{pipelineStats.totalValue?.toLocaleString('ar-SA')} ر.س</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Target className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">معدل النجاح</p>
                  <p className="text-lg font-bold font-arabic">{pipelineStats.winRate?.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Users className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">العملاء المحتملون</p>
                  <p className="text-lg font-bold font-arabic">{pipelineStats.countByStage?.LEAD || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">عروض مقدمة</p>
                  <p className="text-lg font-bold font-arabic">{pipelineStats.countByStage?.PROPOSAL || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {(['LEAD', 'QUALIFY', 'PROPOSAL', 'WON', 'LOST'] as OpportunityStage[]).map(stage => (
          <div key={stage} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">{stageLabels[stage]}</h3>
              <BaseBadge variant="secondary" className="text-xs">
                {groupedOpportunities[stage]?.length || 0}
              </BaseBadge>
            </div>
            
            <div className="space-y-2 min-h-[200px] bg-muted/30 rounded-lg p-3">
              {groupedOpportunities[stage]?.map(opportunity => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onMove={handleMoveOpportunity}
                  onEdit={setEditingOpportunity}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};