import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  PenTool, 
  User, 
  Clock, 
  Pin, 
  Edit, 
  Trash2,
  Reply,
  MoreHorizontal,
  Check,
  X
} from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: {
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: Date;
  isPinned: boolean;
  position?: { x: number; y: number };
  type: 'text' | 'annotation';
  replies?: Comment[];
}

interface CommentPanelProps {
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onToggleCommentMode: () => void;
  isCommentModeActive: boolean;
  comments?: Comment[];
  onUpdateComment?: (id: string, updates: Partial<Comment>) => void;
  onDeleteComment?: (id: string) => void;
  currentUser?: {
    name: string;
    avatar?: string;
    initials: string;
  };
}

export const CommentPanel: React.FC<CommentPanelProps> = ({
  onAddComment,
  onToggleCommentMode,
  isCommentModeActive = false,
  comments = [],
  onUpdateComment,
  onDeleteComment,
  currentUser = { name: 'المستخدم', initials: 'م' }
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [selectedCommentType, setSelectedCommentType] = useState<'text' | 'annotation'>('text');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment({
        text: newComment.trim(),
        author: currentUser,
        isPinned: false,
        type: selectedCommentType
      });
      setNewComment('');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const handleSaveEdit = (commentId: string) => {
    if (onUpdateComment && editText.trim()) {
      onUpdateComment(commentId, { text: editText.trim() });
    }
    setEditingComment(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInMinutes < 1440) return `منذ ${Math.floor(diffInMinutes / 60)} ساعة`;
    return `منذ ${Math.floor(diffInMinutes / 1440)} يوم`;
  };

  const commentTypes = [
    {
      type: 'text' as const,
      name: 'تعليق نصي',
      description: 'تعليق عام على اللوحة',
      icon: MessageSquare
    },
    {
      type: 'annotation' as const,
      name: 'تعليق موضعي',
      description: 'تعليق مرتبط بموقع محدد',
      icon: PenTool
    }
  ];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          التعليقات
          {comments.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {comments.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comment Mode Toggle */}
        <div className="space-y-2">
          <Button
            variant={isCommentModeActive ? "default" : "outline"}
            className="w-full"
            onClick={onToggleCommentMode}
          >
            <PenTool className="w-4 h-4 mr-2" />
            {isCommentModeActive ? 'إيقاف وضع التعليق' : 'تفعيل وضع التعليق'}
          </Button>
          
          {isCommentModeActive && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
              🎯 انقر في أي مكان على اللوحة لإضافة تعليق موضعي
            </div>
          )}
        </div>

        {/* Comment Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">نوع التعليق</label>
          <div className="grid grid-cols-1 gap-2">
            {commentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <Button
                  key={type.type}
                  variant={selectedCommentType === type.type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCommentType(type.type)}
                  className="h-auto p-3 flex items-start gap-2"
                >
                  <Icon className="w-4 h-4 mt-0.5" />
                  <div className="text-left">
                    <div className="text-xs font-medium">{type.name}</div>
                    <div className="text-xs text-muted-foreground">{type.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* New Comment Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">إضافة تعليق جديد</label>
          <Textarea
            placeholder="اكتب تعليقك هنا..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="resize-none"
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="w-full"
            size="sm"
          >
            <Send className="w-4 h-4 mr-2" />
            إضافة تعليق
          </Button>
        </div>

        {/* Comments List */}
        {comments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">التعليقات الحالية</label>
              <Badge variant="outline" className="text-xs">
                {comments.filter(c => c.isPinned).length} مثبت
              </Badge>
            </div>
            
            <ScrollArea className="h-64 w-full">
              <div className="space-y-3 pr-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`border rounded-lg p-3 ${
                      comment.isPinned ? 'bg-yellow-50 border-yellow-200' : 'bg-background'
                    }`}
                  >
                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={comment.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {comment.author.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-medium">{comment.author.name}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(comment.timestamp)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {comment.isPinned && (
                          <Pin className="w-3 h-3 text-yellow-600" />
                        )}
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {comment.type === 'annotation' ? 'موضعي' : 'نصي'}
                        </Badge>
                      </div>
                    </div>

                    {/* Comment Content */}
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="text-xs"
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleSaveEdit(comment.id)}
                            className="h-6 text-xs"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="h-6 text-xs"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs mb-2">{comment.text}</p>
                        
                        {/* Comment Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditComment(comment)}
                            className="h-6 px-2 text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            تعديل
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onUpdateComment?.(comment.id, { isPinned: !comment.isPinned })}
                            className="h-6 px-2 text-xs"
                          >
                            <Pin className="w-3 h-3 mr-1" />
                            {comment.isPinned ? 'إلغاء' : 'تثبيت'}
                          </Button>
                          
                          {onDeleteComment && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDeleteComment(comment.id)}
                              className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              حذف
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                    
                    {/* Position Info for Annotations */}
                    {comment.type === 'annotation' && comment.position && (
                      <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        📍 الموقع: ({Math.round(comment.position.x)}, {Math.round(comment.position.y)})
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">لا توجد تعليقات بعد</p>
            <p className="text-xs">ابدأ بإضافة تعليق أو تفعيل وضع التعليق</p>
          </div>
        )}

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>💬 التعليقات النصية عامة</div>
          <div>🎯 التعليقات الموضعية مرتبطة بمكان</div>
          <div>📌 ثبت التعليقات المهمة</div>
          <div>✏️ انقر مرتين للتعديل السريع</div>
        </div>
      </CardContent>
    </Card>
  );
};