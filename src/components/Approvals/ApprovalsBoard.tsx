import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare, User } from 'lucide-react';
import { useApprovals } from '@/hooks/useApprovals';
import type { ApprovalRequest } from '@/types/approvals';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const ApprovalsBoard: React.FC = () => {
  const { requests, stats, loading, error, actions } = useApprovals();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      cancelled: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-gray-600' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status === 'pending' ? 'معلق' : 
         status === 'approved' ? 'موافق عليه' :
         status === 'rejected' ? 'مرفوض' : 'ملغي'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: { variant: 'destructive' as const, label: 'عاجل' },
      high: { variant: 'default' as const, label: 'عالي' },
      medium: { variant: 'outline' as const, label: 'متوسط' },
      low: { variant: 'secondary' as const, label: 'منخفض' }
    };
    
    const config = variants[priority as keyof typeof variants] || variants.medium;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleApprove = async (requestId: string) => {
    try {
      await actions.approveRequest(requestId, 'موافقة من اللوحة');
      toast({
        title: "تم الموافقة",
        description: "تم الموافقة على الطلب بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الموافقة على الطلب",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await actions.rejectRequest(requestId, 'رفض من اللوحة');
      toast({
        title: "تم الرفض",
        description: "تم رفض الطلب",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في رفض الطلب",
        variant: "destructive",
      });
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">معلقة</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">موافق عليها</p>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">مرفوضة</p>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">متأخرة</p>
                  <p className="text-2xl font-bold">{stats.overdue}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">طلباتي</p>
                  <p className="text-2xl font-bold">{stats.myPending}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Approval Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">طلبات الموافقة</CardTitle>
          <CardDescription className="text-right">
            إدارة ومراجعة طلبات الموافقة المختلفة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="pending">معلقة</TabsTrigger>
              <TabsTrigger value="approved">موافق عليها</TabsTrigger>
              <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد طلبات موافقة</p>
                  </div>
                ) : (
                  filteredRequests.map((request) => (
                    <ApprovalRequestCard
                      key={request.id}
                      request={request}
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface ApprovalRequestCardProps {
  request: ApprovalRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ApprovalRequestCard: React.FC<ApprovalRequestCardProps> = ({
  request,
  onApprove,
  onReject
}) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      cancelled: { variant: 'secondary' as const, icon: AlertTriangle, color: 'text-gray-600' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status === 'pending' ? 'معلق' : 
         status === 'approved' ? 'موافق عليه' :
         status === 'rejected' ? 'مرفوض' : 'ملغي'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: { variant: 'destructive' as const, label: 'عاجل' },
      high: { variant: 'default' as const, label: 'عالي' },
      medium: { variant: 'outline' as const, label: 'متوسط' },
      low: { variant: 'secondary' as const, label: 'منخفض' }
    };
    
    const config = variants[priority as keyof typeof variants] || variants.medium;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-right">
                {request.entityType === 'expense' ? 'طلب مصروف' :
                 request.entityType === 'project' ? 'طلب مشروع' :
                 request.entityType === 'contract' ? 'طلب عقد' :
                 request.entityType === 'hr' ? 'طلب موارد بشرية' :
                 request.entityType === 'legal' ? 'طلب قانوني' :
                 request.entityType === 'asset' ? 'طلب أصل' : 'طلب عام'}
              </h3>
              <div className="flex items-center gap-2">
                {getPriorityBadge(request.priority)}
                {getStatusBadge(request.status)}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground text-right">
              <p>رقم الطلب: {request.id}</p>
              <p>تاريخ الإنشاء: {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}</p>
              {request.data.description && (
                <p className="mt-1">الوصف: {request.data.description}</p>
              )}
              {request.data.amount && (
                <p className="mt-1 font-medium">المبلغ: {request.data.amount} ر.س</p>
              )}
            </div>
            
            <div className="text-sm">
              <span className="text-muted-foreground">الموافقات: </span>
              <span className="font-medium">
                {request.approvers.filter(a => a.action === 'approved').length} / {request.requiredApprovers}
              </span>
            </div>
          </div>
          
          {request.status === 'pending' && (
            <div className="flex gap-2 mr-4">
              <Button
                size="sm"
                onClick={() => onApprove(request.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 ml-1" />
                موافقة
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(request.id)}
              >
                <XCircle className="h-4 w-4 ml-1" />
                رفض
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalsBoard;