import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, MessageSquare, Video, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

const CollabBar: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [collaborators] = useState([
    { id: 1, name: 'أحمد محمد', avatar: 'أ', online: true },
    { id: 2, name: 'فاطمة علي', avatar: 'ف', online: true },
    { id: 3, name: 'محمد أحمد', avatar: 'م', online: false }
  ]);

  const handleInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط الدعوة');
  };

  const handleTextChat = () => {
    toast.info('سيتم فتح نافذة الدردشة النصية قريباً');
  };

  const handleVoiceChat = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'تم إلغاء الكتم' : 'تم كتم الصوت');
  };

  const handleVideoCall = () => {
    toast.info('سيتم بدء المكالمة المرئية قريباً');
  };
  return (
    <div className="fixed top-4 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[40px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              التعاون والتواصل
            </div>
            <Button variant="outline" size="sm" onClick={handleInvite} className="rounded-full border-gray-300">
              <Plus className="w-4 h-4 mr-1 text-black" />
              <span className="text-black">دعوة</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {collaborators.slice(0, 3).map((user) => (
                <div 
                  key={user.id} 
                  className={`w-8 h-8 ${user.online ? 'bg-green-500' : 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-xs border-2 border-white relative`}
                  title={user.name}
                >
                  {user.avatar}
                  {user.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                  )}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs border-2 border-white">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-full border-gray-300" onClick={handleTextChat}>
                <MessageSquare className="w-4 h-4 mr-2" />
                دردشة نصية
              </Button>
              <Button variant="outline" size="sm" className="flex-1 rounded-full border-gray-300" onClick={handleVideoCall}>
                <Video className="w-4 h-4 mr-2" />
                مكالمة مرئية
              </Button>
            </div>
            <Button 
              variant={isMuted ? "destructive" : "outline"} 
              size="sm" 
              className={`w-full rounded-full ${!isMuted ? 'border-gray-300' : ''}`}
              onClick={handleVoiceChat}
            >
              {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollabBar;