import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
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
}

export const CollabBar: React.FC<CollabBarProps> = ({ 
  projectId, 
  currentUserId = 'user1' 
}) => {
  const [users, setUsers] = useState<User[]>([
    { id: 'user1', name: 'أحمد محمد', color: '#3b82f6', isOnline: true },
    { id: 'user2', name: 'فاطمة علي', color: '#10b981', isOnline: true },
    { id: 'user3', name: 'سارة أحمد', color: '#f59e0b', isOnline: false }
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
  const [showChat, setShowChat] = useState(false);

  // محاكاة WebSocket للتعاون اللحظي
  useEffect(() => {
    const interval = setInterval(() => {
      // محاكاة رسائل عشوائية
      if (Math.random() > 0.9) {
        const sampleMessages = [
          'فكرة ممتازة!',
          'ماذا عن إضافة المزيد من التفاصيل؟',
          'أعتقد أن هذا يحتاج مراجعة',
          'يمكننا ربط هذا بالمرحلة التالية'
        ];
        
        const otherUsers = users.filter(u => u.id !== currentUserId && u.isOnline);
        if (otherUsers.length > 0) {
          const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
          const newMessage: Message = {
            id: Date.now().toString(),
            userId: randomUser.id,
            userName: randomUser.name,
            text: sampleMessages[Math.floor(Math.random() * sampleMessages.length)],
            timestamp: new Date()
          };
          setMessages(prev => [...prev, newMessage]);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [users, currentUserId]);

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

  const onlineUsersCount = users.filter(u => u.isOnline).length;

  return (
    <div className="fixed top-4 left-4 z-40 w-80">
      <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-gray-300 rounded-[30px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-arabic flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              التعاون ({onlineUsersCount} متصل)
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowChat(!showChat)}
              className="rounded-full border-gray-300"
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* المستخدمون */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {users.map((user) => (
                <div key={user.id} className="relative">
                  <Avatar 
                    className="w-8 h-8 border-2" 
                    style={{ borderColor: user.color }}
                  >
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
              ))}
            </div>
            
            <div className="text-xs text-gray-500 font-arabic">
              {users.map(user => (
                <div key={user.id} className="flex items-center justify-between">
                  <span>{user.name}</span>
                  <span className={user.isOnline ? 'text-green-600' : 'text-gray-400'}>
                    {user.isOnline ? 'متصل' : 'غير متصل'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* الدردشة */}
          {showChat && (
            <div className="border-t pt-3">
              <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium font-arabic">{msg.userName}:</span>
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
              
              <div className="flex gap-2">
                <Input
                  placeholder="اكتب رسالة..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={sendMessage}
                  className="rounded-full px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};