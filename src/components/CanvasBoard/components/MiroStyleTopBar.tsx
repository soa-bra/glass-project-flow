import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Undo2, 
  Redo2, 
  Menu, 
  Search, 
  Share, 
  ZoomIn, 
  ZoomOut,
  MoreHorizontal
} from 'lucide-react';

interface MiroStyleTopBarProps {
  projectName: string;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onShare: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

const collaborators = [
  { id: 1, name: 'أحمد', avatar: '', initials: 'أ' },
  { id: 2, name: 'فاطمة', avatar: '', initials: 'ف' },
  { id: 3, name: 'محمد', avatar: '', initials: 'م' },
  { id: 4, name: 'نور', avatar: '', initials: 'ن' },
];

export const MiroStyleTopBar: React.FC<MiroStyleTopBarProps> = ({
  projectName,
  canUndo,
  canRedo,
  zoom,
  onUndo,
  onRedo,
  onSave,
  onShare,
  onZoomIn,
  onZoomOut,
  onResetZoom
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">{projectName}</span>
        </div>
        
        <Button variant="ghost" size="sm">
          <Menu className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {/* Center Section - History Controls */}
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!canUndo}
          onClick={onUndo}
          className="disabled:opacity-50"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!canRedo}
          onClick={onRedo}
          className="disabled:opacity-50"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        
        <div className="h-6 w-px bg-gray-200 mx-2" />
        
        {/* Zoom Controls */}
        <Button variant="ghost" size="sm" onClick={onZoomOut}>
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onResetZoom}
          className="min-w-16 text-sm"
        >
          {zoom}%
        </Button>
        
        <Button variant="ghost" size="sm" onClick={onZoomIn}>
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* Collaborators */}
        <div className="flex items-center -space-x-2 rtl:space-x-reverse">
          {collaborators.map((collaborator, index) => (
            <Avatar key={collaborator.id} className="w-8 h-8 border-2 border-white">
              <AvatarImage src={collaborator.avatar} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                {collaborator.initials}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white text-xs text-gray-600">
            +3
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
        
        <Button onClick={onShare} className="bg-blue-500 hover:bg-blue-600 text-white">
          <Share className="w-4 h-4 ml-2" />
          مشاركة
        </Button>
      </div>
    </div>
  );
};