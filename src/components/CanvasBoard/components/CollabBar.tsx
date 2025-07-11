import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Share, MessageSquare } from 'lucide-react';

interface CollabUser {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  role: 'viewer' | 'editor' | 'admin';
}

const mockUsers: CollabUser[] = [
  { id: '1', name: 'أحمد محمد', isOnline: true, role: 'admin' },
  { id: '2', name: 'فاطمة العلي', isOnline: true, role: 'editor' },
  { id: '3', name: 'خالد السعد', isOnline: false, role: 'viewer' }
];

export const CollabBar: React.FC = () => {
  return (
    <div className="flex items-center gap-3 p-2 bg-background/95 backdrop-blur rounded-lg border shadow-sm">
      {/* Online users */}
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <div className="flex -space-x-2">
          {mockUsers.slice(0, 3).map((user) => (
            <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
        <Badge variant="secondary" className="text-xs">
          {mockUsers.filter(u => u.isOnline).length} متصل
        </Badge>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8">
          <Share className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};