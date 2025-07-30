import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Hand } from 'lucide-react';

export const HandPanel: React.FC = () => {
  return (
    <Card className="w-48">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hand className="w-5 h-5" />
          أداة اليد
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hand tool controls will be implemented */}
        <p className="text-sm text-gray-500">أداة السحب والتحريك</p>
      </CardContent>
    </Card>
  );
};