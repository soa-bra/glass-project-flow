import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, MessageSquare, Mic, MicOff, UserPlus, Send, Volume2, VolumeX } from 'lucide-react';
interface Participant {
  id: string;
  name: string;
  role: 'host' | 'user' | 'guest';
  avatar?: string;
  isOnline: boolean;
  isSpeaking?: boolean;
}
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
}
export const CollaborationPanel: React.FC = () => {
  const [participants] = useState<Participant[]>([{
    id: '1',
    name: 'أحمد محمد',
    role: 'host',
    isOnline: true
  }, {
    id: '2',
    name: 'فاطمة علي',
    role: 'user',
    isOnline: true,
    isSpeaking: true
  }, {
    id: '3',
    name: 'محمد خالد',
    role: 'user',
    isOnline: true
  }, {
    id: '4',
    name: 'سارة أحمد',
    role: 'guest',
    isOnline: false
  }]);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: '1',
    userId: '2',
    userName: 'فاطمة علي',
    message: 'مرحباً بالجميع، كيف يمكننا تطوير هذا المشروع؟',
    timestamp: new Date()
  }, {
    id: '2',
    userId: '1',
    userName: 'أحمد محمد',
    message: 'أعتقد أننا بحاجة لإضافة المزيد من التفاصيل',
    timestamp: new Date()
  }]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: '1',
      userName: 'أحمد محمد',
      message: newMessage,
      timestamp: new Date()
    };
    setMessages([...messages, message]);
    setNewMessage('');
  };
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'host':
        return 'bg-[#96d8d0]';
      case 'user':
        return 'bg-[#a4e2f6]';
      case 'guest':
        return 'bg-[#fbe2aa]';
      default:
        return 'bg-[#d1e1ea]';
    }
  };
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'host':
        return 'مضيف';
      case 'user':
        return 'مستخدم';
      case 'guest':
        return 'ضيف';
      default:
        return 'غير محدد';
    }
  };
  return <Card className="backdrop-blur-md shadow-sm border border-gray-300 rounded-[20px] h-full bg-[#f3ffff] bg-[soabra-new-project-cards]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          
          التعاون والمشاركة
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-[calc(100%-4rem)] p-0">
        <Tabs defaultValue="participants" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-1 mx-0 py-0 px-[15px]">
            <TabsTrigger value="participants" className="rounded-[12px] text-xs font-arabic data-[state=active] flex-1 bg-[#96d8d0] hover:bg-[#96d8d0]/80 border-none text-black">
              المشاركين
            </TabsTrigger>
            <TabsTrigger value="chat" className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black">
              المحادثة
            </TabsTrigger>
            <TabsTrigger value="voice" className="rounded-[12px] text-xs font-arabic data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:text-black">
              الصوت
            </TabsTrigger>
          </TabsList>

          <div className="h-8 flex-1 pb-4 py-0 px-[25px] my-[15px]">
            <TabsContent value="participants" className="h-full space-y-3 mt-0 my-[5px]">
              
              
              <div className="space-y-2 max-h-[calc(100%-3rem)] overflow-y-auto">
                {participants.map(participant => <div key={participant.id} className="flex items-center gap-3 p-2 rounded-[12px] bg-white border border-[#d1e1ea] py-[5px]">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="text-xs text-black">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${participant.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-arabic text-black">{participant.name}</span>
                        {participant.isSpeaking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                      </div>
                      <Badge className={`text-xs font-arabic ${getRoleColor(participant.role)} text-black border-none`}>
                        {getRoleLabel(participant.role)}
                      </Badge>
                    </div>
                  </div>)}
              </div>
            </TabsContent>

            

            <TabsContent value="voice" className="h-full space-y-4 mt-0 my-[10px]">
              <div className="text-center">
                
                <p className="text-sm font-arabic text-black">المحادثة الصوتية نشطة</p>
                <p className="text-xs text-black/70">3 أشخاص متصلين</p>
              </div>
              
              <Separator className="bg-[#d1e1ea]" />
              
              <div className="space-y-3">
                <h4 className="text-sm font-arabic font-medium text-black">أدوات التحكم الصوتي</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => setIsMuted(!isMuted)} variant={isMuted ? "destructive" : "outline"} size="sm" className={`rounded-[12px] font-arabic ${isMuted ? 'bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none' : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'}`}>
                    {isMuted ? <MicOff className="w-4 h-4 mr-1" /> : <Mic className="w-4 h-4 mr-1" />}
                    {isMuted ? 'كتم' : 'تشغيل'}
                  </Button>
                  
                  <Button onClick={() => setIsDeafened(!isDeafened)} variant={isDeafened ? "destructive" : "outline"} size="sm" className={`rounded-[12px] font-arabic ${isDeafened ? 'bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none' : 'border-[#d1e1ea] text-black hover:bg-[#e9eff4]/50'}`}>
                    {isDeafened ? <VolumeX className="w-4 h-4 mr-1" /> : <Volume2 className="w-4 h-4 mr-1" />}
                    {isDeafened ? 'صامت' : 'سماع'}
                  </Button>
                </div>
                
                <Button size="sm" className="w-full rounded-[12px] bg-[#f1b5b9] hover:bg-[#f1b5b9]/80 text-black border-none font-arabic">
                  إنهاء المكالمة
                </Button>
              </div>
              
              <Separator className="bg-[#d1e1ea]" />
              
              <div className="space-y-2">
                <h5 className="text-xs font-arabic font-medium text-black">المتحدثين الآن</h5>
                {participants.filter(p => p.isSpeaking).map(participant => <div key={participant.id} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="font-arabic text-black">{participant.name}</span>
                    </div>)}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>;
};