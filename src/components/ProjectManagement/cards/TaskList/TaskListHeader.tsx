import React from 'react';
import { Plus, MoreHorizontal, Sparkles } from 'lucide-react';
import { CircularIconButton } from '@/components/ui/CircularIconButton';
export const TaskListHeader: React.FC = () => {
  return <div className="flex items-center justify-between mb-6 my-[10px]">
      <h3 className="font-arabic" style={{
      fontSize: '18px',
      fontWeight: 700,
      color: '#000000',
      fontFamily: 'IBM Plex Sans Arabic'
    }}>
        قائمة المهام
      </h3>
      <div className="flex items-center gap-2">
        <CircularIconButton icon={Plus} size="sm" variant="default" className="hover:scale-105 transition-transform" />
        <CircularIconButton icon={Sparkles} size="sm" variant="default" className="hover:scale-105 transition-transform" />
        <CircularIconButton icon={MoreHorizontal} size="sm" variant="default" className="hover:scale-105 transition-transform" />
      </div>
    </div>;
};