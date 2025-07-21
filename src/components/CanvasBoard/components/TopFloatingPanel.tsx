import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MessageSquare, 
  Download, 
  Upload, 
  Save, 
  Settings, 
  Grid,
  Map,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Participant } from '../types/enhanced';

interface TopFloatingPanelProps {
  participants: Participant[];
  onInviteParticipant: () => void;
  onExport: (format: 'pdf' | 'png' | 'svg') => void;
  onSave: () => void;
  onUpload: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  showMiniMap: boolean;
  onToggleMiniMap: () => void;
}

export const TopFloatingPanel: React.FC<TopFloatingPanelProps> = ({
  participants,
  onInviteParticipant,
  onExport,
  onSave,
  onUpload,
  showGrid,
  onToggleGrid,
  snapEnabled,
  onToggleSnap,
  theme,
  onToggleTheme,
  showMiniMap,
  onToggleMiniMap
}) => {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const onlineParticipants = participants.filter(p => p.isOnline);

  return (
    <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
      <div className="flex justify-between items-start gap-4">
        {/* Left Section - Participants */}
        <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-2xl pointer-events-auto">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium">{onlineParticipants.length}</span>
            </div>
            
            <div className="flex -space-x-2">
              {onlineParticipants.slice(0, 4).map((participant) => (
                <Avatar key={participant.id} className="w-8 h-8 ring-2 ring-white">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-xs">
                    {participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {onlineParticipants.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{onlineParticipants.length - 4}</span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onInviteParticipant}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              دعوة
            </Button>
          </CardContent>
        </Card>

        {/* Center Section - Mini Map Toggle */}
        <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-2xl pointer-events-auto">
          <CardContent className="p-3">
            <Button
              variant={showMiniMap ? "default" : "ghost"}
              size="sm"
              onClick={onToggleMiniMap}
              className="flex items-center gap-2"
            >
              <Map className="w-4 h-4" />
              <span className="text-sm">الخريطة المصغرة</span>
            </Button>
          </CardContent>
        </Card>

        {/* Right Section - Tools & Settings */}
        <Card className="bg-white/95 backdrop-blur-lg shadow-sm border border-gray-200/50 rounded-2xl pointer-events-auto">
          <CardContent className="flex items-center gap-2 p-3">
            {/* AI Chat */}
            <Button
              variant={showAIChat ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowAIChat(!showAIChat)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">المساعد الذكي</span>
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* File Operations */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onExport('pdf')}
                className="text-gray-600 hover:text-gray-800"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSave}
                className="text-gray-600 hover:text-gray-800"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onUpload}
                className="text-gray-600 hover:text-gray-800"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* View Settings */}
            <div className="flex items-center gap-1">
              <Button
                variant={showGrid ? "default" : "ghost"}
                size="sm"
                onClick={onToggleGrid}
                className="text-gray-600 hover:text-gray-800"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={snapEnabled ? "default" : "ghost"}
                size="sm"
                onClick={onToggleSnap}
                className="text-gray-600 hover:text-gray-800"
              >
                <Palette className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleTheme}
                className="text-gray-600 hover:text-gray-800"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Settings */}
            <Button
              variant={showSettings ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Chat Panel */}
      {showAIChat && (
        <Card className="absolute top-16 right-4 w-80 h-96 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 rounded-2xl pointer-events-auto">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">المساعد الذكي</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAIChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
            
            <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-3 overflow-y-auto">
              <div className="text-sm text-gray-600">
                مرحباً! كيف يمكنني مساعدتك في تنظيم لوحة التخطيط؟
              </div>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="اكتب رسالتك..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm">إرسال</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <Card className="absolute top-16 right-4 w-64 bg-white/95 backdrop-blur-lg shadow-lg border border-gray-200/50 rounded-2xl pointer-events-auto">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">الإعدادات</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">إظهار الشبكة</span>
                <Button
                  variant={showGrid ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleGrid}
                >
                  {showGrid ? "مفعل" : "معطل"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">الالتصاق للشبكة</span>
                <Button
                  variant={snapEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleSnap}
                >
                  {snapEnabled ? "مفعل" : "معطل"}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">السمة</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleTheme}
                >
                  {theme === 'light' ? 'فاتح' : 'داكن'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};