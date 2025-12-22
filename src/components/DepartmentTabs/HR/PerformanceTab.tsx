
import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Award, Target, TrendingUp, Star, Calendar, User } from 'lucide-react';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Button } from '@/components/ui/button';
import { mockPerformanceReviews, mockEmployees } from './data';
import { PerformanceReview } from './types';
import { getHRStatusColor, getHRStatusText } from './utils';

export const PerformanceTab: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);

  const performanceStats = {
    completedReviews: 89,
    pendingReviews: 23,
    averageRating: 4.1,
    highPerformers: 28,
    improvementNeeded: 12
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'غير معروف';
  };

  const getGoalStatusBadge = (status: string) => {
    const colorClass = getHRStatusColor(status);
    const text = getHRStatusText(status);
    
    return (
      <BaseBadge className={colorClass}>
        {text}
      </BaseBadge>
    );
  };

  const getRatingStars = (rating: number, maxRating: number = 5) => {
    return Array.from({ length: maxRating }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  if (selectedReview) {
    return (
      <div className="space-y-6 bg-transparent">
        {/* عودة إلى قائمة التقييمات */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedReview(null)}
            className="flex items-center gap-2"
          >
            <span>← العودة</span>
          </Button>
          <h3 className="text-2xl font-bold text-gray-800 font-arabic">تقييم الأداء التفصيلي</h3>
        </div>

        {/* معلومات التقييم الأساسية */}
        <BaseCard variant="operations" className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 font-arabic mb-2">
                {getEmployeeName(selectedReview.employeeId)}
              </h2>
              <p className="text-lg text-gray-600 font-arabic">{selectedReview.reviewPeriod}</p>
              <p className="text-sm text-gray-500">تمت المراجعة بواسطة: {selectedReview.reviewedBy}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {selectedReview.overallRating.toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {getRatingStars(selectedReview.overallRating)}
              </div>
              <p className="text-sm text-gray-600 font-arabic">التقييم الإجمالي</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* الأهداف */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">الأهداف</h3>
              <div className="space-y-3">
                {selectedReview.goals.map((goal, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium font-arabic">{goal.title}</h4>
                      {getGoalStatusBadge(goal.status)}
                    </div>
                    <p className="text-sm text-gray-600 font-arabic mb-2">{goal.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">التقدم: {goal.progress}%</span>
                      <span className="text-sm text-gray-500">الموعد المستهدف: {goal.targetDate}</span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            goal.status === 'completed' ? 'bg-[#bdeed3]' :
                            goal.status === 'inProgress' ? 'bg-[#a4e2f6]' :
                            goal.status === 'overdue' ? 'bg-[#f1b5b9]' : 'bg-gray-400'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* الكفاءات */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">الكفاءات</h3>
              <div className="space-y-3">
                {selectedReview.competencies.map((competency, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium font-arabic">{competency.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold">{competency.rating}</span>
                        <span className="text-sm text-gray-500">/{competency.maxRating}</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-1 mb-2">
                      {getRatingStars(competency.rating, competency.maxRating)}
                    </div>
                    {competency.comments && (
                      <p className="text-sm text-gray-600 font-arabic">{competency.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </BaseCard>

        {/* التعليقات وخطة التطوير */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BaseCard variant="operations" className="p-6">
            <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">التعليقات</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 font-arabic leading-relaxed">{selectedReview.feedback}</p>
            </div>
          </BaseCard>

          <BaseCard variant="operations" className="p-6">
            <h3 className="text-xl font-bold text-gray-800 font-arabic mb-4">خطة التطوير</h3>
            <div className="space-y-2">
              {selectedReview.developmentPlan.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700 font-arabic">{item}</span>
                </div>
              ))}
            </div>
          </BaseCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      {/* إحصائيات الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">التقييمات المكتملة</p>
              <p className="text-2xl font-bold text-green-600">{performanceStats.completedReviews}</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">التقييمات المعلقة</p>
              <p className="text-2xl font-bold text-orange-600">{performanceStats.pendingReviews}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">متوسط التقييم</p>
              <p className="text-2xl font-bold text-blue-600">{performanceStats.averageRating}</p>
            </div>
            <Star className="h-8 w-8 text-blue-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">الأداء المتميز</p>
              <p className="text-2xl font-bold text-purple-600">{performanceStats.highPerformers}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </BaseCard>

        <BaseCard variant="operations" className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-arabic">يحتاج تحسين</p>
              <p className="text-2xl font-bold text-red-600">{performanceStats.improvementNeeded}</p>
            </div>
            <User className="h-8 w-8 text-red-600" />
          </div>
        </BaseCard>
      </div>

      {/* قائمة التقييمات */}
      <BaseCard variant="operations" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800 font-arabic">تقييمات الأداء</h3>
          </div>
          <Button className="font-arabic">إضافة تقييم جديد</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-arabic">الموظف</th>
                <th className="text-right py-3 px-4 font-arabic">فترة التقييم</th>
                <th className="text-right py-3 px-4 font-arabic">التقييم الإجمالي</th>
                <th className="text-right py-3 px-4 font-arabic">الأهداف المكتملة</th>
                <th className="text-right py-3 px-4 font-arabic">تاريخ المراجعة</th>
                <th className="text-right py-3 px-4 font-arabic">الحالة</th>
                <th className="text-right py-3 px-4 font-arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {mockPerformanceReviews.map((review, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-arabic">{getEmployeeName(review.employeeId)}</td>
                  <td className="py-3 px-4 font-arabic">{review.reviewPeriod}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{review.overallRating.toFixed(1)}</span>
                      <div className="flex gap-1">
                        {getRatingStars(review.overallRating)}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {review.goals.filter(g => g.status === 'completed').length}/{review.goals.length}
                  </td>
                  <td className="py-3 px-4">{review.reviewDate}</td>
                  <td className="py-3 px-4">
                    <BaseBadge 
                      variant={review.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {review.status === 'completed' ? 'مكتمل' :
                       review.status === 'draft' ? 'مسودة' : 'معتمد'}
                    </BaseBadge>
                  </td>
                  <td className="py-3 px-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                      className="font-arabic"
                    >
                      عرض التفاصيل
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>
  );
};
