import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Save, Download, Target, Settings } from 'lucide-react';

const TopActionBar: React.FC = () => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0 rounded-[40px]">
        <CardContent className="flex items-center gap-2 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-gray-600 hover:bg-gray-100"
            title="تراجع"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-gray-600 hover:bg-gray-100"
            title="إعادة"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-gray-600 hover:bg-gray-100"
            title="حفظ"
          >
            <Save className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-gray-600 hover:bg-gray-100"
            title="تصدير"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-gray-600 hover:bg-gray-100"
            title="التحويل الذكي إلى مشروع"
          >
            <Target className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-gray-300 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-10 px-3 text-gray-600 hover:bg-gray-100"
            title="إعدادات"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopActionBar;