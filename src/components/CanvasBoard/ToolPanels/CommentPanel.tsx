import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export const CommentPanel: React.FC = () => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          التعليقات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comment controls will be implemented */}
        <p className="text-sm text-gray-500">إضافة وإدارة التعليقات</p>
      </CardContent>
    </Card>
  );
};