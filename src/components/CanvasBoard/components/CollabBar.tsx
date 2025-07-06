import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, MessageSquare } from 'lucide-react';

const CollabBar: React.FC = () => {
  return (
    <div className="fixed top-4 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-lg rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2">
            <Users className="w-5 h-5" />
            التعاون والتواصل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['المستخدم 1', 'المستخدم 2'].map((user, i) => (
                <div key={i} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white">
                  {user[0]}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              دعوة
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                دردشة نصية
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                دردشة صوتية
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollabBar;