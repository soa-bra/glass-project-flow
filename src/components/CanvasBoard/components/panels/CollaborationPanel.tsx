import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCanvasCollaboration } from '@/hooks/useCanvasCollaboration';
import { 
  Users, 
  MessageSquare, 
  Send, 
  UserCheck, 
  Clock, 
  Wifi,
  WifiOff,
  Share2,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface CollaborationPanelProps {
  projectId?: string;
  currentUserId?: string;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  projectId = 'default',
  currentUserId = 'user1'
}) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    userId: string;
    message: string;
    timestamp: Date;
    userName: string;
  }>>([]);

  const { 
    collaborators, 
    isConnected, 
    sendMessage,
    lockedElements 
  } = useCanvasCollaboration({
    projectId,
    userId: currentUserId,
    enable: true
  });

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error('يرجى كتابة رسالة');
      return;
    }

    const newMessage = sendMessage(message);
    if (newMessage) {
      setChatMessages(prev => [...prev, {
        ...newMessage,
        userName: 'أنت'
      }]);
      setMessage('');
      toast.success('تم إرسال الرسالة');
    }
  };

  const handleShareProject = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط المشروع');
  };

  const onlineCount = collaborators.filter(c => c.isOnline).length;
  const totalCount = collaborators.length + 1; // +1 for current user

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Users className="w-5 h-5 text-[#96d8d0]" />
          التعاون المباشر
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-500" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 h-[calc(100%-4rem)] flex flex-col">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-[#e9eff4] rounded-[16px]">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm text-black font-medium">
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
          <Badge variant="outline" className="text-xs bg-white/50">
            {onlineCount}/{totalCount} متصل
          </Badge>
        </div>

        {/* Active Collaborators */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-black flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            المتعاونين النشطين
          </h4>
          
          <div className="space-y-2 max-h-20 overflow-y-auto">
            {/* Current user */}
            <div className="flex items-center gap-2 p-2 bg-[#96d8d0]/20 rounded-[12px]">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-[#96d8d0] text-black">أ</AvatarFallback>
              </Avatar>
              <span className="text-xs text-black font-medium">أنت (المضيف)</span>
              <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
            </div>

            {collaborators.map((collab) => (
              <div key={collab.id} className="flex items-center gap-2 p-2 bg-white/30 rounded-[12px]">
                <Avatar className="w-6 h-6" style={{ borderColor: collab.color }}>
                  <AvatarFallback 
                    className="text-xs text-white"
                    style={{ backgroundColor: collab.color }}
                  >
                    {collab.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-black">{collab.name}</span>
                <div className={`w-2 h-2 rounded-full ml-auto ${collab.isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-black">إجراءات سريعة</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleShareProject}
              size="sm"
              className="rounded-[16px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none"
            >
              <Share2 className="w-4 h-4 mr-1" />
              مشاركة
            </Button>
            <Button
              size="sm"
              className="rounded-[16px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none"
            >
              <Settings className="w-4 h-4 mr-1" />
              إعدادات
            </Button>
          </div>
        </div>

        <Separator className="bg-[#d1e1ea]" />

        {/* Mini Chat */}
        <div className="flex-1 flex flex-col space-y-2">
          <h4 className="text-sm font-medium text-black flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            محادثة سريعة
          </h4>
          
          {/* Chat Messages */}
          <div className="flex-1 bg-[#e9eff4] p-2 rounded-[16px] min-h-16 max-h-24 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="text-xs text-black/60 text-center">
                لا توجد رسائل بعد
              </div>
            ) : (
              <div className="space-y-1">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <span className="font-medium text-black">{msg.userName}:</span>
                    <span className="text-black/80 ml-1">{msg.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1 font-arabic text-xs rounded-[16px] border-[#d1e1ea] text-black placeholder:text-black/50"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="rounded-[16px] bg-[#fbe2aa] hover:bg-[#fbe2aa]/80 text-black border-none px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Info */}
        {lockedElements.length > 0 && (
          <div className="p-2 bg-[#fbe2aa]/20 rounded-[12px]">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-orange-600" />
              <span className="text-xs text-black">
                {lockedElements.length} عنصر قيد التحرير
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};