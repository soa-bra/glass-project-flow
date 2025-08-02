
import React, { useState } from 'react';
import { InnerCard } from '@/components/ui/InnerCard';
import { Clock, Calendar, Users, TrendingUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { mockAttendanceRecords, mockLeaveRequests, mockEmployees } from './data';
import { getHRStatusColor, getHRStatusText } from './utils';

export const AttendanceTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'attendance' | 'leaves'>('attendance');

  const attendanceStats = {
    presentToday: 142,
    absentToday: 6,
    lateToday: 8,
    averageWorkHours: 8.2,
    attendanceRate: 94.2,
    pendingLeaveRequests: 5
  };

  const getAttendanceStatusBadge = (status: string) => {
    const text = getHRStatusText(status);
    
    let variant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    switch (status.toLowerCase()) {
      case 'present':
      case 'approved':
      case 'completed':
        variant = 'success';
        break;
      case 'late':
      case 'pending':
        variant = 'warning';
        break;
      case 'absent':
      case 'rejected':
        variant = 'error';
        break;
      case 'review':
      case 'scheduled':
        variant = 'info';
        break;
      default:
        variant = 'default';
    }
    
    return (
      <UnifiedBadge variant={variant} size="sm">
        {text}
      </UnifiedBadge>
    );
  };

  const getLeaveStatusBadge = (status: string) => {
    const text = getHRStatusText(status);
    
    let variant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        variant = 'success';
        break;
      case 'pending':
      case 'in_progress':
        variant = 'warning';
        break;
      case 'rejected':
      case 'failed':
        variant = 'error';
        break;
      case 'review':
      case 'scheduled':
        variant = 'info';
        break;
      default:
        variant = 'default';
    }
    
    return (
      <UnifiedBadge variant={variant} size="sm">
        {text}
      </UnifiedBadge>
    );
  };

  const getLeaveTypeLabel = (type: string) => {
    const types = {
      annual: 'إجازة سنوية',
      sick: 'إجازة مرضية',
      maternity: 'إجازة أمومة',
      paternity: 'إجازة أبوة',
      emergency: 'إجازة طارئة'
    };
    return types[type as keyof typeof types] || type;
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير معروف';
  };

  return (
    <div className="space-y-6 bg-transparent">
      {/* إحصائيات الحضور */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">الحاضرون اليوم</p>
              <p className="text-2xl font-bold text-black">{attendanceStats.presentToday}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">الغائبون اليوم</p>
              <p className="text-2xl font-bold text-black">{attendanceStats.absentToday}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">المتأخرون اليوم</p>
              <p className="text-2xl font-bold text-black">{attendanceStats.lateToday}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">متوسط ساعات العمل</p>
              <p className="text-2xl font-bold text-black">{attendanceStats.averageWorkHours}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">معدل الحضور</p>
              <p className="text-2xl font-bold text-black">{attendanceStats.attendanceRate}%</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">طلبات الإجازة</p>
              <p className="text-2xl font-bold text-black">{attendanceStats.pendingLeaveRequests}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>
      </div>

      {/* التبويبات */}
      <InnerCard 
        title="إدارة الحضور والإجازات"
        icon={<Clock className="h-4 w-4 text-white" />}
        className="p-6"
      >
        <div className="flex gap-2 mb-6">
          <UnifiedButton
            variant={selectedView === 'attendance' ? 'primary' : 'outline'}
            onClick={() => setSelectedView('attendance')}
            size="sm"
          >
            سجلات الحضور
          </UnifiedButton>
          <UnifiedButton
            variant={selectedView === 'leaves' ? 'primary' : 'outline'}
            onClick={() => setSelectedView('leaves')}
            size="sm"
          >
            طلبات الإجازة
          </UnifiedButton>
        </div>

        {selectedView === 'attendance' ? (
          /* سجلات الحضور */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-arabic">الموظف</th>
                  <th className="text-right py-3 px-4 font-arabic">التاريخ</th>
                  <th className="text-right py-3 px-4 font-arabic">وقت الوصول</th>
                  <th className="text-right py-3 px-4 font-arabic">وقت المغادرة</th>
                  <th className="text-right py-3 px-4 font-arabic">ساعات العمل</th>
                  <th className="text-right py-3 px-4 font-arabic">الحالة</th>
                  <th className="text-right py-3 px-4 font-arabic">ملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {mockAttendanceRecords.map((record, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-arabic">{getEmployeeName(record.employeeId)}</td>
                    <td className="py-3 px-4">{record.date}</td>
                    <td className="py-3 px-4">{record.checkIn}</td>
                    <td className="py-3 px-4">{record.checkOut || '-'}</td>
                    <td className="py-3 px-4">{record.workHours} ساعة</td>
                    <td className="py-3 px-4">{getAttendanceStatusBadge(record.status)}</td>
                    <td className="py-3 px-4 font-arabic">{record.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* طلبات الإجازة */
            <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium font-arabic">طلبات الإجازة</h4>
              <UnifiedButton size="sm">طلب إجازة جديد</UnifiedButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right py-3 px-4 font-arabic">الموظف</th>
                    <th className="text-right py-3 px-4 font-arabic">نوع الإجازة</th>
                    <th className="text-right py-3 px-4 font-arabic">من تاريخ</th>
                    <th className="text-right py-3 px-4 font-arabic">إلى تاريخ</th>
                    <th className="text-right py-3 px-4 font-arabic">عدد الأيام</th>
                    <th className="text-right py-3 px-4 font-arabic">الحالة</th>
                    <th className="text-right py-3 px-4 font-arabic">السبب</th>
                    <th className="text-right py-3 px-4 font-arabic">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaveRequests.map((request, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-arabic">{getEmployeeName(request.employeeId)}</td>
                      <td className="py-3 px-4 font-arabic">{getLeaveTypeLabel(request.type)}</td>
                      <td className="py-3 px-4">{request.startDate}</td>
                      <td className="py-3 px-4">{request.endDate}</td>
                      <td className="py-3 px-4">{request.days} أيام</td>
                      <td className="py-3 px-4">{getLeaveStatusBadge(request.status)}</td>
                      <td className="py-3 px-4 font-arabic">{request.reason}</td>
                      <td className="py-3 px-4">
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <UnifiedButton variant="outline" size="sm">
                              موافقة
                            </UnifiedButton>
                            <UnifiedButton variant="outline" size="sm">
                              رفض
                            </UnifiedButton>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </InnerCard>

      {/* رسم بياني للحضور */}
      <InnerCard 
        title="تحليل الحضور الشهري"
        icon={<TrendingUp className="h-4 w-4 text-white" />}
      >
        <div className="h-64 flex items-center justify-center bg-gray-50/50 rounded-lg">
          <p className="text-black/60 font-arabic">سيتم إضافة الرسم البياني للحضور هنا</p>
        </div>
      </InnerCard>
    </div>
  );
};
