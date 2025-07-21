/**
 * @fileoverview Enhanced Collaboration Panel with chat, voice, and participants
 * @author AI Assistant
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, MessageCircle, Mic, MicOff, Phone, PhoneOff, Send, Smile } from 'lucide-react';
import { Participant, ChatMessage } from '@/types/canvas';

interface EnhancedCollaborationPanelProps {
  participants: Participant[];
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onInviteParticipant: () => void;
}

/**
 * Enhanced Collaboration Panel Component
 * Provides real-time collaboration features
 */
const EnhancedCollaborationPanel: React.FC<EnhancedCollaborationPanelProps> = ({
  participants,
  chatMessages,
  onSendMessage,
  onInviteParticipant
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'host': return 'text-blue-600 bg-blue-50';
      case 'user': return 'text-green-600 bg-green-50';
      case 'guest': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'host': return 'مضيف';
      case 'user': return 'مستخدم';
      case 'guest': return 'ضيف';
      default: return 'غير معروف';
    }
  };

  return (
    <Card className="h-full glass-section">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          لوحة التعاون
        </CardTitle>
      </CardHeader>
      
      <CardContent className="h-full">
        <Tabs defaultValue="participants" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participants">المشاركون</TabsTrigger>
            <TabsTrigger value="chat">المحادثة</TabsTrigger>
            <TabsTrigger value="voice">الصوت</TabsTrigger>
          </TabsList>

          <TabsContent value="participants" className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                المشاركون ({participants.length})
              </span>
              <Button size="sm" onClick={onInviteParticipant}>
                دعوة
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {participant.avatar ? (
                        <img src={participant.avatar} alt={participant.name} className="w-8 h-8 rounded-full" />
                      ) : (
                        <span className="text-sm font-medium">
                          {participant.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    {participant.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium truncate">
                        {participant.name}
                      </span>
                      {participant.isSpeaking && (
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(participant.role)}`}>
                      {getRoleLabel(participant.role)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-3">
            <div className="flex-1 space-y-2 max-h-60 overflow-y-auto">
              {chatMessages.map((message) => (
                <div key={message.id} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{message.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString('ar-SA')}
                    </span>
                  </div>
                  <p className="text-sm">{message.message}</p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="اكتب رسالة..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button size="icon" variant="ghost">
                <Smile className="w-4 h-4" />
              </Button>
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="voice" className="flex-1 space-y-4">
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground">
                حالة الصوت
              </div>
              
              <div className="flex justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant={isDeafened ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsDeafened(!isDeafened)}
                >
                  {isDeafened ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  {isMuted ? 'الميكروفون مكتوم' : 'الميكروفون مفتوح'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isDeafened ? 'الصوت مكتوم' : 'الصوت مفتوح'}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCollaborationPanel;