
import React, { useState } from 'react';
import { BaseBox } from '@/components/ui/BaseBox';
import { UserPlus, Briefcase, Users, Calendar, Star, Phone, Mail, Eye, CheckCircle, XCircle } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { mockJobPostings, mockCandidates } from './data';
import { JobPosting, Candidate } from './types';
import { getHRStatusColor, getHRStatusText } from './utils';

export const RecruitmentTab: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'jobs' | 'candidates'>('jobs');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const recruitmentStats = {
    activeJobs: 6,
    totalApplications: 87,
    scheduledInterviews: 12,
    offersExtended: 3,
    newHiresThisMonth: 5
  };

  const getJobStatusBadge = (status: string) => {
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
    );
  };

  const getCandidateStatusBadge = (status: string) => {
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
    );
  };

  const getJobTypeLabel = (type: string) => {
    const types = {
      fullTime: 'دوام كامل',
      partTime: 'دوام جزئي',
      contract: 'عقد',
      internship: 'تدريب'
    };
    return types[type as keyof typeof types] || type;
  };

  if (selectedCandidate) {
    return (
      <div className="space-y-6 bg-transparent">
        {/* عودة إلى قائمة المرشحين */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedCandidate(null)}
            className="flex items-center gap-2"
          >
            <span>← العودة</span>
          </Button>
          <h3 className="text-2xl font-bold text-gray-800 font-arabic">ملف المرشح</h3>
        </div>

        {/* معلومات المرشح */}
        <BaseBox variant="operations" className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedCandidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-arabic mb-2">
                  {selectedCandidate.name}
                </h2>
                <p className="text-lg text-gray-600 font-arabic mb-2">{selectedCandidate.position}</p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{selectedCandidate.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{selectedCandidate.phone}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">تاريخ التقديم: {selectedCandidate.applicationDate}</p>
              </div>
            </div>
            <div className="text-center">
              {getCandidateStatusBadge(selectedCandidate.status)}
              {selectedCandidate.aiScore && (
                <div className="mt-2">
                  <div className="text-2xl font-bold text-blue-600">{selectedCandidate.aiScore}</div>
                  <p className="text-xs text-gray-600">نقاط الذكاء الاصطناعي</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* السيرة الذاتية والمرفقات */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 font-arabic mb-3">المستندات</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-arabic">السيرة الذاتية</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                {selectedCandidate.coverLetter && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-arabic">خطاب التقديم</span>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* الملاحظات */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 font-arabic mb-3">الملاحظات</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 font-arabic">{selectedCandidate.notes}</p>
              </div>
            </div>
          </div>
        </BaseBox>

        {/* المقابلات */}
        <BaseBox variant="operations" className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 font-arabic">المقابلات</h3>
            <Button className="font-arabic">جدولة مقابلة</Button>
          </div>
          
          {selectedCandidate.interviews.length > 0 ? (
            <div className="space-y-3">
              {selectedCandidate.interviews.map((interview, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium font-arabic">مقابلة {interview.type === 'phone' ? 'هاتفية' : 
                        interview.type === 'video' ? 'مرئية' : 
                        interview.type === 'inPerson' ? 'شخصية' : 'تقنية'}</p>
                      <p className="text-sm text-gray-600">مع {interview.interviewerName}</p>
                    </div>
                    <BaseBadge 
                      variant={interview.status === 'completed' ? 'default' : 
                              interview.status === 'scheduled' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      {interview.status === 'completed' ? 'مكتملة' :
                       interview.status === 'scheduled' ? 'مجدولة' : 'ملغية'}
                    </BaseBadge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">التاريخ: {interview.scheduledDate}</p>
                  {interview.feedback && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-arabic"><strong>التعليقات:</strong> {interview.feedback}</p>
                      {interview.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">التقييم:</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < interview.rating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 font-arabic py-8">لا توجد مقابلات مجدولة</p>
          )}
        </BaseBox>

        {/* إجراءات المرشح */}
        <BaseBox variant="operations" className="p-6">
          <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">الإجراءات</h3>
          <div className="flex gap-4">
            <Button className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="font-arabic">قبول المرشح</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-arabic">جدولة مقابلة</span>
            </Button>
            <Button variant="destructive" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <span className="font-arabic">رفض المرشح</span>
            </Button>
          </div>
        </BaseBox>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      {/* إحصائيات التوظيف */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الوظائف النشطة</p>
              <p className="text-2xl font-bold text-blue-600">{recruitmentStats.activeJobs}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-green-600">{recruitmentStats.totalApplications}</p>
            </div>
            <Users className="h-8 w-8 text-green-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">المقابلات المجدولة</p>
              <p className="text-2xl font-bold text-purple-600">{recruitmentStats.scheduledInterviews}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">عروض العمل</p>
              <p className="text-2xl font-bold text-orange-600">{recruitmentStats.offersExtended}</p>
            </div>
            <Star className="h-8 w-8 text-orange-600" />
          </div>
        </BaseBox>

        <BaseBox variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">التوظيف هذا الشهر</p>
              <p className="text-2xl font-bold text-green-800">{recruitmentStats.newHiresThisMonth}</p>
            </div>
            <UserPlus className="h-8 w-8 text-green-800" />
          </div>
        </BaseBox>
      </div>

      {/* التبويبات */}
      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">إدارة التوظيف والمواهب</h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedView === 'jobs' ? 'default' : 'outline'}
              onClick={() => setSelectedView('jobs')}
              className="font-arabic"
            >
              الوظائف المفتوحة
            </Button>
            <Button
              variant={selectedView === 'candidates' ? 'default' : 'outline'}
              onClick={() => setSelectedView('candidates')}
              className="font-arabic"
            >
              المرشحون
            </Button>
          </div>
        </div>

        {selectedView === 'jobs' ? (
          /* الوظائف المفتوحة */
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium font-arabic">الوظائف المفتوحة</h4>
              <Button className="font-arabic">إضافة وظيفة جديدة</Button>
            </div>
            <div className="grid gap-4">
              {mockJobPostings.map((job, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 font-arabic mb-2">{job.title}</h3>
                      <p className="text-gray-600 font-arabic mb-2">{job.department}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{getJobTypeLabel(job.type)}</span>
                        <span>{job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()} ر.س</span>
                        <span>{job.applicationsCount} طلب</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getJobStatusBadge(job.status)}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 font-arabic mb-4">{job.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>تم النشر: {job.postedDate}</span>
                      <span className="mx-2">•</span>
                      <span>آخر موعد: {job.applicationDeadline}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="font-arabic">عرض الطلبات</Button>
                      <Button variant="outline" size="sm" className="font-arabic">تعديل</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* المرشحون */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-arabic">المرشح</th>
                  <th className="text-right py-3 px-4 font-arabic">المنصب</th>
                  <th className="text-right py-3 px-4 font-arabic">تاريخ التقديم</th>
                  <th className="text-right py-3 px-4 font-arabic">حالة الطلب</th>
                  <th className="text-right py-3 px-4 font-arabic">نقاط الذكاء الاصطناعي</th>
                  <th className="text-right py-3 px-4 font-arabic">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {mockCandidates.map((candidate, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {candidate.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium font-arabic">{candidate.name}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-arabic">{candidate.position}</td>
                    <td className="py-3 px-4">{candidate.applicationDate}</td>
                    <td className="py-3 px-4">{getCandidateStatusBadge(candidate.status)}</td>
                    <td className="py-3 px-4">
                      {candidate.aiScore ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">{candidate.aiScore}</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-600 rounded-full" 
                              style={{ width: `${candidate.aiScore}%` }}
                            />
                          </div>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedCandidate(candidate)}
                        className="font-arabic"
                      >
                        عرض الملف
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BaseBox>

      {/* قمع التوظيف */}
      <BaseBox variant="operations" className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800 font-arabic">قمع التوظيف</h3>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-arabic">سيتم إضافة الرسم البياني لقمع التوظيف هنا</p>
        </div>
      </BaseBox>
    </div>
  );
};
