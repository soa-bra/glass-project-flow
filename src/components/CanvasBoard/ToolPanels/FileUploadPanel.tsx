import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File } from 'lucide-react';

export const FileUploadPanel: React.FC = () => {
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          رفع الملفات
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* File upload controls will be implemented */}
        <p className="text-sm text-gray-500">رفع وإدارة الملفات</p>
      </CardContent>
    </Card>
  );
};