import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Settings, 
  Clock,
  Star,
  MoreHorizontal,
  Users,
  Play
} from 'lucide-react';

interface MiroTopToolbarProps {
  projectId: string;
  onShare: () => void;
  onExport: () => void;
  onSettings: () => void;
}

export const MiroTopToolbar: React.FC<MiroTopToolbarProps> = ({
  projectId,
  onShare,
  onExport,
  onSettings
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[60px] bg-white border-b border-border flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Input
            value="لوحة التخطيط التشاركي"
            className="text-lg font-semibold bg-transparent border-none shadow-none focus-visible:ring-0 min-w-[200px]"
            dir="rtl"
          />
          <Button variant="ghost" size="sm">
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Clock className="w-4 h-4 mr-2" />
          حُفظ منذ دقيقة
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          مشاركة
        </Button>
        
        <Button variant="ghost" size="sm">
          <Users className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm">
          <Play className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={onExport}>
          <Download className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" onClick={onSettings}>
          <Settings className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            أح
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};