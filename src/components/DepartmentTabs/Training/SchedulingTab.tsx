
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge as Badge } from '@/components/ui/BaseBadge';
import { Calendar, Clock, Users, MapPin, Plus, Filter, Search } from 'lucide-react';

export const SchedulingTab: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Mock scheduled sessions
  const scheduledSessions = [
    {
      id: 1,
      title: 'ورشة عمل: استراتيجيات التسويق الرقمي',
      instructor: 'د. سارة أحمد',
      date: '2024-03-20',
      time: '10:00 - 12:00',
      location: 'قاعة المؤتمرات الرئيسية',
      type: 'workshop',
      capacity: 25,
      registered: 18,
      waitlist: 3,
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'دورة: أساسيات علم اجتماع العلامة التجارية',
      instructor: 'أ. محمد عبدالله',
      date: '2024-03-22',
      time: '14:00 - 16:30',
      location: 'قاعة التدريب A',
      type: 'course',
      capacity: 20,
      registered: 20,
      waitlist: 5,
      status: 'full'
    },
    {
      id: 3,
      title: 'ندوة: مستقبل التحول الرقمي',
      instructor: 'د. خالد المطيري',
      date: '2024-03-25',
      time: '09:00 - 11:00',
      location: 'مركز الابتكار',
      type: 'seminar',
      capacity: 100,
      registered: 67,
      waitlist: 0,
      status: 'open'
    }
  ];

  const upcomingThisWeek = scheduledSessions.filter(session => {
    const sessionDate = new Date(session.date);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return sessionDate >= today && sessionDate <= weekFromNow;
  });

  const CalendarView = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
        <div>الأحد</div>
        <div>الاثنين</div>
        <div>الثلاثاء</div>
        <div>الأربعاء</div>
        <div>الخميس</div>
        <div>الجمعة</div>
        <div>السبت</div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {/* Calendar days would be generated here */}
        {Array.from({ length: 35 }, (_, i) => (
          <div key={i} className="h-24 border rounded-lg p-1 bg-gray-50">
            <div className="text-xs text-gray-600">{(i % 31) + 1}</div>
            {i === 15 && (
              <div className="text-xs bg-blue-100 text-blue-800 rounded p-1 mt-1">
                ورشة عمل
              </div>
            )}
            {i === 17 && (
              <div className="text-xs bg-green-100 text-green-800 rounded p-1 mt-1">
                دورة تدريبية
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {scheduledSessions.map((session) => (
        <Card key={session.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold">{session.title}</h4>
                  <Badge variant={
                    session.type === 'workshop' ? 'default' :
                    session.type === 'course' ? 'secondary' : 'outline'
                  }>
                    {session.type === 'workshop' ? 'ورشة عمل' :
                     session.type === 'course' ? 'دورة' : 'ندوة'}
                  </Badge>
                   <Badge variant={
                    session.status === 'confirmed' ? 'default' :
                    session.status === 'full' ? 'error' : 'secondary'
                  }>
                    {session.status === 'confirmed' ? 'مؤكد' :
                     session.status === 'full' ? 'مكتمل' : 'متاح'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{session.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(session.date).toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{session.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{session.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm mb-2">
                  <span className="font-medium">{session.registered}</span>
                  <span className="text-gray-500">/{session.capacity}</span>
                  <span className="text-gray-600 text-xs block">مسجل</span>
                </div>
                {session.waitlist > 0 && (
                  <div className="text-xs text-orange-600">
                    {session.waitlist} في قائمة الانتظار
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline">تعديل</Button>
                  <Button size="sm">عرض</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">الجدولة والتسجيل</h3>
          <p className="text-gray-600">تقويم تفاعلي لجلسات الحضور المباشر وورش العمل مع سياسة المقاعد وقوائم الانتظار</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          جدولة جلسة جديدة
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{scheduledSessions.length}</div>
            <div className="text-sm text-gray-600">جلسات مجدولة</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{scheduledSessions.reduce((acc, s) => acc + s.registered, 0)}</div>
            <div className="text-sm text-gray-600">إجمالي المسجلين</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{upcomingThisWeek.length}</div>
            <div className="text-sm text-gray-600">هذا الأسبوع</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{scheduledSessions.reduce((acc, s) => acc + s.waitlist, 0)}</div>
            <div className="text-sm text-gray-600">قوائم الانتظار</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
          >
            <Calendar className="h-4 w-4 mr-1" />
            التقويم
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            قائمة
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-1" />
            بحث
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            فلترة
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === 'calendar' ? 'تقويم الجلسات' : 'قائمة الجلسات المجدولة'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? <CalendarView /> : <ListView />}
        </CardContent>
      </Card>

      {/* Upcoming This Week */}
      {upcomingThisWeek.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>الجلسات القادمة هذا الأسبوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingThisWeek.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{session.title}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(session.date).toLocaleDateString('ar-SA')} - {session.time}
                    </p>
                  </div>
                  <Badge variant={session.status === 'full' ? 'error' : 'default'}>
                    {session.registered}/{session.capacity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
