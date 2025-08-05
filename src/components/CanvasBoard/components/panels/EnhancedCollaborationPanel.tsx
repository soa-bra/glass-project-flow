import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MessageCircle, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Send, 
  Smile, 
  Link2, 
  Crown,
  UserPlus,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Participant interface
 */
interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: 'host' | 'internal_user' | 'guest';
  status: 'online' | 'away' | 'offline';
  isTyping?: boolean;
  cursor?: { x: number; y: number };
}

/**
 * Chat message interface
 */
interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'emoji' | 'system';
}

/**
 * Voice chat state
 */
interface VoiceChatState {
  isActive: boolean;
  isMuted: boolean;
  participants: string[];
  volume: number;
}

/**
 * Props for Enhanced Collaboration Panel
 */
interface EnhancedCollaborationPanelProps {
  /** معرف المشروع الحالي - Current project ID */
  projectId?: string;
  /** معرف المستخدم الحالي - Current user ID */
  currentUserId?: string;
  /** قائمة المشاركين - Participants list */
  participants?: Participant[];
  /** رسائل الدردشة - Chat messages */
  messages?: ChatMessage[];
  /** حالة الدردشة الصوتية - Voice chat state */
  voiceChat?: VoiceChatState;
  /** دالة دعوة مشارك - Invite participant callback */
  onInviteParticipant?: (email: string, role: Participant['role']) => void;
  /** دالة إرسال رسالة - Send message callback */
  onSendMessage?: (content: string) => void;
  /** دالة التحكم في الصوت - Voice control callback */
  onVoiceControl?: (action: 'start' | 'end' | 'mute' | 'unmute') => void;
  /** دالة تحديث الصلاحيات - Update permissions callback */
  onUpdatePermissions?: (participantId: string, role: Participant['role']) => void;
}

/**
 * لوحة المشاركة والتواصل المحسنة - Enhanced Collaboration Panel
 * 
 * توفر أدوات التعاون الحي مع دردشة نصية وصوتية وإدارة المشاركين
 * Provides real-time collaboration tools with text/voice chat and participant management
 */
export const EnhancedCollaborationPanel: React.FC<EnhancedCollaborationPanelProps> = ({
  projectId = 'default',
  currentUserId = 'user1',
  participants = [],
  messages = [],
  voiceChat = { isActive: false, isMuted: false, participants: [], volume: 50 },
  onInviteParticipant,
  onSendMessage,
  onVoiceControl,
  onUpdatePermissions
}) => {
  const [activeTab, setActiveTab] = useState('participants');
  const [messageInput, setMessageInput] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Participant['role']>('guest');
  const [showInviteForm, setShowInviteForm] = useState(false);

  // Mock data for demonstration
  const mockParticipants: Participant[] = [
    {
      id: 'user1',
      name: 'أحمد محمد',
      avatar: '/avatars/user1.jpg',
      role: 'host',
      status: 'online'
    },
    {
      id: 'user2',
      name: 'فاطمة علي',
      avatar: '/avatars/user2.jpg',
      role: 'internal_user',
      status: 'online',
      isTyping: true
    },
    {
      id: 'user3',
      name: 'خالد سعد',
      role: 'guest',
      status: 'away'
    }
  ];

  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      userId: 'user1',
      content: 'مرحباً بالجميع في جلسة العصف الذهني',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      type: 'text'
    },
    {
      id: '2',
      userId: 'user2',
      content: 'شكراً على الدعوة، متحمسة للمشاركة!',
      timestamp: new Date(Date.now() - 240000).toISOString(),
      type: 'text'
    },
    {
      id: '3',
      userId: 'system',
      content: 'انضم خالد سعد إلى الجلسة',
      timestamp: new Date(Date.now() - 180000).toISOString(),
      type: 'system'
    }
  ];

  const displayParticipants = participants.length > 0 ? participants : mockParticipants;
  const displayMessages = messages.length > 0 ? messages : mockMessages;
  const currentUser = displayParticipants.find(p => p.id === currentUserId);
  const isHost = currentUser?.role === 'host';

  /**
   * إرسال رسالة - Send message
   */
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    onSendMessage?.(messageInput.trim());
    setMessageInput('');
  };

  /**
   * دعوة مشارك جديد - Invite new participant
   */
  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    
    onInviteParticipant?.(inviteEmail.trim(), inviteRole);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  /**
   * تنسيق الوقت - Format time
   */
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * الحصول على لون حالة المستخدم - Get user status color
   */
  const getStatusColor = (status: Participant['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  /**
   * الحصول على تسمية الدور - Get role label
   */
  const getRoleLabel = (role: Participant['role']) => {
    switch (role) {
      case 'host': return 'مضيف';
      case 'internal_user': return 'عضو';
      case 'guest': return 'ضيف';
      default: return 'غير محدد';
    }
  };

  /**
   * رندر قائمة المشاركين - Render participants list
   */
  const renderParticipants = () => (
    <div className="space-y-3">
      {/* إحصائيات المشاركين */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{displayParticipants.length} مشارك</span>
        <span>{displayParticipants.filter(p => p.status === 'online').length} متصل</span>
      </div>

      {/* زر الدعوة للمضيف */}
      {isHost && (
        <div className="space-y-2">
          {!showInviteForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteForm(true)}
              className="w-full text-xs h-8"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              دعوة مشارك
            </Button>
          ) : (
            <div className="space-y-2 p-2 border rounded-md">
              <Input
                placeholder="البريد الإلكتروني"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-7 text-xs"
              />
              <div className="flex gap-1">
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Participant['role'])}
                  className="flex-1 text-xs p-1 border rounded"
                >
                  <option value="guest">ضيف</option>
                  <option value="internal_user">عضو</option>
                </select>
                <Button
                  size="sm"
                  onClick={handleInvite}
                  className="h-7 px-2 text-xs"
                >
                  دعوة
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteForm(false)}
                  className="h-7 px-2 text-xs"
                >
                  إلغاء
                </Button>
              </div>
            </div>
          )}
          <Separator />
        </div>
      )}

      {/* قائمة المشاركين */}
      <ScrollArea className="max-h-32">
        <div className="space-y-2">
          {displayParticipants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background",
                    getStatusColor(participant.status)
                  )}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium truncate">
                    {participant.name}
                  </span>
                  {participant.role === 'host' && (
                    <Crown className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs h-4 px-1">
                    {getRoleLabel(participant.role)}
                  </Badge>
                  {participant.isTyping && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      يكتب...
                    </span>
                  )}
                </div>
              </div>

              {participant.role !== 'host' && isHost && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => onUpdatePermissions?.(participant.id, 'internal_user')}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  /**
   * رندر الدردشة النصية - Render text chat
   */
  const renderTextChat = () => (
    <div className="flex flex-col h-full">
      {/* رسائل الدردشة */}
      <ScrollArea className="flex-1 mb-3">
        <div className="space-y-2">
          {displayMessages.map((message) => {
            const sender = displayParticipants.find(p => p.id === message.userId);
            const isCurrentUser = message.userId === currentUserId;
            const isSystemMessage = message.type === 'system';

            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col",
                  isSystemMessage ? "items-center" : isCurrentUser ? "items-end" : "items-start"
                )}
              >
                {isSystemMessage ? (
                  <div className="text-xs text-muted-foreground text-center p-1">
                    {message.content}
                  </div>
                ) : (
                  <>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-2 py-1 text-xs",
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {!isCurrentUser && (
                        <div className="text-xs font-medium mb-1 opacity-70">
                          {sender?.name || 'مجهول'}
                        </div>
                      )}
                      <div>{message.content}</div>
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {formatTime(message.timestamp)}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* حقل إدخال الرسالة */}
      <div className="flex gap-2">
        <Input
          placeholder="اكتب رسالة..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 h-8 text-xs"
        />
        <Button
          size="sm"
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
          className="h-8 px-2"
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  /**
   * رندر الدردشة الصوتية - Render voice chat
   */
  const renderVoiceChat = () => (
    <div className="space-y-3">
      {/* حالة المكالمة */}
      <div className="text-center">
        {voiceChat.isActive ? (
          <div className="space-y-2">
            <div className="text-xs text-green-600 font-medium">
              المكالمة نشطة
            </div>
            <div className="text-xs text-muted-foreground">
              {voiceChat.participants.length} مشارك في المكالمة
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            لا توجد مكالمة نشطة
          </div>
        )}
      </div>

      {/* أدوات التحكم */}
      <div className="flex gap-1">
        <Button
          variant={voiceChat.isActive ? "destructive" : "default"}
          size="sm"
          onClick={() => onVoiceControl?.(voiceChat.isActive ? 'end' : 'start')}
          className="flex-1 text-xs h-8"
        >
          {voiceChat.isActive ? (
            <>
              <PhoneOff className="h-3 w-3 mr-1" />
              إنهاء
            </>
          ) : (
            <>
              <Phone className="h-3 w-3 mr-1" />
              بدء مكالمة
            </>
          )}
        </Button>

        {voiceChat.isActive && (
          <Button
            variant={voiceChat.isMuted ? "secondary" : "outline"}
            size="sm"
            onClick={() => onVoiceControl?.(voiceChat.isMuted ? 'unmute' : 'mute')}
            className="h-8 px-2"
          >
            {voiceChat.isMuted ? (
              <MicOff className="h-3 w-3" />
            ) : (
              <Mic className="h-3 w-3" />
            )}
          </Button>
        )}
      </div>

      {/* مشاركو المكالمة */}
      {voiceChat.isActive && voiceChat.participants.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-medium">المشاركون في المكالمة:</div>
          <div className="space-y-1">
            {voiceChat.participants.map((participantId) => {
              const participant = displayParticipants.find(p => p.id === participantId);
              if (!participant) return null;

              return (
                <div key={participantId} className="flex items-center gap-2 text-xs">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback className="text-xs">
                      {participant.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{participant.name}</span>
                  {voiceChat.isMuted ? (
                    <VolumeX className="h-3 w-3 text-muted-foreground" />
                  ) : (
                    <Volume2 className="h-3 w-3 text-green-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border/40">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          المشاركة والتواصل
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0 p-3 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="participants" className="text-xs">
              المشاركون
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs">
              الدردشة
            </TabsTrigger>
            <TabsTrigger value="voice" className="text-xs">
              الصوت
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-3 min-h-0">
            <TabsContent value="participants" className="h-full m-0">
              {renderParticipants()}
            </TabsContent>

            <TabsContent value="chat" className="h-full m-0">
              {renderTextChat()}
            </TabsContent>

            <TabsContent value="voice" className="h-full m-0">
              {renderVoiceChat()}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCollaborationPanel;