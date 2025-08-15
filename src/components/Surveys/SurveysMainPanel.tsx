import React, { useState, useEffect } from 'react';
import { Search, Plus, BarChart3, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSurveys } from '@/hooks/useSurveys';

export const SurveysMainPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { surveys, loading, actions } = useSurveys();

  useEffect(() => {
    actions.fetchSurveys();
  }, []);

  const statusFilters = [
    { id: 'all', name: 'الكل', icon: BarChart3 },
    { id: 'DRAFT', name: 'مسودة', icon: Clock },
    { id: 'ACTIVE', name: 'نشط', icon: CheckCircle },
    { id: 'COMPLETED', name: 'مكتمل', icon: CheckCircle },
    { id: 'ARCHIVED', name: 'مؤرشف', icon: BarChart3 },
  ];

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || survey.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateSurvey = async () => {
    try {
      await actions.createSurvey({
        title: 'استطلاع جديد',
        createdBy: 'current-user'
      });
    } catch (error) {
      // Error handled silently
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'COMPLETED': return 'secondary';
      case 'DRAFT': return 'outline';
      case 'ARCHIVED': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'نشط';
      case 'COMPLETED': return 'مكتمل';
      case 'DRAFT': return 'مسودة';
      case 'ARCHIVED': return 'مؤرشف';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground font-arabic">جاري تحميل الاستطلاعات...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-arabic font-bold text-foreground">إدارة الاستطلاعات</h1>
          <p className="text-muted-foreground font-arabic">إنشاء وإدارة استطلاعات الرأي والتقييمات</p>
        </div>
        <Button onClick={handleCreateSurvey} className="font-arabic">
          <Plus className="w-4 h-4 ml-2" />
          إنشاء استطلاع
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الاستطلاعات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 font-arabic"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={selectedStatus === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(filter.id)}
                className="font-arabic"
              >
                <Icon className="w-4 h-4 ml-1" />
                {filter.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">إجمالي الاستطلاعات</p>
                <p className="text-2xl font-bold">{surveys.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">الاستطلاعات النشطة</p>
                <p className="text-2xl font-bold">{surveys.filter(s => s.status === 'ACTIVE').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">الاستطلاعات المكتملة</p>
                <p className="text-2xl font-bold">{surveys.filter(s => s.status === 'COMPLETED').length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">إجمالي الردود</p>
                <p className="text-2xl font-bold">
                  {surveys.reduce((sum, survey) => sum + (survey.responses?.length || 0), 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Surveys Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-arabic line-clamp-2">
                    {survey.title}
                  </CardTitle>
                  <Badge variant={getStatusVariant(survey.status)} className="font-arabic">
                    {getStatusLabel(survey.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-arabic line-clamp-3 mb-3">
                  {survey.description || 'لا يوجد وصف'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground font-arabic mb-3">
                  <span>{survey.questions?.length || 0} سؤال</span>
                  <span>{survey.responses?.length || 0} رد</span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground font-arabic">
                  <span>{survey.createdBy}</span>
                  <span>{new Date(survey.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>

                {survey.deadline && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs font-arabic">
                      ينتهي: {new Date(survey.deadline).toLocaleDateString('ar-SA')}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSurveys.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-arabic font-medium mb-2">لا توجد استطلاعات</h3>
            <p className="text-sm text-muted-foreground font-arabic text-center max-w-md">
              لم يتم العثور على أي استطلاعات تطابق معايير البحث. جرب إنشاء استطلاع جديد أو تعديل مصطلحات البحث.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};