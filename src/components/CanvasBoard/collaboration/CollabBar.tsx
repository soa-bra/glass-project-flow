import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Users, Phone, Video, Mic, MicOff, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  color: string;
  isOnline: boolean;
  avatar?: string;
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
  const [users] = useState<User[]>([
    { id: 'user1', name: 'أحمد محمد', color: '#3b82f6', isOnline: true, avatar: 'أ' },
    { id: 'user2', name: 'فاطمة علي', color: '#10b981', isOnline: true, avatar: 'ف' },
    { id: 'user3', name: 'سارة أحمد', color: '#f59e0b', isOnline: false, avatar: 'س' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // محاكاة WebSocket connection
  useEffect(() => {
    // محاكاة الرسائل الأولية
    const initialMessages: Message[] = [
      {
        id: '1',
        userId: 'user2',
        userName: 'فاطمة علي',
        text: 'مرحباً جميعاً! كيف يمكننا تطوير هذه الفكرة؟',
        timestamp: new Date(Date.now() - 5 * 60 * 1000)
      }
    ];
    setMessages(initialMessages);

    // محاكاة رسائل عشوائية
    const interval = setInterval(() => {
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

    return () => {
      clearInterval(interval);
    };
  }, [users, currentUserId]);

  const handleInvite = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط الدعوة');
  };

  const handleVoiceChat = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'تم إلغاء الكتم' : 'تم كتم الصوت');
  };

  const handleVoiceCall = () => {
    toast.info('سيتم بدء المكالمة الصوتية قريباً');
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

  const onlineUsersCount = users.filter(u => u.isOnline).length;

  return (
    <div className="fixed top-4 left-4 z-40 w-80">
      <Card className="bg-background/95 backdrop-blur-md border-border/40 rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              التعاون ({onlineUsersCount} متصل)
            </div>
            <Button size="sm" onClick={handleInvite} className="rounded-full">
              <Plus className="w-4 h-4 mr-1" />
              <span>دعوة</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Avatars */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {users.slice(0, 3).map((user) => (
                 <div 
                   key={user.id} 
                   className={cn(
                     `w-8 h-8 rounded-full flex items-center justify-center text-white text-xs border-2 border-background relative bg-[${user.color}]`,
                     user.isOnline ? "ring-2 ring-green-400" : "opacity-50"
                   )}
                  title={`${user.name} - ${user.isOnline ? 'متصل' : 'غير متصل'}`}
                >
                  {user.avatar || user.name.charAt(0)}
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-background"></div>
                  )}
                </div>
              ))}
              {users.length > 3 && (
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-xs border-2 border-background">
                  +{users.length - 3}
                </div>
              )}
            </div>
          </div>
          
          {/* Communication Controls */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 rounded-full" 
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                دردشة نصية
              </Button>
              <Button variant="outline" size="sm" className="flex-1 rounded-full" onClick={handleVoiceCall}>
                <Phone className="w-4 h-4 mr-2" />
                مكالمة صوتية
              </Button>
            </div>
            <Button 
              variant={isMuted ? "destructive" : "outline"} 
              size="sm" 
              className="w-full rounded-full"
              onClick={handleVoiceChat}
            >
              {isMuted ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
              {isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            </Button>
          </div>

          {/* الدردشة */}
          {isChatOpen && (
            <div className="border-t pt-3">
              <div className="max-h-40 overflow-y-auto space-y-2 mb-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="text-xs">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="font-medium">{msg.userName}:</span>
                      <span className="text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="text-foreground">{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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

export default CollabBar;