import React from 'react';
import KanbanBoard from '@/components/Kanban/KanbanBoard';

const KanbanPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">لوحة كانبان</h1>
        <p className="text-muted-foreground text-right mt-2">
          إدارة المهام مع حدود WIP ومراقبة SLA
        </p>
      </div>
      
      <KanbanBoard boardId="board-1" />
    </div>
  );
};

export default KanbanPage;