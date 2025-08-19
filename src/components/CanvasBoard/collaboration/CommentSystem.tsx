import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Reply, Heart, MoreHorizontal, Pin, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  position?: { x: number; y: number };
  elementId?: string;
  replies: Comment[];
  likes: string[];
  isPinned: boolean;
  isResolved: boolean;
}

interface CommentSystemProps {
  comments: Comment[];
  currentUserId: string;
  onAddComment: (content: string, position?: { x: number; y: number }, elementId?: string) => void;
  onReplyComment: (commentId: string, content: string) => void;
  onLikeComment: (commentId: string) => void;
  onPinComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onResolveComment: (commentId: string) => void;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({
  comments,
  currentUserId,
  onAddComment,
  onReplyComment,
  onLikeComment,
  onPinComment,
  onDeleteComment,
  onResolveComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'pinned'>('all');

  const filteredComments = comments.filter(comment => {
    switch (filter) {
      case 'unresolved': return !comment.isResolved;
      case 'pinned': return comment.isPinned;
      default: return true;
    }
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }

    onAddComment(newComment.trim());
    setNewComment('');
    toast.success('تم إضافة التعليق');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) {
      toast.error('يرجى كتابة رد');
      return;
    }

    onReplyComment(commentId, replyContent.trim());
    setReplyContent('');
    setReplyingTo(null);
    toast.success('تم إضافة الرد');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  const CommentCard: React.FC<{ comment: Comment; isReply?: boolean }> = ({ 
    comment, 
    isReply = false 
  }) => (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-200 pl-3' : ''}`}>
      <div className={`p-3 rounded-lg border ${
        comment.isPinned ? 'border-yellow-300 bg-yellow-50' : 'bg-white hover:bg-gray-50'
      } ${comment.isResolved ? 'opacity-60' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback className="text-xs">
                {comment.author.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium font-arabic">
                {comment.author.name}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(comment.timestamp)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {comment.isPinned && (
              <Pin className="w-3 h-3 text-yellow-600" />
            )}
            {comment.isResolved && (
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            )}
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="text-sm font-arabic mb-3">
          {comment.content}
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => onLikeComment(comment.id)}
            className={`flex items-center gap-1 hover:text-red-600 ${
              comment.likes.includes(currentUserId) ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            <Heart className={`w-3 h-3 ${
              comment.likes.includes(currentUserId) ? 'fill-current' : ''
            }`} />
            {comment.likes.length}
          </button>

          {!isReply && (
            <button
              onClick={() => setReplyingTo(comment.id)}
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
            >
              <Reply className="w-3 h-3" />
              رد
            </button>
          )}

          {comment.author.id === currentUserId && (
            <>
              <button
                onClick={() => onPinComment(comment.id)}
                className="text-gray-500 hover:text-yellow-600"
              >
                تثبيت
              </button>
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-gray-500 hover:text-red-600"
              >
                حذف
              </button>
            </>
          )}

          {!comment.isResolved && (
            <button
              onClick={() => onResolveComment(comment.id)}
              className="text-gray-500 hover:text-green-600"
            >
              حل
            </button>
          )}
        </div>

        {/* نموذج الرد */}
        {replyingTo === comment.id && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="اكتب ردك..."
              className="font-arabic text-sm resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                onClick={() => handleReply(comment.id)}
                size="sm"
                className="text-xs"
              >
                إرسال
              </Button>
              <Button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                إلغاء
              </Button>
            </div>
          </div>
        )}

        {/* الردود */}
        {comment.replies.length > 0 && (
          <div className="mt-3 space-y-2">
            {comment.replies.map(reply => (
              <CommentCard key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle className="text-lg font-arabic flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          التعليقات ({comments.length})
        </CardTitle>
        
        {/* فلاتر */}
        <div className="flex gap-1 mt-2">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'unresolved', label: 'غير محلولة' },
            { id: 'pinned', label: 'مثبتة' }
          ].map(filterOption => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-arabic transition-colors ${
                filter === filterOption.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* إضافة تعليق جديد */}
          <div className="space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="أضف تعليقاً..."
              className="font-arabic resize-none"
              rows={3}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full rounded-full"
            >
              <Send className="w-4 h-4 mr-2" />
              إضافة تعليق
            </Button>
          </div>

          {/* قائمة التعليقات */}
          <div className="max-h-80 overflow-y-auto space-y-3">
            {sortedComments.length === 0 ? (
              <div className="text-center text-gray-500 font-arabic py-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                لا توجد تعليقات بعد
              </div>
            ) : (
              sortedComments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            )}
          </div>

          {/* إحصائيات */}
          <div className="border-t pt-3 text-xs text-gray-500 font-arabic space-y-1">
            <div className="flex justify-between">
              <span>إجمالي التعليقات:</span>
              <span>{comments.length}</span>
            </div>
            <div className="flex justify-between">
              <span>غير محلولة:</span>
              <span>{comments.filter(c => !c.isResolved).length}</span>
            </div>
            <div className="flex justify-between">
              <span>مثبتة:</span>
              <span>{comments.filter(c => c.isPinned).length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};