
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, MessageCircle, Mic, MicOff, Video, VideoOff, 
  UserPlus, Send, Crown, User, UserCheck 
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  role: 'host' | 'user' | 'guest';
  avatar?: string;
  isOnline: boolean;
  color: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface EnhancedCollaborationPanelProps {
  participants?: Participant[];
  chatMessages?: ChatMessage[];
  currentUserId?: string;
  onInviteUser?: () => void;
  onSendMessage?: (message: string) => void;
  onToggleAudio?: () => void;
  onToggleVideo?: () => void;
  isAudioEnabled?: boolean;
  isVideoEnabled?: boolean;
}

const EnhancedCollaborationPanel: React.FC<EnhancedCollaborationPanelProps> = ({
  participants = [
    { id: '1', name: 'أحمد محمد', role: 'host', isOnline: true, color: '#96d8d0' },
    { id: '2', name: 'فاطمة سالم', role: 'user', isOnline: true, color: '#f1b5b9' },
    { id: '3', name: 'محمد علي', role: 'user', isOnline: false, color: '#a4e2f6' },
    { id: '4', name: 'شركة الإبداع', role: 'guest', isOnline: true, color: '#bdeed3' }
  ],
  chatMessages = [
    { id: '1', userId: '1', userName: 'أحمد محمد', content: 'مرحباً بالجميع في الجلسة', timestamp: new Date(), type: 'text' },
    { id: '2', userId: '2', userName: 'فاطمة سالم', content: 'شكراً لك، جاهزة للعمل', timestamp: new Date(), type: 'text' },
    { id: '3', userId: 'system', userName: 'النظام', content: 'انضم محمد علي إلى الجلسة', timestamp: new Date(), type: 'system' }
  ],
  currentUserId = '1',
  onInviteUser,
  onSendMessage,
  onToggleAudio,
  onToggleVideo,
  isAudioEnabled = false,
  isVideoEnabled = false
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('participants');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    onSendMessage?.(newMessage);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Crown className="w-3 h-3 text-yellow-500" />;
      case 'user': return <User className="w-3 h-3 text-blue-500" />;
      case 'guest': return <UserCheck className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'host': return 'مضيف';
      case 'user': return 'مستخدم';
      case 'guest': return 'ضيف';
      default: return '';
    }
  };

  return (
    <Card className="w-80 bg-[#f2f9fb] backdrop-blur-xl shadow-sm border border-white/20 rounded-[24px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic text-[#000000] flex items-center gap-2">
          <Users className="w-5 h-5 text-[#96d8d0]" />
          التعاون والمشاركة
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/30 rounded-xl">
            <TabsTrigger 
              value="participants" 
              className="rounded-xl font-arabic text-xs data-[state=active]:bg-[#000000] data-[state=active]:text-white data-[state=inactive]:text-[#000000]"
            >
              المشاركين
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="rounded-xl font-arabic text-xs data-[state=active]:bg-[#000000] data-[state=active]:text-white data-[state=inactive]:text-[#000000]"
            >
              المحادثة
            </TabsTrigger>
            <TabsTrigger 
              value="voice" 
              className="rounded-xl font-arabic text-xs data-[state=active]:bg-[#000000] data-[state=active]:text-white data-[state=inactive]:text-[#000000]"
            >
              الصوت
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="participants" className="space-y-3 mt-4">
            {/* Invite Button */}
            <Button
              onClick={onInviteUser}
              className="w-full rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc] text-[#000000] font-arabic"
            >
              <UserPlus className="w-4 h-4 ml-1" />
              دعوة مشارك
            </Button>
            
            {/* Participants List */}
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-2 rounded-xl bg-white/30 hover:bg-white/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback 
                          className="text-xs font-arabic"
                          style={{ backgroundColor: participant.color }}
                        >
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          participant.isOnline ? 'bg-green-400' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium font-arabic text-[#000000] truncate">
                        {participant.name}
                      </div>
                      <div className="flex items-center gap-1">
                        {getRoleIcon(participant.role)}
                        <span className="text-xs text-gray-600 font-arabic">
                          {getRoleLabel(participant.role)}
                        </span>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={participant.isOnline ? "default" : "secondary"}
                      className="text-xs font-arabic"
                    >
                      {participant.isOnline ? 'متصل' : 'غير متصل'}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-3 mt-4">
            {/* Chat Messages */}
            <div className="bg-white/30 rounded-xl border border-white/30">
              <ScrollArea className="h-40 p-3">
                <div className="space-y-2">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`${
                        message.type === 'system' 
                          ? 'text-center' 
                          : message.userId === currentUserId 
                            ? 'text-right' 
                            : 'text-left'
                      }`}
                    >
                      {message.type === 'system' ? (
                        <div className="text-xs text-gray-500 font-arabic bg-gray-100 rounded-lg px-2 py-1 inline-block">
                          {message.content}
                        </div>
                      ) : (
                        <div className={`inline-block max-w-[80%]`}>
                          <div className="text-xs text-gray-600 font-arabic mb-1">
                            {message.userName}
                          </div>
                          <div
                            className={`p-2 rounded-lg text-sm font-arabic ${
                              message.userId === currentUserId
                                ? 'bg-[#96d8d0] text-[#000000]'
                                : 'bg-white text-[#000000] border border-gray-200'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Chat Input */}
              <div className="p-3 border-t border-white/30">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالة..."
                    className="flex-1 rounded-xl border-white/30 bg-white/50 text-[#000000] font-arabic text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="rounded-xl bg-[#96d8d0] hover:bg-[#7cc4bc] text-[#000000]"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="voice" className="space-y-4 mt-4">
            {/* Voice Controls */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={onToggleAudio}
                variant={isAudioEnabled ? "default" : "outline"}
                className="rounded-xl font-arabic text-sm"
              >
                {isAudioEnabled ? (
                  <Mic className="w-4 h-4 ml-1" />
                ) : (
                  <MicOff className="w-4 h-4 ml-1" />
                )}
                {isAudioEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
              </Button>
              
              <Button
                onClick={onToggleVideo}
                variant={isVideoEnabled ? "default" : "outline"}
                className="rounded-xl font-arabic text-sm"
              >
                {isVideoEnabled ? (
                  <Video className="w-4 h-4 ml-1" />
                ) : (
                  <VideoOff className="w-4 h-4 ml-1" />
                )}
                {isVideoEnabled ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
              </Button>
            </div>
            
            {/* Voice Participants */}
            <div className="bg-white/30 rounded-xl p-3 border border-white/30">
              <h4 className="text-sm font-medium font-arabic mb-2 text-[#000000]">
                المشاركين في المكالمة
              </h4>
              <div className="space-y-2">
                {participants
                  .filter(p => p.isOnline)
                  .map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white/30"
                    >
                      <Avatar className="w-6 h-6">
                        <AvatarFallback 
                          className="text-xs font-arabic"
                          style={{ backgroundColor: participant.color }}
                        >
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-arabic text-[#000000] flex-1">
                        {participant.name}
                      </span>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Voice Tips */}
            <div className="bg-[#e9eff4] p-3 rounded-xl border border-[#d1e1ea]">
              <div className="text-xs text-[#000000] font-arabic space-y-1">
                <div>🎤 استخدم الصوت للتواصل السريع</div>
                <div>📹 شارك الفيديو لتعزيز التفاعل</div>
                <div>🔇 يمكن كتم الصوت في أي وقت</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCollaborationPanel;
