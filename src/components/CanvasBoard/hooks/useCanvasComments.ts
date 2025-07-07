import { useState, useCallback } from 'react';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  type: 'text' | 'voice' | 'ai';
  resolved: boolean;
  tags: string[];
}

export const useCanvasComments = (userId: string) => {
  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentPenActive, setIsCommentPenActive] = useState<boolean>(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [collaborators] = useState<string[]>(['محمد', 'فاطمة', 'أحمد']);

  // Comment handlers
  const handleAddComment = useCallback((text: string, type: 'text' | 'voice' | 'ai', tags: string[] = []) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      text,
      author: userId,
      timestamp: new Date(),
      type,
      resolved: false,
      tags
    };
    setComments(prev => [...prev, newComment]);
  }, [userId]);

  const handleResolveComment = useCallback((commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId ? { ...comment, resolved: true } : comment
    ));
  }, []);

  const handleReplyToComment = useCallback((commentId: string, reply: string) => {
    console.log('الرد على التعليق:', commentId, reply);
    // TODO: Implement reply functionality
  }, []);

  return {
    // Comments state
    comments,
    isCommentPenActive,
    isVoiceEnabled,
    collaborators,

    // Comments setters
    setIsCommentPenActive,
    setIsVoiceEnabled,

    // Comment handlers
    handleAddComment,
    handleResolveComment,
    handleReplyToComment,
  };
};