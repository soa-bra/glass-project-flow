import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Send, 
  Clock, 
  Check, 
  X,
  UserPlus,
  Share,
  Eye,
  Edit,
  Crown,
  Dot
} from 'lucide-react';
import { CollaborationUser, CanvasComment } from '../types/index';

interface CollaborationPanelProps {
  isVisible: boolean;
  onToggle: () => void;
  users: CollaborationUser[];
  comments: CanvasComment[];
  onInviteUser: (email: string) => void;
  onAddComment: (content: string, position?: { x: number; y: number }) => void;
  onResolveComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
  onShareCanvas: () => void;
  currentUserId: string;
}

const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  isVisible,
  onToggle,
  users,
  comments,
  onInviteUser,
  onAddComment,
  onResolveComment,
  onReplyToComment,
  onShareCanvas,
  currentUserId
}) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleInviteUser = () => {
    if (inviteEmail.trim()) {
      onInviteUser(inviteEmail);
      setInviteEmail('');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReplyToComment(commentId, replyContent);
      setReplyingTo(null);
      setReplyContent('');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'editor': return Edit;
      case 'viewer': return Eye;
      default: return Eye;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-yellow-600';
      case 'editor': return 'text-blue-600';
      case 'viewer': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير';
      case 'editor': return 'محرر';
      case 'viewer': return 'مشاهد';
      default: return 'مشاهد';
    }
  };

  const unresolvedComments = comments.filter(comment => !comment.resolved);
  const resolvedComments = comments.filter(comment => comment.resolved);

  if (!isVisible) return null;

  return (
    <Card className="w-80 h-[600px] flex flex-col bg-background/95 backdrop-blur-sm border shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          التعاون
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="ml-auto p-1 h-6 w-6"
          >
            <X className="w-3 h-3" />
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        <Tabs defaultValue="users" className="flex-1">
          <TabsList className="grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="users" className="text-xs">المستخدمون</TabsTrigger>
            <TabsTrigger value="comments" className="text-xs">
              التعليقات
              {unresolvedComments.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0.5">
                  {unresolvedComments.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <TabsContent value="users" className="space-y-4 mt-0">
              {/* Invite User */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">دعوة مستخدم جديد</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="البريد الإلكتروني"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleInviteUser();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleInviteUser}
                    disabled={!inviteEmail.trim()}
                  >
                    <UserPlus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Active Users */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">المستخدمون النشطون</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onShareCanvas}
                    className="text-xs"
                  >
                    <Share className="w-3 h-3 mr-1" />
                    مشاركة
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {users.map((user) => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <div key={user.id} className="flex items-center gap-2 p-2 rounded border">
                        <div className="relative">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <Dot className="absolute -top-1 -right-1 w-3 h-3 text-green-500" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                            {user.id === currentUserId && (
                              <span className="text-xs text-muted-foreground ml-1">(أنت)</span>
                            )}
                          </p>
                          <div className="flex items-center gap-1">
                            <RoleIcon className={`w-3 h-3 ${getRoleColor(user.role)}`} />
                            <span className="text-xs text-muted-foreground">
                              {getRoleLabel(user.role)}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {user.isOnline ? (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              متصل
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              غير متصل
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comments" className="space-y-4 mt-0">
              {/* Add Comment */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">إضافة تعليق</h4>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="اكتب تعليقًا..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="resize-none text-sm"
                    rows={2}
                  />
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="self-end"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Unresolved Comments */}
              {unresolvedComments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">التعليقات المفتوحة</h4>
                  <div className="space-y-3">
                    {unresolvedComments.map((comment) => (
                      <Card key={comment.id} className="p-3">
                        <div className="flex items-start gap-2 mb-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback className="text-xs">
                              {comment.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium truncate">
                                {comment.author.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {comment.timestamp.toLocaleTimeString('ar-SA')}
                              </span>
                            </div>
                            <p className="text-xs">{comment.content}</p>
                          </div>
                        </div>

                        {/* Comment Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onResolveComment(comment.id)}
                            className="text-xs"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            حل
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-xs"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            رد
                          </Button>
                        </div>

                        {/* Reply Input */}
                        {replyingTo === comment.id && (
                          <div className="mt-2 flex gap-2">
                            <Input
                              placeholder="اكتب ردًا..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="text-xs"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleReply(comment.id);
                                }
                                if (e.key === 'Escape') {
                                  setReplyingTo(null);
                                  setReplyContent('');
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyContent.trim()}
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-2 space-y-2 border-r-2 border-muted pr-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-2">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={reply.author.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {reply.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium truncate">
                                      {reply.author.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {reply.timestamp.toLocaleTimeString('ar-SA')}
                                    </span>
                                  </div>
                                  <p className="text-xs">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolved Comments */}
              {resolvedComments.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Check className="w-3 h-3 text-green-600" />
                    التعليقات المحلولة
                  </h4>
                  <div className="space-y-2 opacity-60">
                    {resolvedComments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2 p-2 rounded border">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium truncate">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp.toLocaleTimeString('ar-SA')}
                            </span>
                          </div>
                          <p className="text-xs line-through">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comments.length === 0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>لا توجد تعليقات حاليًا</p>
                  <p className="text-xs mt-1">أضف تعليقًا لبدء النقاش</p>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CollaborationPanel;