import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send,
  Reply,
  Edit,
  Check,
  X,
  Pin,
  MoreHorizontal,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Star,
  Flag,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  Plus,
  Pencil,
  MapPin,
  Users,
  Tag,
  Calendar,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorId: string;
  timestamp: Date;
  position?: { x: number; y: number };
  elementId?: string;
  status: 'active' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  replies: Comment[];
  isPinned?: boolean;
  isPrivate?: boolean;
  mentions?: string[];
}

interface EnhancedCommentPanelProps {
  comments?: Comment[];
  currentUserId?: string;
  onAddComment?: (comment: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => void;
  onUpdateComment?: (commentId: string, updates: Partial<Comment>) => void;
  onDeleteComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, reply: string) => void;
  selectedElementId?: string;
}

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'يحتاج هذا العنصر إلى تعديل في اللون',
    author: 'أحمد محمد',
    authorId: 'user1',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
    priority: 'medium',
    tags: ['تصميم', 'ألوان'],
    replies: [
      {
        id: '1-1',
        content: 'موافق، سأقوم بتغييره إلى الأزرق',
        author: 'سارة أحمد',
        authorId: 'user2',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'active',
        priority: 'low',
        tags: [],
        replies: []
      }
    ],
    isPinned: true
  },
  {
    id: '2',
    content: 'تم الانتهاء من هذا القسم',
    author: 'سارة أحمد',
    authorId: 'user2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    status: 'resolved',
    priority: 'low',
    tags: ['مكتمل'],
    replies: [],
    position: { x: 100, y: 200 }
  }
];

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
};

const statusIcons = {
  active: Clock,
  resolved: CheckCircle,
  pending: AlertCircle
};

export const EnhancedCommentPanel: React.FC<EnhancedCommentPanelProps> = ({
  comments = mockComments,
  currentUserId = 'user1',
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onReplyToComment,
  selectedElementId
}) => {
  const [activeTab, setActiveTab] = useState('list');
  const [newComment, setNewComment] = useState('');
  const [commentPriority, setCommentPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [commentTags, setCommentTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Filter comments
  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || comment.status === filterStatus;
    const matchesElement = !selectedElementId || comment.elementId === selectedElementId;
    
    return matchesSearch && matchesStatus && matchesElement;
  });

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment({
        content: newComment,
        author: 'المستخدم الحالي',
        authorId: currentUserId,
        status: 'active',
        priority: commentPriority,
        tags: commentTags,
        elementId: selectedElementId,
        isPrivate: false
      });
      setNewComment('');
      setCommentTags([]);
      toast.success('تم إضافة التعليق');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyText.trim() && onReplyToComment) {
      onReplyToComment(commentId, replyText);
      setReplyText('');
      setReplyingTo(null);
      toast.success('تم إضافة الرد');
    }
  };

  const handleStatusChange = (commentId: string, status: Comment['status']) => {
    if (onUpdateComment) {
      onUpdateComment(commentId, { status });
      toast.success(`تم تغيير حالة التعليق إلى ${status === 'resolved' ? 'محلول' : status === 'pending' ? 'في الانتظار' : 'نشط'}`);
    }
  };

  const togglePin = (commentId: string, isPinned: boolean) => {
    if (onUpdateComment) {
      onUpdateComment(commentId, { isPinned: !isPinned });
      toast.success(isPinned ? 'تم إلغاء تثبيت التعليق' : 'تم تثبيت التعليق');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  return (
    <Card className="h-full flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          التعليقات والملاحظات
          <Badge variant="secondary" className="text-xs">
            {filteredComments.length}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-3">
            <TabsTrigger value="list" className="text-xs">قائمة</TabsTrigger>
            <TabsTrigger value="add" className="text-xs">إضافة</TabsTrigger>
            <TabsTrigger value="draw" className="text-xs">رسم</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-auto">
            <TabsContent value="list" className="mt-0 flex flex-col h-full">
              {/* Search and Filter */}
              <div className="space-y-2 mb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <Input
                    placeholder="البحث في التعليقات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-8 text-xs"
                  />
                </div>

                <div className="flex gap-1">
                  {['all', 'active', 'pending', 'resolved'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={filterStatus === status ? 'default' : 'outline'}
                      onClick={() => setFilterStatus(status as any)}
                      className="text-xs"
                    >
                      {status === 'all' ? 'الكل' :
                       status === 'active' ? 'نشط' :
                       status === 'pending' ? 'انتظار' : 'محلول'}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="mb-3" />

              {/* Comments List */}
              <ScrollArea className="flex-1">
                <div className="space-y-3">
                  {filteredComments.map((comment) => {
                    const StatusIcon = statusIcons[comment.status];
                    return (
                      <Card key={comment.id} className="p-3 border-border/50">
                        <div className="space-y-2">
                          {/* Comment Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {comment.author.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-xs font-medium">{comment.author}</span>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatTimeAgo(comment.timestamp)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              {comment.isPinned && (
                                <Pin className="w-3 h-3 text-primary" />
                              )}
                              <StatusIcon className="w-3 h-3" />
                            </div>
                          </div>

                          {/* Comment Content */}
                          <p className="text-sm">{comment.content}</p>

                          {/* Comment Meta */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${priorityColors[comment.priority]}`}
                            >
                              {comment.priority === 'high' ? 'عالية' :
                               comment.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                            </Badge>
                            
                            {comment.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-2 h-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}

                            {comment.position && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-2 h-2 mr-1" />
                                موضع
                              </Badge>
                            )}
                          </div>

                          {/* Comment Actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReplyingTo(comment.id)}
                              className="text-xs h-6"
                            >
                              <Reply className="w-3 h-3 mr-1" />
                              رد
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePin(comment.id, comment.isPinned || false)}
                              className="text-xs h-6"
                            >
                              <Pin className="w-3 h-3 mr-1" />
                              {comment.isPinned ? 'إلغاء تثبيت' : 'تثبيت'}
                            </Button>

                            {comment.status !== 'resolved' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStatusChange(comment.id, 'resolved')}
                                className="text-xs h-6"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                حل
                              </Button>
                            )}
                          </div>

                          {/* Reply Form */}
                          {replyingTo === comment.id && (
                            <div className="space-y-2 pt-2 border-t">
                              <Textarea
                                placeholder="اكتب ردك..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                className="min-h-[60px] text-xs"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleReply(comment.id)}
                                  className="text-xs"
                                >
                                  <Send className="w-3 h-3 mr-1" />
                                  إرسال
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setReplyingTo(null)}
                                  className="text-xs"
                                >
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Replies */}
                          {comment.replies.length > 0 && (
                            <div className="space-y-2 pt-2 border-t ml-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="w-4 h-4">
                                      <AvatarFallback className="text-xs">
                                        {reply.author.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-medium">{reply.author}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {formatTimeAgo(reply.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-muted-foreground ml-6">
                                    {reply.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {filteredComments.length === 0 && (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      لا توجد تعليقات
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="add" className="mt-0 space-y-4">
              {/* Add Comment Form */}
              <div>
                <Label className="text-xs font-medium mb-2 block">تعليق جديد</Label>
                <Textarea
                  placeholder="اكتب تعليقك هنا..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
              </div>

              {/* Priority Selection */}
              <div>
                <Label className="text-xs font-medium mb-2 block">الأولوية</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <Button
                      key={priority}
                      size="sm"
                      variant={commentPriority === priority ? 'default' : 'outline'}
                      onClick={() => setCommentPriority(priority)}
                      className="text-xs"
                    >
                      {priority === 'high' ? 'عالية' :
                       priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label className="text-xs font-medium mb-2 block">العلامات</Label>
                <Input
                  placeholder="أضف علامات (مفصولة بفواصل)"
                  onChange={(e) => setCommentTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
                  className="h-8 text-xs"
                />
                <div className="flex gap-1 mt-2 flex-wrap">
                  {commentTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Add Button */}
              <Button
                onClick={handleAddComment}
                className="w-full text-xs"
                disabled={!newComment.trim()}
              >
                <Plus className="w-3 h-3 mr-2" />
                إضافة التعليق
              </Button>
            </TabsContent>

            <TabsContent value="draw" className="mt-0 space-y-4">
              {/* Drawing Tools for Visual Comments */}
              <div className="text-center">
                <Label className="text-xs font-medium mb-2 block">أدوات الرسم التوضيحي</Label>
                <p className="text-xs text-muted-foreground mb-4">
                  استخدم أدوات الرسم لإضافة تعليقات بصرية
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={isDrawingMode ? 'default' : 'outline'}
                    onClick={() => setIsDrawingMode(!isDrawingMode)}
                    className="text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    وضع الرسم
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    أسهم توضيحية
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    فقاعات نص
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    إبراز
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">
                  انقر على الكانفاس لإضافة تعليق مرئي
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};