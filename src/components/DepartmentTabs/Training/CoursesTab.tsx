
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Star, Plus } from 'lucide-react';
import { mockCourses } from './data';

export const CoursesTab: React.FC = () => {
  const courses = mockCourses;

  const getCategoryLabel = (category: string) => {
    const labels = {
      'onboarding': 'تأهيل',
      'technical': 'تقني',
      'management': 'إداري',
      'corporate': 'مؤسسي',
      'workshop': 'ورشة عمل'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'internal': 'داخلي',
      'external': 'خارجي',
      'partnership': 'شراكة'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">الدورات التدريبية</h3>
          <p className="text-gray-600">إدارة وتطوير الدورات والبرامج التدريبية</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إنشاء دورة جديدة
        </Button>
      </div>

      {/* Course Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">دورات التأهيل</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">دورات تقنية</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-sm text-gray-600">دورات إدارية</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">4</div>
            <div className="text-sm text-gray-600">برامج مؤسسية</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-gray-600">ورش عمل</div>
          </CardContent>
        </Card>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{getCategoryLabel(course.category)}</Badge>
                    <Badge variant="secondary">{getTypeLabel(course.type)}</Badge>
                  </div>
                </div>
                <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                  {course.status === 'published' ? 'منشور' : 
                   course.status === 'draft' ? 'مسودة' : 'مؤرشف'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    المدرب: {course.instructor}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration} ساعة
                  </span>
                  {course.maxStudents && (
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      حتى {course.maxStudents} متدرب
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>4.5</span>
                  <span className="text-gray-500">(24 تقييم)</span>
                </div>

                {course.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {course.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {course.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">عرض التفاصيل</Button>
                <Button size="sm" variant="outline">تعديل</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Course Builder Section */}
      <Card>
        <CardHeader>
          <CardTitle>محرر الدورات البصري</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Course Builder</h3>
            <p className="text-gray-600 mb-4">
              استخدم المحرر البصري لإنشاء دورات تفاعلية تتضمن وحدات ودروس واختبارات
            </p>
            <Button>إطلاق محرر الدورات</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
