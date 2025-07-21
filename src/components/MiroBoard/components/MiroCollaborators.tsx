import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

interface MiroCollaboratorsProps {
  projectId: string;
  users: User[];
}

export const MiroCollaborators: React.FC<MiroCollaboratorsProps> = ({
  projectId,
  users
}) => {
  return (
    <div className="fixed top-16 right-4 z-30 bg-white rounded-lg shadow-md border border-border p-2">
      <div className="flex items-center gap-2">
        {/* Online users */}
        {users.slice(0, 5).map((user) => (
          <div key={user.id} className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
        ))}

        {/* Show more indicator */}
        {users.length > 5 && (
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            +{users.length - 5}
          </div>
        )}

        {/* Invite button */}
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <Plus className="w-4 h-4" />
        </Button>

        {/* Users list button */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Users className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};