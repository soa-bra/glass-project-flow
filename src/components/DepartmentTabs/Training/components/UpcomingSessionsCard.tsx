
import React from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { Badge } from '@/components/ui/badge';
import { mockTrainingSessions } from '../data';

export const UpcomingSessionsCard: React.FC = () => {
  const upcomingSessions = mockTrainingSessions.filter(s => s.status === 'scheduled').slice(0, 3);

  return (
    <BaseCard variant="operations" className="p-6">
      <h3 className="text-lg font-semibold text-black font-arabic mb-4">الجلسات القادمة</h3>
      <div className="space-y-4">
        {upcomingSessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div className="flex-1">
              <h4 className="font-medium text-black font-arabic">{session.title}</h4>
              <p className="text-sm text-black font-arabic">{session.instructor}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-black font-arabic">
                  {new Date(session.scheduledAt).toLocaleDateString('ar-SA')}
                </span>
                <Badge variant="outline" className="text-black">
                  {session.type === 'workshop' ? 'ورشة عمل' :
                   session.type === 'live' ? 'جلسة مباشرة' : 'ندوة'}
                </Badge>
                <span className="text-xs text-black font-arabic">
                  {session.registeredCount}/{session.maxAttendees}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseCard>
  );
};
