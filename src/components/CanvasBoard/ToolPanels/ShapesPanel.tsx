import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shapes } from 'lucide-react';

export const ShapesPanel: React.FC = () => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shapes className="w-5 h-5" />
          الأشكال
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Shapes controls will be implemented */}
        <p className="text-sm text-gray-500">مكتبة الأشكال الجاهزة</p>
      </CardContent>
    </Card>
  );
};