
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Star,
  TrendingUp,
  Plus,
  Filter,
  Search
} from 'lucide-react';

export const EventsTab: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: 'ندوة علم اجتماع العلامة التجارية',
      type: 'ندوة',
      date: '2024-02-15',
      time: '19:00',
      location: { type: 'hybrid', address: 'مركز الملك عبدالعزيز الثقافي', platform: 'Zoom' },
      capacity: 200,
      registered: 145,
      speakers: [
        { name: 'د. محمد الأحمد', title: 'أستاذ علم الاجتماع', bio: 'خبير في الهوية الثقافية' },
        { name: 'سارة الخالد', title: 'استشاري العلامات التجارية', bio: 'متخصص في الاستراتيجيات الثقافية' }
      ],
      objectives: ['تعزيز الوعي بعلم اجتماع العلامة', 'بناء شبكة مهنية', 'تبادل الخبرات'],
      budget: { allocated: 50000, spent: 35000 },
      status: 'مجدول'
    },
    {
      id: 2,
      title: 'ورشة: تطبيق الهوية الثقافية في التصميم',
      type: 'ورشة',
      date: '2024-02-22',
      time: '14:00',
      location: { type: 'physical', address: 'مقر سوبرا - الرياض' },
      capacity: 50,
      registered: 42,
      speakers: [
        { name: 'أحمد البريك', title: 'مدير التصميم', bio: 'خبير في الهوية البصرية' }
      ],
      objectives: ['تطبيق عملي للمفاهيم', 'تطوير المهارات التقنية'],
      budget: { allocated: 15000, spent: 8000 },
      status: 'مجدول'
    },
    {
      id: 3,
      title: 'مؤتمر الثقافة والعلامات التجارية',
      type: 'مؤتمر',
      date: '2024-03-10',
      time: '09:00',
      location: { type: 'virtual', platform: 'Microsoft Teams' },
      capacity: 500,
      registered: 287,
      speakers: [
        { name: 'د. فاطمة الزهراني', title: 'باحث أول', bio: 'خبير في الدراسات الثقافية' },
        { name: 'خالد الراجح', title: 'مدير الاستراتيجية', bio: 'متخصص في تطوير العلامات' }
      ],
      objectives: ['تبادل الأبحاث الحديثة', 'بناء شراكات أكاديمية'],
      budget: { allocated: 120000, spent: 45000 },
      status: 'قيد التخطيط'
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: 'محاضرة: مستقبل العلامات التجارية السعودية',
      type: 'محاضرة',
      date: '2024-01-20',
      attended: 180,
      capacity: 200,
      rating: 4.8,
      feedback: ['محتوى ممتاز', 'متحدثون مميزون', 'تنظيم رائع'],
      culturalImpact: 92,
      status: 'مكتمل'
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'ندوة': return 'bg-blue-100 text-blue-800';
      case 'ورشة': return 'bg-green-100 text-green-800';
      case 'مؤتمر': return 'bg-purple-100 text-purple-800';
      case 'محاضرة': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مجدول': return 'bg-green-100 text-green-800';
      case 'قيد التخطيط': return 'bg-yellow-100 text-yellow-800';
      case 'مكتمل': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Events Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-gray-600">فعاليات هذا العام</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-gray-600">إجمالي الحضور</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">4.7</div>
            <div className="text-sm text-gray-600">تقييم الحضور</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">89%</div>
            <div className="text-sm text-gray-600">الأثر الثقافي</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
          >
            جميع الفعاليات
          </Button>
          <Button 
            variant={selectedFilter === 'upcoming' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('upcoming')}
          >
            القادمة
          </Button>
          <Button 
            variant={selectedFilter === 'past' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('past')}
          >
            السابقة
          </Button>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          فعالية جديدة
        </Button>
      </div>

      {/* Upcoming Events */}
      {(selectedFilter === 'all' || selectedFilter === 'upcoming') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">الفعاليات القادمة</h3>
          {upcomingEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {event.location.type === 'hybrid' ? 'هجين' : 
                           event.location.type === 'virtual' ? 'افتراضي' : 'حضوري'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">التسجيل</div>
                    <div className="text-lg font-bold text-blue-600">
                      {event.registered}/{event.capacity}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">المتحدثون</h4>
                    <div className="space-y-2">
                      {event.speakers.map((speaker, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{speaker.name}</div>
                          <div className="text-gray-600">{speaker.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">الأهداف</h4>
                    <div className="space-y-1">
                      {event.objectives.map((objective, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {objective}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">الميزانية</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>المخصص:</span>
                        <span>{event.budget.allocated.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>المنفق:</span>
                        <span>{event.budget.spent.toLocaleString()} ر.س</span>
                      </div>
                      <Progress 
                        value={(event.budget.spent / event.budget.allocated) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Progress 
                    value={(event.registered / event.capacity) * 100} 
                    className="h-2" 
                  />
                  <div className="text-sm text-gray-600 mt-1">
                    نسبة التسجيل: {Math.round((event.registered / event.capacity) * 100)}%
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Past Events */}
      {(selectedFilter === 'all' || selectedFilter === 'past') && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">الفعاليات السابقة</h3>
          {pastEvents.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      تاريخ الانعقاد: {event.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{event.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">تقييم الحضور</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">إحصائيات الحضور</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>الحضور:</span>
                        <span>{event.attended}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>السعة:</span>
                        <span>{event.capacity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>نسبة الحضور:</span>
                        <span>{Math.round((event.attended / event.capacity) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">تعليقات الحضور</h4>
                    <div className="space-y-1">
                      {event.feedback.map((comment, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          • {comment}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">الأثر الثقافي</h4>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{event.culturalImpact}%</div>
                      <div className="text-sm text-gray-600">تقييم الأثر</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
