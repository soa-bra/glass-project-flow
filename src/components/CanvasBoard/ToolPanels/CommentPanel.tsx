import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Plus, 
  Reply, 
  Edit, 
  Trash2, 
  Pin, 
  Clock,
  User,
  Check,
  X
} from 'lucide-react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  position: { x: number; y: number };
  isPinned: boolean;
  replies?: Comment[];
}

interface CommentPanelProps {
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  onUpdateComment: (id: string, updates: Partial<Comment>) => void;
  onDeleteComment: (id: string) => void;
  onReplyComment: (parentId: string, reply: Omit<Comment, 'id' | 'timestamp'>) => void;
  currentUser: string;
  isAddingComment: boolean;
  onToggleAddComment: () => void;
}

export const CommentPanel: React.FC<CommentPanelProps> = ({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onReplyComment,
  currentUser = 'المستخدم الحالي',
  isAddingComment,
  onToggleAddComment
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  const handleAddComment = () => {
    if (newCommentText.trim()) {
      onAddComment({
        text: newCommentText,
        author: currentUser,
        position: { x: 100, y: 100 },
        isPinned: false
      });
      setNewCommentText('');
      onToggleAddComment();
    }
  };

  const handleReply = (parentId: string) => {
    if (replyText.trim()) {
      onReplyComment(parentId, {
        text: replyText,
        author: currentUser,
        position: { x: 0, y: 0 },
        isPinned: false
      });
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const handleEdit = (commentId: string) => {
    if (editText.trim()) {
      onUpdateComment(commentId, { text: editText });
      setEditingComment(null);
      setEditText('');
    }
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          التعليقات
          <BaseBadge variant="secondary">{comments.length}</BaseBadge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Button */}
        <Button
          variant={isAddingComment ? "default" : "outline"}
          onClick={onToggleAddComment}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isAddingComment ? 'إلغاء' : 'إضافة تعليق'}
        </Button>

        {/* New Comment Form */}
        {isAddingComment && (
          <div className="space-y-2 p-3 border rounded-lg bg-muted/50">
            <Textarea
              placeholder="اكتب تعليقك هنا..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddComment}>
                <Check className="w-4 h-4 mr-1" />
                إضافة
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setNewCommentText('');
                  onToggleAddComment();
                }}
              >
                <X className="w-4 h-4 mr-1" />
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد تعليقات حتى الآن</p>
              <p className="text-xs text-muted-foreground">انقر على "إضافة تعليق" للبدء</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3 space-y-2">
                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {comment.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{comment.author}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(comment.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {comment.isPinned && (
                      <Pin className="w-3 h-3 text-orange-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdateComment(comment.id, { isPinned: !comment.isPinned })}
                      className="h-6 w-6 p-0"
                    >
                      <Pin className={`w-3 h-3 ${comment.isPinned ? 'text-orange-500' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                </div>

                {/* Comment Content */}
                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(comment.id)}>
                        <Check className="w-3 h-3 mr-1" />
                        حفظ
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setEditingComment(null);
                          setEditText('');
                        }}
                      >
                        <X className="w-3 h-3 mr-1" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">{comment.text}</p>
                )}

                {/* Comment Actions */}
                {editingComment !== comment.id && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(comment.id)}
                      className="h-7 text-xs"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      رد
                    </Button>
                    
                    {comment.author === currentUser && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(comment)}
                          className="h-7 text-xs"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteComment(comment.id)}
                          className="h-7 text-xs text-destructive"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          حذف
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === comment.id && (
                  <div className="mt-2 space-y-2 p-2 bg-muted/30 rounded border-l-2 border-primary">
                    <Textarea
                      placeholder="اكتب ردك هنا..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleReply(comment.id)}>
                        <Check className="w-3 h-3 mr-1" />
                        رد
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        <X className="w-3 h-3 mr-1" />
                        إلغاء
                      </Button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-muted/30 rounded p-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xs">
                              {reply.author[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Comment Stats */}
        {comments.length > 0 && (
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <div>💬 المجموع: {comments.length} تعليق</div>
            <div>📌 مثبت: {comments.filter(c => c.isPinned).length}</div>
            <div>👤 بواسطتك: {comments.filter(c => c.author === currentUser).length}</div>
          </div>
        )}

        {/* Usage Tips */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <div>💡 انقر على اللوحة لإضافة تعليق في موقع محدد</div>
          <div>📌 ثبت التعليقات المهمة</div>
          <div>💬 رد على التعليقات للحوار</div>
        </div>
      </CardContent>
    </Card>
  );
};