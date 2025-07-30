import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export const ZoomPanel: React.FC = () => {
  return (
    <Card className="w-48">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ZoomIn className="w-5 h-5" />
          التكبير
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Zoom controls will be implemented */}
        <p className="text-sm text-gray-500">أدوات التكبير والتصغير</p>
      </CardContent>
    </Card>
  );
};