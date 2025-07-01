
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Mic, 
  Video, 
  Users, 
  Send,
  Phone,
  Share2,
  Eye,
  UserPlus,
  Volume2,
  Camera
} from 'lucide-react';
import { PlanningSession } from './CollaborativePlanningModule';

interface CollaborationToolsProps {
  session: PlanningSession;
  participants: string[];
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  type: 'text' | 'voice' | 'system';
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  role: 'facilitator' | 'participant' | 'observer';
  cursor?: { x: number; y: number };
}

export const CollaborationTools: React.FC<CollaborationToolsProps> = ({
  session,
  participants
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      user: 'أحمد المطيري',
      message: 'مرحباً بالجميع في جلسة التخطيط',
      timestamp: '10:30',
      type: 'text'
    },
    {
      id: '2',
      user: 'النظام',
      message: 'انضمت فاطمة الزهراني للجلسة',
      timestamp: '10:32',
      type: 'system'
    },
    {
      id: '3',
      user: 'فاطمة الزهراني',
      message: 'شكراً لكم، متحمسة للمشاركة!',
      timestamp: '10:33',
      type: 'text'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: 'أحمد المطيري',
      status: 'online',
      role: 'facilitator',
      cursor: { x: 150, y: 200 }
    },
    {
      id: '2',
      name: 'فاطمة الزهراني',
      status: 'online',
      role: 'participant',
      cursor: { x: 300, y: 150 }
    },
    {
      id: '3',
      name: 'محمد الشريف',
      status: 'away',
      role: 'participant'
    },
    {
      id: '4',
      name: 'سارة أحمد',
      status: 'online',
      role: 'observer'
    }
  ];

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        user: 'أنت',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString('ar-SA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: 'text'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const toggleVoiceRecording = () => {
    setIsVoiceRecording(!isVoiceRecording);
    if (!isVoiceRecording) {
      // Start recording logic
      setTimeout(() => {
        const voiceMessage: ChatMessage = {
          id: Date.now().toString(),
          user: 'أنت',
          message: 'رسالة صوتية (30 ثانية)',
          timestamp: new Date().toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          type: 'voice'
        };
        setChatMessages(prev => [...prev, voiceMessage]);
        setIsVoiceRecording(false);
      }, 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'facilitator': return 'text-blue-600 bg-blue-100';
      case 'participant': return 'text-green-600 bg-green-100';
      case 'observer': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Participants Panel */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              المشاركون ({mockParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockParticipants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(participant.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{participant.name}</div>
                    <Badge variant="secondary" className={`text-xs ${getRoleColor(participant.role)}`}>
                      {participant.role === 'facilitator' ? 'مسهل' :
                       participant.role === 'participant' ? 'مشارك' : 'مراقب'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {participant.status === 'online' && (
                      <>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Mic className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Video className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                دعوة مشاركين
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Communication Controls */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">أدوات التواصل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant={isVideoCall ? "destructive" : "default"}
                onClick={() => setIsVideoCall(!isVideoCall)}
                className="flex items-center gap-2"
              >
                <Video className="h-4 w-4" />
                {isVideoCall ? 'إنهاء' : 'فيديو'}
              </Button>
              
              <Button variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                مكالمة
              </Button>
              
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                مشاركة
              </Button>
              
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                عرض
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Panel */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              الدردشة المباشرة
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-96">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.user === 'أنت' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                    message.user === 'أنت' 
                      ? 'bg-blue-500 text-white' 
                      : message.type === 'system'
                      ? 'bg-gray-100 text-gray-600 text-center'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.type !== 'system' && (
                      <div className="text-xs opacity-75 mb-1">{message.user}</div>
                    )}
                    <div className={`text-sm ${message.type === 'voice' ? 'flex items-center gap-2' : ''}`}>
                      {message.type === 'voice' && <Volume2 className="h-4 w-4" />}
                      {message.message}
                    </div>
                    <div className="text-xs opacity-75 mt-1">{message.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="اكتب رسالة..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              
              <Button
                variant={isVoiceRecording ? "destructive" : "outline"}
                onClick={toggleVoiceRecording}
                className="px-3"
              >
                <Mic className={`h-4 w-4 ${isVoiceRecording ? 'animate-pulse' : ''}`} />
              </Button>
              
              <Button variant="outline" className="px-3">
                <Camera className="h-4 w-4" />
              </Button>
              
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
