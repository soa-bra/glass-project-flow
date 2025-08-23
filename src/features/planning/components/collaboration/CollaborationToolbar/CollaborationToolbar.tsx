import React, { useState } from 'react';
import { useCollaborationStore } from '../../../store/collaboration.store';

export const CollaborationToolbar: React.FC = () => {
  const { 
    connectedUsers,
    currentUserId,
    isVoiceChatActive,
    isScreenSharingActive,
    setVoiceChatActive,
    setScreenSharingActive,
    roomId
  } = useCollaborationStore();

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isScreenShareEnabled, setIsScreenShareEnabled] = useState(false);

  const handleVoiceToggle = () => {
    if (!isVoiceEnabled) {
      // Request microphone permission and start voice chat
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsVoiceEnabled(true);
          setVoiceChatActive(true);
        })
        .catch((error) => {
          console.error('Error accessing microphone:', error);
          alert('لا يمكن الوصول إلى الميكروفون. تأكد من الأذونات.');
        });
    } else {
      setIsVoiceEnabled(false);
      setVoiceChatActive(false);
    }
  };

  const handleScreenShareToggle = () => {
    if (!isScreenShareEnabled) {
      // Request screen share permission
      navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(() => {
          setIsScreenShareEnabled(true);
          setScreenSharingActive(true);
        })
        .catch((error) => {
          console.error('Error accessing screen share:', error);
          alert('لا يمكن مشاركة الشاشة. تأكد من الأذونات.');
        });
    } else {
      setIsScreenShareEnabled(false);
      setScreenSharingActive(false);
    }
  };

  const handleInviteUsers = () => {
    const boardUrl = `${window.location.origin}/planning?board=${roomId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'انضم إلى لوحة التخطيط التعاونية',
        text: 'تعاون معي في هذه اللوحة',
        url: boardUrl
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(boardUrl).then(() => {
        alert('تم نسخ رابط الدعوة إلى الحافظة');
      });
    }
  };

  const currentUser = connectedUsers.get(currentUserId || '') as any;
  const isOwnerOrAdmin = currentUser?.role === 'owner' || currentUser?.role === 'admin';
  const activeUsersCount = Array.from(connectedUsers.values()).filter(
    (user: any) => user.status === 'active' || user.status === 'in_voice_chat' || user.status === 'screen_sharing'
  ).length;

  if (!roomId) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-lg rounded-2xl border border-black/10 shadow-xl p-3 z-30">
      <div className="flex items-center gap-3">
        {/* Active users indicator */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/5 rounded-xl">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-black">
            {activeUsersCount} نشط
          </span>
        </div>

        {/* Voice chat toggle */}
        <button
          onClick={handleVoiceToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
            isVoiceEnabled
              ? 'bg-accent-blue text-white'
              : 'bg-transparent border border-black/10 text-black hover:bg-black/5'
          }`}
          title={isVoiceEnabled ? 'إيقاف المكالمة الصوتية' : 'بدء مكالمة صوتية'}
        >
          <span className="text-lg">{isVoiceEnabled ? '🎤' : '🔇'}</span>
          <span className="text-sm font-medium hidden sm:inline">
            {isVoiceEnabled ? 'مكالمة نشطة' : 'مكالمة صوتية'}
          </span>
        </button>

        {/* Screen sharing toggle */}
        <button
          onClick={handleScreenShareToggle}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
            isScreenShareEnabled
              ? 'bg-purple-500 text-white'
              : 'bg-transparent border border-black/10 text-black hover:bg-black/5'
          }`}
          title={isScreenShareEnabled ? 'إيقاف مشاركة الشاشة' : 'مشاركة الشاشة'}
        >
          <span className="text-lg">{isScreenShareEnabled ? '📺' : '🖥️'}</span>
          <span className="text-sm font-medium hidden sm:inline">
            {isScreenShareEnabled ? 'مشاركة نشطة' : 'مشاركة الشاشة'}
          </span>
        </button>

        {/* Invite users */}
        {isOwnerOrAdmin && (
          <button
            onClick={handleInviteUsers}
            className="flex items-center gap-2 px-3 py-2 bg-accent-green text-white rounded-xl hover:bg-accent-green/80 transition-colors"
            title="دعوة مستخدمين"
          >
            <span className="text-lg">➕</span>
            <span className="text-sm font-medium hidden sm:inline">
              دعوة
            </span>
          </button>
        )}

        {/* Settings */}
        <button
          className="flex items-center gap-2 px-3 py-2 bg-transparent border border-black/10 text-black rounded-xl hover:bg-black/5 transition-colors"
          title="إعدادات التعاون"
        >
          <span className="text-lg">⚙️</span>
        </button>
      </div>

      {/* Voice/Screen sharing status */}
      {(isVoiceChatActive || isScreenSharingActive) && (
        <div className="mt-2 pt-2 border-t border-black/10 text-center">
          <div className="text-xs text-black/60">
            {isVoiceChatActive && isScreenSharingActive && 'مكالمة صوتية ومشاركة شاشة نشطة'}
            {isVoiceChatActive && !isScreenSharingActive && 'مكالمة صوتية نشطة'}
            {!isVoiceChatActive && isScreenSharingActive && 'مشاركة شاشة نشطة'}
          </div>
        </div>
      )}
    </div>
  );
};