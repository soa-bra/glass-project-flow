import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Phone, Mail, Clock, Calendar } from 'lucide-react';
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  utilization: number; // نسبة الاستخدام من 0 إلى 100
  availability: 'available' | 'busy' | 'away' | 'offline';
  currentTasks: number;
  hoursLogged: number;
  targetHours: number;
}
interface TeamRosterProps {
  data: TeamMember[];
}
export const TeamRoster: React.FC<TeamRosterProps> = ({
  data = []
}) => {
  // بيانات وهمية في حالة عدم وجود بيانات
  const defaultTeamData: TeamMember[] = [{
    id: '1',
    name: 'أحمد محمد علي',
    role: 'مطور أول',
    email: 'ahmed.ali@company.com',
    phone: '+966501234567',
    utilization: 85,
    availability: 'available',
    currentTasks: 3,
    hoursLogged: 34,
    targetHours: 40
  }, {
    id: '2',
    name: 'فاطمة أحمد السالم',
    role: 'مصممة UX/UI',
    email: 'fatima.salem@company.com',
    phone: '+966507654321',
    utilization: 92,
    availability: 'busy',
    currentTasks: 5,
    hoursLogged: 37,
    targetHours: 40
  }, {
    id: '3',
    name: 'خالد عبدالرحمن',
    role: 'محلل أعمال',
    email: 'khalid.rahman@company.com',
    phone: '+966509876543',
    utilization: 68,
    availability: 'available',
    currentTasks: 2,
    hoursLogged: 27,
    targetHours: 40
  }, {
    id: '4',
    name: 'نورا سعد المطيري',
    role: 'مختبرة برمجيات',
    email: 'nora.mutairi@company.com',
    phone: '+966502468135',
    utilization: 74,
    availability: 'away',
    currentTasks: 4,
    hoursLogged: 30,
    targetHours: 40
  }];
  const teamData = data.length > 0 ? data : defaultTeamData;
  const getAvailabilityConfig = (availability: string) => {
    switch (availability) {
      case 'available':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'متاح',
          dot: 'bg-green-500'
        };
      case 'busy':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'مشغول',
          dot: 'bg-red-500'
        };
      case 'away':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'خارج المكتب',
          dot: 'bg-yellow-500'
        };
      case 'offline':
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'غير متصل',
          dot: 'bg-gray-500'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'غير محدد',
          dot: 'bg-gray-500'
        };
    }
  };
  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600';
    if (utilization >= 80) return 'text-yellow-600';
    if (utilization >= 60) return 'text-green-600';
    return 'text-blue-600';
  };
  return <div className="space-y-4">
      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="p-2 bg-white/20 rounded-xl">
          <p className="font-bold text-lg">{teamData.length}</p>
          <p className="text-gray-600">إجمالي الفريق</p>
        </div>
        <div className="p-2 bg-white/20 rounded-xl">
          <p className="font-bold text-lg text-green-600">
            {teamData.filter(m => m.availability === 'available').length}
          </p>
          <p className="bg-[#F2FFFF] rounded-3xl p-6 border border-black/10">متاح</p>
        </div>
        <div className="p-2 bg-white/20 rounded-xl">
          <p className="font-bold text-lg text-red-600">
            {teamData.filter(m => m.availability === 'busy').length}
          </p>
          <p className="text-gray-600">مشغول</p>
        </div>
        <div className="p-2 bg-white/20 rounded-xl">
          <p className="font-bold text-lg">
            {Math.round(teamData.reduce((sum, m) => sum + m.utilization, 0) / teamData.length)}%
          </p>
          <p className="text-gray-600">متوسط الاستخدام</p>
        </div>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="">
          {teamData.map(member => {
          const availabilityConfig = getAvailabilityConfig(member.availability);
          return <div key={member.id} className="bg-white/20 rounded-2xl p-4 hover:bg-white/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="w-6 h-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${availabilityConfig.dot}`} />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <Badge className={availabilityConfig.color}>
                        {availabilityConfig.text}
                      </Badge>
                      <div className="text-right">
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${getUtilizationColor(member.utilization)}`}>
                          {member.utilization}%
                        </span>
                        <span className="text-gray-600">معدل الانتاجية</span>
                      </div>
                      <Progress value={member.utilization} className="h-2" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{member.hoursLogged}/{member.targetHours}س</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{member.currentTasks} مهام</span>
                      </div>
                      <div className="text-center">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                            <Phone className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                            <Mail className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>;
        })}
        </div>
      </ScrollArea>

      {/* أزرار التحكم */}
      <div className="flex gap-2">
        <Button size="sm" className="flex-1">
          إضافة عضو جديد
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          تصدير التقرير
        </Button>
      </div>
    </div>;
};