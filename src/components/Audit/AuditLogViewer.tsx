import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Eye
} from 'lucide-react';
import { useAudit } from '@/hooks/useAudit';
import type { AuditEventType, AuditQuery } from '@/types/audit';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const AuditLogViewer: React.FC = () => {
  const { events, stats, loading, error, actions } = useAudit();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('events');

  const eventTypeOptions = [
    { value: 'all', label: 'جميع الأحداث' },
    { value: 'user.created', label: 'إنشاء مستخدم' },
    { value: 'user.updated', label: 'تحديث مستخدم' },
    { value: 'user.deleted', label: 'حذف مستخدم' },
    { value: 'project.created', label: 'إنشاء مشروع' },
    { value: 'project.updated', label: 'تحديث مشروع' },
    { value: 'project.deleted', label: 'حذف مشروع' },
    { value: 'task.created', label: 'إنشاء مهمة' },
    { value: 'task.updated', label: 'تحديث مهمة' },
    { value: 'task.deleted', label: 'حذف مهمة' },
    { value: 'approval.created', label: 'طلب موافقة' },
    { value: 'approval.approved', label: 'موافقة' },
    { value: 'approval.rejected', label: 'رفض' },
    { value: 'auth.login', label: 'تسجيل دخول' },
    { value: 'auth.logout', label: 'تسجيل خروج' },
    { value: 'auth.failed', label: 'فشل المصادقة' },
    { value: 'system.error', label: 'خطأ نظام' },
    { value: 'system.warning', label: 'تحذير نظام' },
    { value: 'system.info', label: 'معلومات نظام' }
  ];

  const entityTypeOptions = [
    { value: 'all', label: 'جميع الكيانات' },
    { value: 'user', label: 'المستخدمين' },
    { value: 'project', label: 'المشاريع' },
    { value: 'task', label: 'المهام' },
    { value: 'approval', label: 'الموافقات' },
    { value: 'file', label: 'الملفات' },
    { value: 'system', label: 'النظام' }
  ];

  const handleSearch = () => {
    const query: AuditQuery = {};
    
    if (selectedEventType !== 'all') {
      query.eventTypes = [selectedEventType as AuditEventType];
    }
    
    if (selectedEntity !== 'all') {
      query.entityType = selectedEntity;
    }
    
    actions.fetchEvents(query);
  };

  const handleRefresh = () => {
    actions.refresh();
  };

  const getEventIcon = (eventType: string) => {
    if (eventType.includes('error')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (eventType.includes('warning')) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (eventType.includes('created')) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (eventType.includes('updated')) return <Info className="h-4 w-4 text-blue-500" />;
    if (eventType.includes('deleted')) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (eventType.includes('login')) return <User className="h-4 w-4 text-green-500" />;
    if (eventType.includes('logout')) return <User className="h-4 w-4 text-gray-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getEventTypeLabel = (eventType: string) => {
    const option = eventTypeOptions.find(opt => opt.value === eventType);
    return option?.label || eventType;
  };

  const getEventSeverity = (eventType: string) => {
    if (eventType.includes('error')) return 'destructive';
    if (eventType.includes('warning')) return 'outline';
    if (eventType.includes('created') || eventType.includes('login')) return 'default';
    return 'secondary';
  };

  const filteredEvents = events.filter(event => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        event.entityId.toLowerCase().includes(searchLower) ||
        event.eventType.toLowerCase().includes(searchLower) ||
        (event.userId && event.userId.toLowerCase().includes(searchLower))
      );
    }
    return true;
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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الأحداث</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">أحداث حديثة</p>
                  <p className="text-2xl font-bold">{stats.recentEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">أحداث فاشلة</p>
                  <p className="text-2xl font-bold">{stats.failedEvents}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">مستخدمين نشطين</p>
                  <p className="text-2xl font-bold">{stats.topUsers.length}</p>
                </div>
                <User className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">سجل التدقيق</CardTitle>
          <CardDescription className="text-right">
            عرض وتتبع جميع الأحداث والتفاعلات في النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="events">الأحداث</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
              <TabsTrigger value="exports">التصدير</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="mt-6 space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="البحث في الأحداث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-right"
                  />
                </div>
                
                <Select value={selectedEventType} onValueChange={setSelectedEventType}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="نوع الحدث" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="نوع الكيان" />
                  </SelectTrigger>
                  <SelectContent>
                    {entityTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button onClick={handleSearch} className="w-full md:w-auto">
                  <Search className="h-4 w-4 ml-1" />
                  بحث
                </Button>
                
                <Button variant="outline" onClick={handleRefresh} className="w-full md:w-auto">
                  <RefreshCw className="h-4 w-4 ml-1" />
                  تحديث
                </Button>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                {filteredEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">لا توجد أحداث تدقيق</p>
                  </div>
                ) : (
                  filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              {getEventIcon(event.eventType)}
                              <span className="font-medium text-right">
                                {getEventTypeLabel(event.eventType)}
                              </span>
                              <Badge variant={getEventSeverity(event.eventType) as any}>
                                {event.entityType}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground text-right">
                              <p>معرف الكيان: {event.entityId}</p>
                              {event.userId && <p>المستخدم: {event.userId}</p>}
                              <p>التوقيت: {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ar })}</p>
                              {event.ipAddress && <p>عنوان IP: {event.ipAddress}</p>}
                            </div>
                            
                            {event.changes && Object.keys(event.changes).length > 0 && (
                              <div className="text-sm">
                                <p className="font-medium text-right mb-1">التغييرات:</p>
                                <div className="bg-muted p-2 rounded text-right">
                                  {Object.entries(event.changes).map(([key, value]) => (
                                    <div key={key} className="text-xs">
                                      <span className="font-medium">{key}:</span> {JSON.stringify(value)}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                              <div className="text-sm">
                                <p className="font-medium text-right mb-1">بيانات إضافية:</p>
                                <div className="bg-muted p-2 rounded text-right text-xs">
                                  {JSON.stringify(event.metadata, null, 2)}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Types Distribution */}
                {stats && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">توزيع أنواع الأحداث</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(stats.eventsByType).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="text-sm text-right">{getEventTypeLabel(type)}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{count}</Badge>
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ 
                                    width: `${(count / Math.max(...Object.values(stats.eventsByType))) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Top Users */}
                {stats && stats.topUsers.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">أكثر المستخدمين نشاطاً</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stats.topUsers.slice(0, 10).map((user, index) => (
                          <div key={user.userId} className="flex items-center justify-between">
                            <span className="text-sm text-right">{user.userId}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{user.count}</Badge>
                              <span className="text-xs text-muted-foreground">#{index + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="exports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">تصدير البيانات</CardTitle>
                  <CardDescription className="text-right">
                    تصدير سجلات التدقيق والتقارير
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="w-full">
                      <Download className="h-4 w-4 ml-1" />
                      تصدير CSV
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 ml-1" />
                      تصدير JSON
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 ml-1" />
                      تقرير PDF
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground text-right">
                    <p>• CSV: جدول بيانات للتحليل في Excel</p>
                    <p>• JSON: بيانات منظمة للمطورين</p>
                    <p>• PDF: تقرير شامل للطباعة</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogViewer;