import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, MessageSquare, Mic, MicOff, Phone, PhoneOff, Send, UserPlus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Participant {
  id: string;
  name: string;
  role: 'host' | 'user' | 'guest';
  status: 'online' | 'away' | 'offline';
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface CollaborationPanelProps {
  visible?: boolean;
  participants?: Participant[];
  messages?: Message[];
  onInviteGuest?: () => void;
  onSendMessage?: (message: string) => void;
  onToggleVoice?: () => void;
  isVoiceActive?: boolean;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  visible = true,
  participants = [
    { id: '1', name: 'أحمد محمد', role: 'host', status: 'online', avatar: '' },
    { id: '2', name: 'فاطمة عبدالله', role: 'user', status: 'online', avatar: '' },
    { id: '3', name: 'عميل الشركة', role: 'guest', status: 'away', avatar: '' }
  ],
  messages = [
    { id: '1', senderId: '1', senderName: 'أحمد محمد', content: 'مرحباً بالجميع، نبدأ الجلسة الآن', timestamp: new Date() },
    { id: '2', senderId: '2', senderName: 'فاطمة عبدالله', content: 'جاهزة للبدء', timestamp: new Date() }
  ],
  onInviteGuest,
  onSendMessage,
  onToggleVoice,
  isVoiceActive = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'host': return 'bg-soabra-new-canvas-palette-2';
      case 'user': return 'bg-soabra-new-canvas-palette-3';
      case 'guest': return 'bg-soabra-new-canvas-palette-8';
      default: return 'bg-gray-400';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'host': return 'المضيف';
      case 'user': return 'مستخدم';
      case 'guest': return 'ضيف';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-40 w-80">
      <Card className="bg-soabra-new-canvas-floating-panels rounded-[32px] shadow-sm border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-soabra-new-canvas-text font-arabic">
            المشاركة والتواصل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="participants" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-soabra-new-canvas-palette-5 rounded-2xl">
              <TabsTrigger 
                value="participants" 
                className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
              >
                <Users className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger 
                value="voice" 
                className="rounded-xl data-[state=active]:bg-soabra-new-canvas-active-tab data-[state=active]:text-white"
              >
                <Mic className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="participants" className="space-y-3 mt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
                  المشاركون ({participants.length})
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                  onClick={onInviteGuest}
                >
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-soabra-new-canvas-palette-5">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback className="text-xs">
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-soabra-new-canvas-text">
                          {participant.name}
                        </p>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getRoleColor(participant.role)} text-white`}
                        >
                          {getRoleText(participant.role)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-3 mt-4">
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="p-2 rounded-lg bg-soabra-new-canvas-palette-5">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-medium text-soabra-new-canvas-text">
                        {message.senderName}
                      </p>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-soabra-new-canvas-text mt-1">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="اكتب رسالة..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="rounded-xl"
                />
                <Button
                  size="sm"
                  className="rounded-xl bg-soabra-new-canvas-active-tab text-white"
                  onClick={handleSendMessage}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4 mt-4">
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4">
                  <Button
                    variant={isVoiceActive ? "destructive" : "default"}
                    size="lg"
                    className="rounded-full"
                    onClick={onToggleVoice}
                  >
                    {isVoiceActive ? <PhoneOff className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
                  </Button>

                  <Button
                    variant={isMuted ? "secondary" : "outline"}
                    size="lg"
                    className="rounded-full"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                </div>

                <div className="text-sm text-soabra-new-canvas-text">
                  {isVoiceActive ? 'المكالمة نشطة' : 'اضغط للانضمام للمكالمة'}
                </div>

                {isVoiceActive && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-soabra-new-canvas-text font-arabic">
                      في المكالمة:
                    </h4>
                    {participants
                      .filter(p => p.status === 'online')
                      .map(participant => (
                        <div key={participant.id} className="flex items-center gap-2 justify-center">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-soabra-new-canvas-text">
                            {participant.name}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborationPanel;