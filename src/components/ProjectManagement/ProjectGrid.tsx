
import React from 'react';
import { GlassCard } from './GlassCard';
import { TasksCard } from './cards/TasksCard';
import { BudgetCard } from './cards/BudgetCard';
import { TeamCard } from './cards/TeamCard';
import { TimelineCard } from './cards/TimelineCard';
import { FilesCard } from './cards/FilesCard';
import { NotesCard } from './cards/NotesCard';

export const ProjectGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-4 grid-rows-[repeat(4,150px)] gap-4 h-full
                    max-sm:grid-cols-1 max-sm:grid-rows-none max-sm:auto-rows-fr">
      
      {/* المهام - عمود كامل */}
      <GlassCard className="col-span-1 row-span-4 max-sm:col-span-1 max-sm:row-span-1">
        <TasksCard />
      </GlassCard>

      {/* الميزانية */}
      <GlassCard className="col-span-1 row-span-2">
        <BudgetCard />
      </GlassCard>

      {/* الفريق */}
      <GlassCard className="col-span-1 row-span-2">
        <TeamCard />
      </GlassCard>

      {/* الخط الزمني */}
      <GlassCard className="col-span-1 row-span-2">
        <TimelineCard />
      </GlassCard>

      {/* الملفات */}
      <GlassCard className="col-span-1 row-span-1">
        <FilesCard />
      </GlassCard>

      {/* الملاحظات */}
      <GlassCard className="col-span-1 row-span-1">
        <NotesCard />
      </GlassCard>

      {/* بطاقة إضافية */}
      <GlassCard className="col-span-1 row-span-1">
        <div className="p-4 text-center text-gray-600 font-arabic">
          إحصائيات إضافية
        </div>
      </GlassCard>
    </div>
  );
};
