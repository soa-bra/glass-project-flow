
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Clock, Calendar, Users, TrendingUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
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
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
    );
  };

  const getLeaveStatusBadge = (status: string) => {
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
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
        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الحاضرون اليوم</p>
              <p className="text-2xl font-bold text-green-600">{attendanceStats.presentToday}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الغائبون اليوم</p>
              <p className="text-2xl font-bold text-red-600">{attendanceStats.absentToday}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">المتأخرون اليوم</p>
              <p className="text-2xl font-bold text-yellow-600">{attendanceStats.lateToday}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">متوسط ساعات العمل</p>
              <p className="text-2xl font-bold text-blue-600">{attendanceStats.averageWorkHours}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">معدل الحضور</p>
              <p className="text-2xl font-bold text-purple-600">{attendanceStats.attendanceRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">طلبات الإجازة</p>
              <p className="text-2xl font-bold text-orange-600">{attendanceStats.pendingLeaveRequests}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </BaseCard>
      </div>

      {/* التبويبات */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">إدارة الحضور والإجازات</h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'attendance' ? 'default' : 'outline'}
              onClick={() => setSelectedView('attendance')}
              className="font-arabic"
            >
              سجلات الحضور
            </Button>
            <Button
              variant={selectedView === 'leaves' ? 'default' : 'outline'}
              onClick={() => setSelectedView('leaves')}
              className="font-arabic"
            >
              طلبات الإجازة
            </Button>
          </div>
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
              <Button className="font-arabic">طلب إجازة جديد</Button>
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
                            <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                              موافقة
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                              رفض
                            </Button>
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
      </BaseCard>

      {/* رسم بياني للحضور */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">تحليل الحضور الشهري</h3>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-arabic">سيتم إضافة الرسم البياني للحضور هنا</p>
        </div>
      </BaseCard>
    </div>
  );
};
