
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, X, Plus, Share2 } from 'lucide-react';

interface CollaborationPanelProps {
  onClose: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  onClose
}) => {
  const collaborators = [
    { id: '1', name: 'أحمد محمد', isOnline: true, role: 'محرر' },
    { id: '2', name: 'فاطمة علي', isOnline: false, role: 'مشاهد' },
    { id: '3', name: 'محمد سالم', isOnline: true, role: 'محرر' }
  ];

  return (
    <Card className="w-72 shadow-xl border animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-green-600" />
            التعاون
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Share Button */}
        <Button className="w-full" size="sm">
          <Share2 className="w-3 h-3 mr-2" />
          مشاركة المشروع
        </Button>

        {/* Invite */}
        <div className="space-y-2">
          <label className="text-xs font-medium">دعوة مستخدم</label>
          <div className="flex gap-2">
            <Input
              placeholder="البريد الإلكتروني"
              className="text-xs"
            />
            <Button size="sm">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Collaborators List */}
        <div className="space-y-2">
          <label className="text-xs font-medium">المتعاونون ({collaborators.length})</label>
          <div className="space-y-2">
            {collaborators.map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.role}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      user.isOnline ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    {user.isOnline ? 'متصل' : 'غير متصل'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
