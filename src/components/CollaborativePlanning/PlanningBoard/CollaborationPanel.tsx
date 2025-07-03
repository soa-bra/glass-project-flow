import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Bell } from 'lucide-react';

interface CollaborationPanelProps {
  planId: string;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ planId }) => {
  return (
    <div className="h-full flex flex-col bg-background p-4">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Users className="w-4 h-4" />
        التعاون
      </h3>
      
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">المحادثات</span>
          </div>
          <p className="text-sm text-muted-foreground">لا توجد محادثات جديدة</p>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell className="w-4 h-4" />
            <span className="font-medium">الإشعارات</span>
          </div>
          <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
        </Card>
      </div>
    </div>
  );
};