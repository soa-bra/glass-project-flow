
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, Send, Mic, MicOff, Volume2, VolumeX, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  role: 'host' | 'user' | 'guest';
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

interface CollabBarProps {
  projectId: string;
  currentUserId?: string;
  isHost?: boolean;
}

export const CollabBar: React.FC<CollabBarProps> = ({ 
  projectId, 
  currentUserId = 'user1',
  isHost = true
}) => {
  const [users, setUsers] = useState<User[]>([
    { id: 'user1', name: 'أحمد محمد', color: '#3b82f6', isOnline: true, role: 'host' },
    { id: 'user2', name: 'فاطمة علي', color: '#10b981', isOnline: true, role: 'user' },
    { id: 'user3', name: 'سارة أحمد', color: '#f59e0b', isOnline: false, role: 'guest' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: 'user2',
      userName: 'فاطمة علي',
      text: 'مرحباً جميعاً! كيف يمكننا تطوير هذه الفكرة؟',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [inviteLink, setInviteLink] = useState('');

  const generateInviteLink = () => {
    const link = `https://app.supra.com/canvas/${projectId}/guest/${Math.random().toString(36).substr(2, 9)}`;
    setInviteLink(link);
    navigator.clipboard.writeText(link);
    toast.success('تم نسخ رابط الدعوة');
  };

  const sendMessage = () => {
    if (!chatInput.trim()) {
      toast.error('يرجى كتابة رسالة');
      return;
    }

    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: currentUserId,
      userName: currentUser.name,
      text: chatInput.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    toast.success('تم إرسال الرسالة');
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    toast.success(isMicOn ? 'تم إيقاف الميكروفون' : 'تم تشغيل الميكروفون');
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    toast.success(isSpeakerOn ? 'تم إيقاف السماعات' : 'تم تشغيل السماعات');
  };

  const onlineUsersCount = users.filter(u => u.isOnline).length;
  const hostUsers = users.filter(u => u.role === 'host');
  const regularUsers = users.filter(u => u.role === 'user');
  const guestUsers = users.filter(u => u.role === 'guest');

  return (
    <Card className="w-80 bg-[#f7f8f9] backdrop-blur-xl shadow-sm border border-black/10 rounded-[30px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-black flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            المشاركة والتواصل
          </div>
          <div className="text-sm text-gray-600 font-normal">
            {onlineUsersCount} متصل
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 h-auto">
            <TabsTrigger 
              value="participants" 
              className="rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-black text-sm font-arabic"
            >
              المشاركين
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-black text-sm font-arabic"
            >
              المحادثة
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="rounded-xl data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:text-black text-sm font-arabic"
            >
              الصوت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="mt-4 space-y-4">
            {/* زر الدعوة - للهوست فقط */}
            {isHost && (
              <Button 
                onClick={generateInviteLink}
                className="w-full rounded-xl bg-black text-white hover:bg-gray-800 font-arabic"
                size="sm"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                دعوة مشاركين
              </Button>
            )}

            {/* قائمة المشاركين */}
            <div className="space-y-3">
              {/* الهوست */}
              {hostUsers.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 font-arabic mb-2">المضيف</h5>
                  {hostUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-200">
                      <div className="relative">
                        <Avatar className="w-8 h-8 border-2" style={{ borderColor: user.color }}>
                          <AvatarFallback 
                            className="text-white text-xs"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium font-arabic truncate">{user.name}</div>
                        <div className="text-xs text-gray-500">مضيف</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* المستخدمين */}
              {regularUsers.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 font-arabic mb-2">المستخدمين</h5>
                  {regularUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-200">
                      <div className="relative">
                        <Avatar className="w-8 h-8 border-2" style={{ borderColor: user.color }}>
                          <AvatarFallback 
                            className="text-white text-xs"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium font-arabic truncate">{user.name}</div>
                        <div className={`text-xs ${user.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                          {user.isOnline ? 'متصل' : 'غير متصل'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* الضيوف */}
              {guestUsers.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-gray-700 font-arabic mb-2">الضيوف</h5>
                  {guestUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-200">
                      <div className="relative">
                        <Avatar className="w-8 h-8 border-2" style={{ borderColor: user.color }}>
                          <AvatarFallback 
                            className="text-white text-xs"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium font-arabic truncate">{user.name}</div>
                        <div className={`text-xs ${user.isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                          ضيف {user.isOnline ? '• متصل' : '• غير متصل'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-4 space-y-3">
            {/* صندوق عرض الرسائل */}
            <div className="bg-white rounded-xl border border-gray-200 p-3 max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium font-arabic text-black">{msg.userName}:</span>
                      <span className="text-gray-400">
                        {msg.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="font-arabic text-gray-700">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* شريط إدخال الرسائل */}
            <div className="flex gap-2">
              <Input
                placeholder="اكتب رسالة..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1 text-sm font-arabic rounded-xl border-gray-300"
              />
              <Button 
                onClick={sendMessage}
                className="rounded-xl bg-black text-white hover:bg-gray-800"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="mt-4 space-y-4">
            {/* أدوات التحكم الصوتي */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <div className="text-center">
                <div className="text-sm font-medium font-arabic text-black mb-2">المكالمة الصوتية</div>
                <div className="text-xs text-gray-600 font-arabic">
                  {onlineUsersCount} مشارك متصل
                </div>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  onClick={toggleMic}
                  variant={isMicOn ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full w-12 h-12 p-0 ${
                    isMicOn 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  title={isMicOn ? 'إيقاف الميكروفون' : 'تشغيل الميكروفون'}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
                
                <Button
                  onClick={toggleSpeaker}
                  variant={isSpeakerOn ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full w-12 h-12 p-0 ${
                    isSpeakerOn 
                      ? 'bg-black text-white hover:bg-gray-800' 
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  title={isSpeakerOn ? 'إيقاف السماعات' : 'تشغيل السماعات'}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-gray-500 font-arabic">
                  {isMicOn ? '🎤 الميكروفون مفعل' : '🎤 الميكروفون معطل'}
                </div>
              </div>
            </div>

            {/* قائمة المتحدثين */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-black font-arabic">المتحدثين النشطين</h5>
              {users.filter(u => u.isOnline).map((user) => (
                <div key={user.id} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-gray-200">
                  <Avatar className="w-6 h-6 border" style={{ borderColor: user.color }}>
                    <AvatarFallback 
                      className="text-white text-xs"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-arabic text-black flex-1">{user.name}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
