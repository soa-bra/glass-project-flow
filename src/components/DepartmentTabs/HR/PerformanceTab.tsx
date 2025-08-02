
import React, { useState } from 'react';
import { InnerCard } from '@/components/ui/InnerCard';
import { Award, Target, TrendingUp, Star, Calendar, User } from 'lucide-react';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
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
    const text = getHRStatusText(status);
    
    let variant: 'success' | 'warning' | 'error' | 'info' | 'default' = 'default';
    switch (status.toLowerCase()) {
      case 'completed':
        variant = 'success';
        break;
      case 'inprogress':
      case 'in_progress':
        variant = 'info';
        break;
      case 'overdue':
        variant = 'error';
        break;
      case 'pending':
        variant = 'warning';
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
          <UnifiedButton 
            variant="outline" 
            onClick={() => setSelectedReview(null)}
            size="sm"
          >
            ← العودة
          </UnifiedButton>
          <h3 className="text-2xl font-bold text-black font-arabic">تقييم الأداء التفصيلي</h3>
        </div>

        {/* معلومات التقييم الأساسية */}
        <InnerCard className="p-6">
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
                    <div className="w-full bg-black/10 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          goal.status === 'completed' ? 'bg-green-500' :
                          goal.status === 'inProgress' ? 'bg-blue-500' :
                          goal.status === 'overdue' ? 'bg-red-500' : 'bg-black/40'
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
        </InnerCard>

        {/* التعليقات وخطة التطوير */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InnerCard 
            title="التعليقات"
            className="p-6"
          >
            <div className="p-4 bg-black/5 rounded-xl">
              <p className="text-black/80 font-arabic leading-relaxed">{selectedReview.feedback}</p>
            </div>
          </InnerCard>

          <InnerCard 
            title="خطة التطوير"
            className="p-6"
          >
            <div className="space-y-2">
              {selectedReview.developmentPlan.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-black/5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
                    <Target className="h-3 w-3 text-black" />
                  </div>
                  <span className="text-black/80 font-arabic">{item}</span>
                </div>
              ))}
            </div>
          </InnerCard>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-transparent">
      {/* إحصائيات الأداء */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">التقييمات المكتملة</p>
              <p className="text-2xl font-bold text-black">{performanceStats.completedReviews}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <Award className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">التقييمات المعلقة</p>
              <p className="text-2xl font-bold text-black">{performanceStats.pendingReviews}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">متوسط التقييم</p>
              <p className="text-2xl font-bold text-black">{performanceStats.averageRating}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">الأداء المتميز</p>
              <p className="text-2xl font-bold text-black">{performanceStats.highPerformers}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-black/70 font-arabic">يحتاج تحسين</p>
              <p className="text-2xl font-bold text-black">{performanceStats.improvementNeeded}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-transparent border border-black/10 flex items-center justify-center">
              <User className="h-5 w-5 text-black" />
            </div>
          </div>
        </InnerCard>
      </div>

      {/* قائمة التقييمات */}
      <InnerCard 
        title="تقييمات الأداء"
        icon={<Award className="h-4 w-4 text-white" />}
        className="p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <UnifiedButton size="sm">إضافة تقييم جديد</UnifiedButton>
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
                    <UnifiedBadge 
                      variant={review.status === 'completed' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {review.status === 'completed' ? 'مكتمل' :
                       review.status === 'draft' ? 'مسودة' : 'معتمد'}
                    </UnifiedBadge>
                  </td>
                  <td className="py-3 px-4">
                    <UnifiedButton 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedReview(review)}
                    >
                      عرض التفاصيل
                    </UnifiedButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </InnerCard>
    </div>
  );
};
