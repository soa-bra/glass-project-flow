import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Calendar, Clock, TrendingUp } from 'lucide-react';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { Input } from '@/components/ui/input';
import { BaseCard } from '@/components/ui/BaseCard';
import { InnerCard } from '@/components/ui/InnerCard';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { useHRLite } from '@/hooks/useHRLite';

export const HRLiteMainPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedView, setSelectedView] = useState<string>('employees');
  const { employees, timeEntries, loading, actions } = useHRLite();

  useEffect(() => {
    actions.fetchEmployees();
    actions.fetchTimeEntries();
  }, []);

  const viewOptions = [
    { id: 'employees', name: 'الموظفون', icon: Users },
    { id: 'attendance', name: 'الحضور', icon: Clock },
    { id: 'reports', name: 'التقارير', icon: TrendingUp },
    { id: 'calendar', name: 'التقويم', icon: Calendar },
  ];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleAddEmployee = async () => {
    try {
      await actions.createEmployee({
        name: 'موظف جديد',
        email: '',
        position: '',
        department: ''
      });
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const getTodayAttendance = () => {
    const today = new Date().toDateString();
    return timeEntries.filter(entry => 
      new Date(entry.date).toDateString() === today
    ).length;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'on_leave': return 'في إجازة';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground font-arabic">جاري تحميل بيانات الموارد البشرية...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-arabic font-bold text-foreground">الموارد البشرية المبسطة</h1>
          <p className="text-muted-foreground font-arabic">إدارة الموظفين والحضور والتقارير الأساسية</p>
        </div>
        <UnifiedButton onClick={handleAddEmployee} className="font-arabic">
          <Plus className="w-4 h-4 ml-2" />
          إضافة موظف
        </UnifiedButton>
      </div>

      {/* View Options */}
      <div className="flex gap-2 flex-wrap">
        {viewOptions.map((view) => {
          const Icon = view.icon;
          return (
            <UnifiedButton
              key={view.id}
              variant={selectedView === view.id ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedView(view.id)}
              className="font-arabic"
            >
              <Icon className="w-4 h-4 ml-1" />
              {view.name}
            </UnifiedButton>
          );
        })}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <BaseCard variant="unified" size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-arabic text-black/70">إجمالي الموظفين</p>
              <p className="text-2xl font-bold text-black">{employees.length}</p>
            </div>
            <Users className="h-8 w-8 text-black" />
          </div>
        </BaseCard>
        
        <BaseCard variant="unified" size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-arabic text-black/70">الموظفون النشطون</p>
              <p className="text-2xl font-bold text-black">{employees.filter(e => e.status === 'active').length}</p>
            </div>
            <Clock className="h-8 w-8 text-black" />
          </div>
        </BaseCard>

        <BaseCard variant="unified" size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-arabic text-black/70">حضور اليوم</p>
              <p className="text-2xl font-bold text-black">{getTodayAttendance()}</p>
            </div>
            <Calendar className="h-8 w-8 text-black" />
          </div>
        </BaseCard>

        <BaseCard variant="unified" size="sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-arabic text-black/70">الإجازات النشطة</p>
              <p className="text-2xl font-bold text-black">{employees.filter(e => e.status === 'on_leave').length}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-black" />
          </div>
        </BaseCard>
      </div>

      {/* Search */}
      {selectedView === 'employees' && (
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث عن موظف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 font-arabic"
          />
        </div>
      )}

      {/* Content based on selected view */}
      <div className="flex-1 overflow-auto">
        {selectedView === 'employees' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <BaseCard key={employee.id} variant="unified" className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-arabic font-bold text-black">
                        {employee.name}
                      </h3>
                      <p className="text-sm text-black/70 font-arabic">
                        {employee.position || 'غير محدد'}
                      </p>
                    </div>
                    <UnifiedBadge variant={getStatusVariant(employee.status)} className="font-arabic">
                      {getStatusLabel(employee.status)}
                    </UnifiedBadge>
                  </div>
                  
                  <InnerCard>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-black/70 font-arabic">القسم:</span>
                        <span className="font-arabic text-black">{employee.department || 'غير محدد'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-black/70 font-arabic">البريد الإلكتروني:</span>
                        <span className="font-arabic text-xs text-black">{employee.email || 'غير محدد'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-black/70 font-arabic">تاريخ الانضمام:</span>
                        <span className="font-arabic text-xs text-black">
                          {new Date(employee.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </InnerCard>
                </div>
              </BaseCard>
            ))}
          </div>
        )}

        {selectedView === 'attendance' && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-arabic font-medium mb-2">إدارة الحضور</h3>
            <p className="text-sm text-muted-foreground font-arabic">
              سيتم تطوير واجهة إدارة الحضور قريباً
            </p>
          </div>
        )}

        {selectedView === 'reports' && (
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-arabic font-medium mb-2">التقارير</h3>
            <p className="text-sm text-muted-foreground font-arabic">
              سيتم تطوير واجهة التقارير قريباً
            </p>
          </div>
        )}

        {selectedView === 'calendar' && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-arabic font-medium mb-2">التقويم</h3>
            <p className="text-sm text-muted-foreground font-arabic">
              سيتم تطوير واجهة التقويم قريباً
            </p>
          </div>
        )}

        {selectedView === 'employees' && filteredEmployees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-arabic font-medium mb-2">لا يوجد موظفون</h3>
            <p className="text-sm text-muted-foreground font-arabic text-center max-w-md">
              لم يتم العثور على أي موظفين يطابقون معايير البحث. جرب إضافة موظف جديد أو تعديل مصطلحات البحث.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};