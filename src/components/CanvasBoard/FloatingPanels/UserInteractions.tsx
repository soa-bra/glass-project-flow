import React from 'react';
import { MessageSquare, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UserCursorProps {
  username: string;
  fullName: string;
  color: string;
  x: number;
  y: number;
  onComment?: () => void;
}

export const UserCursor: React.FC<UserCursorProps> = ({
  username, fullName, color, x, y, onComment
}) => (
  <div 
    className="fixed pointer-events-none z-50" 
    style={{ left: x, top: y, color }}
  >
    <div className="flex items-center gap-2">
      <div className="bg-soabra-new-canvas-floating-panels p-2 rounded-lg shadow-sm border pointer-events-auto">
        <span className="text-xs font-medium text-soabra-new-canvas-text">{fullName}</span>
        <Button size="sm" variant="ghost" onClick={onComment} className="p-1 h-6 w-6">
          <MessageSquare className="w-3 h-3" />
        </Button>
      </div>
    </div>
  </div>
);

interface ElementBeingEditedProps {
  elementId: string;
  lockedBy: string;
  color: string;
  onRequestAccess?: () => void;
}

export const ElementBeingEdited: React.FC<ElementBeingEditedProps> = ({
  elementId, lockedBy, color, onRequestAccess
}) => (
  <div className="absolute inset-0 border-2 rounded-lg pointer-events-none" style={{ borderColor: color }}>
    <div className="absolute -top-8 left-0 pointer-events-auto">
      <Card className="bg-soabra-new-canvas-floating-panels p-2 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 text-xs">
          <Lock className="w-3 h-3" />
          <span className="text-soabra-new-canvas-text">قيد التحرير من {lockedBy}</span>
          <Button size="sm" variant="outline" onClick={onRequestAccess} className="text-xs p-1">
            طلب وصول
          </Button>
        </div>
      </Card>
    </div>
  </div>
);

interface CommentBubbleProps {
  text: string;
  author: string;
  replies?: Array<{ author: string; text: string }>;
  onReply?: (reply: string) => void;
}

export const CommentBubble: React.FC<CommentBubbleProps> = ({
  text, author, replies = [], onReply
}) => (
  <div className="absolute bg-soabra-new-canvas-floating-panels p-3 rounded-2xl shadow-lg max-w-64 z-40">
    <div className="space-y-2">
      <div>
        <p className="text-xs font-medium text-soabra-new-canvas-text">{author}</p>
        <p className="text-sm text-soabra-new-canvas-text">{text}</p>
      </div>
      
      {replies.length > 0 && (
        <div className="space-y-1 border-t pt-2">
          {replies.map((reply, index) => (
            <div key={index} className="text-xs">
              <span className="font-medium">{reply.author}:</span>
              <span className="text-soabra-new-canvas-text mr-1">{reply.text}</span>
            </div>
          ))}
        </div>
      )}
      
      <Button size="sm" variant="outline" className="w-full text-xs rounded-xl">
        رد
      </Button>
    </div>
  </div>
);