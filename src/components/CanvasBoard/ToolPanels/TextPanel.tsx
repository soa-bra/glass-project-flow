import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Type } from 'lucide-react';

export const TextPanel: React.FC = () => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="w-5 h-5" />
          النصوص
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Text controls will be implemented */}
        <p className="text-sm text-gray-500">أدوات النصوص المتقدمة</p>
      </CardContent>
    </Card>
  );
};