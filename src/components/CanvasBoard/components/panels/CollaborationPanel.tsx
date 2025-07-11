
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Users, MessageCircle, Share2, UserPlus, Clock } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  role: 'owner' | 'editor' | 'viewer';
  lastActive: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
  resolved: boolean;
}

export const CollaborationPanel: React.FC = () => {
  const [collaborators] = useState<Collaborator[]>([
    { id: '1', name: 'أحمد محمد', isOnline: true, role: 'owner', lastActive: 'الآن' },
    { id: '2', name: 'فاطمة علي', isOnline: true, role: 'editor', lastActive: 'منذ 5 دقائق' },
    { id: '3', name: 'سارة أحمد', isOnline: false, role: 'viewer', lastActive: 'منذ ساعة' }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'أحمد محمد',
      text: 'يمكننا تحسين هذا التصميم بإضافة المزيد من الألوان',
      timestamp: new Date(Date.now() - 300000),
      resolved: false
    },
    {
      id: '2',
      author: 'فاطمة علي',
      text: 'ممتاز! التخطيط يبدو رائعاً',
      timestamp: new Date(Date.now() - 600000),
      resolved: true
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    // Add comment logic here
    setNewComment('');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'text-[#f1b5b9]';
      case 'editor': return 'text-[#96d8d0]';
      case 'viewer': return 'text-black/60';
      default: return 'text-black/60';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'مالك';
      case 'editor': return 'محرر';
      case 'viewer': return 'مشاهد';
      default: return 'مستخدم';
    }
  };

  return (
    <Card className="w-full h-full bg-[#f2f9fb]/95 backdrop-blur-xl shadow-sm border border-white/20 rounded-[32px] overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-arabic flex items-center gap-2 text-black">
          <Users className="w-5 h-5 text-[#96d8d0]" />
          التعاون
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[calc(100%-4rem)]">
        {/* Collaborators Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium font-arabic text-black">المتعاونون ({collaborators.length})</h4>
            <Button size="sm" className="rounded-[12px] bg-[#bdeed3] hover:bg-[#bdeed3]/80 text-black border-none">
              <UserPlus className="w-3 h-3 mr-1" />
              دعوة
            </Button>
          </div>
          
          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="flex items-center gap-3 p-2 rounded-[12px] bg-white border border-[#d1e1ea]">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback className="text-xs bg-[#a4e2f6] text-black">
                      {collaborator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {collaborator.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-arabic font-medium text-black truncate">
                    {collaborator.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-arabic ${getRoleColor(collaborator.role)}`}>
                      {getRoleLabel(collaborator.role)}
                    </span>
                    <span className="text-xs text-black/50 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {collaborator.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-[#d1e1ea] mb-4" />

        {/* Comments Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-[#96d8d0]" />
            <h4 className="text-sm font-medium font-arabic text-black">التعليقات ({comments.length})</h4>
          </div>
          
          <ScrollArea className="flex-1 mb-3">
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className={`p-3 rounded-[12px] border ${
                  comment.resolved 
                    ? 'bg-[#bdeed3]/30 border-[#bdeed3]/50' 
                    : 'bg-white border-[#d1e1ea]'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-arabic font-medium text-black">
                      {comment.author}
                    </span>
                    <span className="text-xs text-black/50">
                      {comment.timestamp.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm font-arabic text-black mb-2">{comment.text}</p>
                  {comment.resolved && (
                    <div className="text-xs text-[#bdeed3] font-arabic">✓ تم الحل</div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Add Comment */}
          <div className="flex gap-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="أضف تعليقاً..."
              className="flex-1 font-arabic text-sm rounded-[12px] border-[#d1e1ea] text-black placeholder:text-black/50"
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <Button
              onClick={handleAddComment}
              size="sm"
              className="rounded-[12px] bg-[#96d8d0] hover:bg-[#96d8d0]/80 text-black border-none"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator className="bg-[#d1e1ea] my-3" />

        {/* Share Project */}
        <Button className="w-full rounded-[16px] bg-[#a4e2f6] hover:bg-[#a4e2f6]/80 text-black border-none">
          <Share2 className="w-4 h-4 mr-2" />
          مشاركة المشروع
        </Button>
      </CardContent>
    </Card>
  );
};
