
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { BookOpen, Users, Calendar, TrendingUp, Award, Clock, Play, CheckCircle } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { mockTrainingPrograms, mockEmployees } from './data';
import { getHRStatusColor, getHRStatusText } from './utils';

export const TrainingTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'programs' | 'enrollments'>('programs');

  const trainingStats = {
    activePrograms: 8,
    totalEnrollments: 156,
    completedCourses: 89,
    certificatesIssued: 67,
    averageRating: 4.3,
    upcomingPrograms: 4
  };

  const getProgramStatusBadge = (status: string) => {
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
    );
  };

  const getFormatLabel = (format: string) => {
    const formats = {
      online: 'عبر الإنترنت',
      inPerson: 'حضوري',
      hybrid: 'مختلط'
    };
    return formats[format as keyof typeof formats] || format;
  };

  const mockEnrollments = [
    {
      id: 'enr-001',
      employeeId: 'emp-001',
      programId: 'train-001',
      enrollmentDate: '2024-12-20',
      status: 'enrolled',
      progress: 0
    },
    {
      id: 'enr-002',
      employeeId: 'emp-002',
      programId: 'train-002',
      enrollmentDate: '2024-12-22',
      status: 'enrolled',
      progress: 0
    }
  ];

  const getEnrollmentStatusBadge = (status: string) => {
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
    );
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير معروف';
  };

  const getProgramTitle = (programId: string) => {
    const program = mockTrainingPrograms.find(p => p.id === programId);
    return program ? program.title : 'غير معروف';
  };

  return (
    <div className="space-y-6 bg-transparent">
      {/* إحصائيات التدريب */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">البرامج النشطة</p>
              <p className="text-2xl font-bold text-blue-600">{trainingStats.activePrograms}</p>
            </div>
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">إجمالي التسجيلات</p>
              <p className="text-2xl font-bold text-green-600">{trainingStats.totalEnrollments}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الدورات المكتملة</p>
              <p className="text-2xl font-bold text-purple-600">{trainingStats.completedCourses}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الشهادات الصادرة</p>
              <p className="text-2xl font-bold text-orange-600">{trainingStats.certificatesIssued}</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">متوسط التقييم</p>
              <p className="text-2xl font-bold text-yellow-600">{trainingStats.averageRating}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">البرامج القادمة</p>
              <p className="text-2xl font-bold text-indigo-600">{trainingStats.upcomingPrograms}</p>
            </div>
            <Calendar className="h-8 w-8 text-indigo-600" />
          </div>
        </BaseBox>
      </div>

      {/* التبويبات */}
      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">إدارة التدريب والتطوير</h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'programs' ? 'default' : 'outline'}
              onClick={() => setSelectedView('programs')}
              className="font-arabic"
            >
              البرامج التدريبية
            </Button>
            <Button
              variant={selectedView === 'enrollments' ? 'default' : 'outline'}
              onClick={() => setSelectedView('enrollments')}
              className="font-arabic"
            >
              التسجيلات
            </Button>
          </div>
        </div>

        {selectedView === 'programs' ? (
          /* البرامج التدريبية */
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium font-arabic">البرامج التدريبية</h4>
              <Button className="font-arabic">إضافة برنامج جديد</Button>
            </div>
            <div className="grid gap-4">
              {mockTrainingPrograms.map((program, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800 font-arabic">{program.title}</h3>
                        {getProgramStatusBadge(program.status)}
                      </div>
                      <p className="text-gray-600 font-arabic mb-3">{program.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{program.duration} ساعة</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{program.enrolledCount}/{program.maxParticipants} مشارك</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4" />
                          <span className="font-arabic">{getFormatLabel(program.format)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-arabic">التكلفة: {program.cost.toLocaleString()} ر.س</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>المدرب: {program.instructor}</span>
                      <span className="mx-2">•</span>
                      <span>من {program.startDate} إلى {program.endDate}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="font-arabic">
                        عرض المتدربين
                      </Button>
                      <Button variant="outline" size="sm" className="font-arabic">
                        تعديل
                      </Button>
                    </div>
                  </div>
                  
                  {/* شريط التقدم */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-arabic">نسبة الامتلاء</span>
                      <span className="text-sm">{Math.round((program.enrolledCount / program.maxParticipants) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(program.enrolledCount / program.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* التسجيلات */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-arabic">الموظف</th>
                  <th className="text-right py-3 px-4 font-arabic">البرنامج التدريبي</th>
                  <th className="text-right py-3 px-4 font-arabic">تاريخ التسجيل</th>
                  <th className="text-right py-3 px-4 font-arabic">الحالة</th>
                  <th className="text-right py-3 px-4 font-arabic">التقدم</th>
                  <th className="text-right py-3 px-4 font-arabic">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {mockEnrollments.map((enrollment, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-arabic">{getEmployeeName(enrollment.employeeId)}</td>
                    <td className="py-3 px-4 font-arabic">{getProgramTitle(enrollment.programId)}</td>
                    <td className="py-3 px-4">{enrollment.enrollmentDate}</td>
                    <td className="py-3 px-4">{getEnrollmentStatusBadge(enrollment.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-blue-600 rounded-full" 
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <span className="text-sm">{enrollment.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" className="font-arabic">
                        عرض التفاصيل
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BaseBox>

      {/* تحليل الأداء التدريبي */}
      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">تحليل الأداء التدريبي</h3>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-arabic">سيتم إضافة تحليلات الأداء التدريبي هنا</p>
        </div>
      </BaseBox>
    </div>
  );
};
