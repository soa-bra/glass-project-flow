import React, { useState } from 'react';
import { 
  Users, MessageSquare, Phone, UserPlus, Send, 
  Mic, MicOff, PhoneCall, PhoneOff, Volume2,
  Check, Crown, Eye, Edit3, Loader2, Link2
} from 'lucide-react';
import { useCollaborationStore, Participant } from '@/stores/collaborationStore';
import { useCollaborationUser } from '@/hooks/useCollaborationUser';
import { useWebRTCVoice } from '@/hooks/useWebRTCVoice';
import { useBoardInvites } from '@/hooks/useBoardInvites';
import { motion, AnimatePresence } from 'framer-motion';
import { InviteLinkDialog } from './InviteLinkDialog';
import { JoinRequestNotification } from './JoinRequestNotification';

interface SharePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  boardId?: string | null;
}

type TabType = 'participants' | 'comments' | 'voice';

export const SharePopover: React.FC<SharePopoverProps> = ({ 
  isOpen, 
  onClose,
  boardId = null,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const [newComment, setNewComment] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  
  const collaborationUser = useCollaborationUser();
  const {
    participants,
    comments,
    voiceState,
    isHost,
    isConnected,
    addComment,
    resolveComment,
  } = useCollaborationStore();

  // WebRTC Voice Hook
  const {
    isInCall,
    isMuted,
    error: voiceError,
    speakingParticipants,
    startCall,
    joinCall,
    endCall,
    leaveCall,
    toggleMute,
    isParticipantSpeaking,
  } = useWebRTCVoice({ boardId, enabled: isOpen });

  // Board Invites Hook
  const {
    activeLink,
    pendingRequests,
    isLoading: isInviteLoading,
    createInviteLink,
    deactivateLink,
    handleJoinRequest,
    getInviteUrl,
  } = useBoardInvites({ boardId, isHost });
  
  if (!isOpen) return null;
  
  const handleSendComment = () => {
    if (!newComment.trim()) return;
    
    addComment({
      authorId: collaborationUser.id,
      authorName: collaborationUser.name,
      authorColor: collaborationUser.color,
      text: newComment.trim(),
      resolved: false,
    });
    setNewComment('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Crown size={12} className="text-[#F6C445]" />;
      case 'editor': return <Edit3 size={12} className="text-sb-ink-60" />;
      case 'viewer': return <Eye size={12} className="text-sb-ink-40" />;
      default: return null;
    }
  };
  
  const getRoleName = (role: string) => {
    switch (role) {
      case 'host': return 'مستضيف';
      case 'editor': return 'محرر';
      case 'viewer': return 'قارئ';
      default: return '';
    }
  };
  
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  // دمج المستخدم الحالي مع المشاركين
  const allParticipants: Participant[] = [
    {
      id: collaborationUser.id,
      name: collaborationUser.name + ' (أنت)',
      color: collaborationUser.color,
      role: isHost ? 'host' : 'editor',
      online: true,
      inVoiceCall: voiceState.participants.includes(collaborationUser.id),
      isMuted: voiceState.isMuted,
      isSpeaking: false,
    },
    ...participants.filter(p => p.id !== collaborationUser.id),
  ];
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border overflow-hidden z-50" dir="rtl">
        {/* حالة الاتصال + زر الدعوة */}
        <div className="px-4 py-2 bg-sb-panel-bg border-b border-sb-border flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#3DBE8B]' : 'bg-sb-ink-30'}`} />
          <span className="text-[11px] text-sb-ink-60">
            {isConnected ? 'متصل' : 'غير متصل'}
          </span>
          <span className="text-[11px] text-sb-ink-40">
            {allParticipants.length} مشارك
          </span>
          
          {/* زر دعوة مشاركين */}
          {isHost && (
            <button
              onClick={() => setShowInviteDialog(true)}
              className="mr-auto flex items-center gap-1.5 px-2.5 py-1.5 bg-sb-ink text-white text-[11px] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <UserPlus size={12} />
              دعوة
              {pendingRequests.length > 0 && (
                <span className="w-4 h-4 flex items-center justify-center bg-[#E5564D] text-[9px] rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>
          )}
        </div>
        
        {/* إشعارات طلبات الانضمام */}
        {isHost && pendingRequests.length > 0 && (
          <div className="p-3 border-b border-sb-border space-y-2">
            <AnimatePresence>
              {pendingRequests.map((request) => (
                <JoinRequestNotification
                  key={request.id}
                  request={request}
                  onApprove={(id, role) => handleJoinRequest(id, 'approved', role)}
                  onReject={(id) => handleJoinRequest(id, 'rejected')}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {/* التبويبات */}
        <div className="flex border-b border-sb-border">
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors ${
              activeTab === 'participants'
                ? 'text-sb-ink border-b-2 border-sb-ink'
                : 'text-sb-ink-40 hover:text-sb-ink-70'
            }`}
          >
            <Users size={16} />
            المشاركين
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors ${
              activeTab === 'comments'
                ? 'text-sb-ink border-b-2 border-sb-ink'
                : 'text-sb-ink-40 hover:text-sb-ink-70'
            }`}
          >
            <MessageSquare size={16} />
            التعليقات
            {comments.filter(c => !c.resolved).length > 0 && (
              <span className="bg-[#E5564D] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {comments.filter(c => !c.resolved).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium transition-colors ${
              activeTab === 'voice'
                ? 'text-sb-ink border-b-2 border-sb-ink'
                : 'text-sb-ink-40 hover:text-sb-ink-70'
            }`}
          >
            <Phone size={16} />
            الصوت
            {voiceState.isCallActive && (
              <span className="w-2 h-2 rounded-full bg-[#3DBE8B] animate-pulse" />
            )}
          </button>
        </div>
        
        {/* المحتوى */}
        <div className="p-4 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* === تبويب المشاركين === */}
            {activeTab === 'participants' && (
              <motion.div
                key="participants"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* قائمة المشاركين */}
                
                <div className="space-y-2">
                  {allParticipants.map(participant => (
                    <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-sb-panel-bg/50 transition-colors">
                      <div className="relative">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-semibold"
                          style={{ backgroundColor: participant.color }}
                        >
                          {participant.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          participant.online ? 'bg-[#3DBE8B]' : 'bg-sb-ink-20'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-sb-ink truncate">{participant.name}</p>
                        <div className="flex items-center gap-1">
                          {getRoleIcon(participant.role)}
                          <p className="text-[11px] text-sb-ink-40">{getRoleName(participant.role)}</p>
                        </div>
                      </div>
                      {participant.inVoiceCall && (
                        <div className="flex items-center gap-1">
                          {participant.isMuted ? (
                            <MicOff size={14} className="text-sb-ink-40" />
                          ) : (
                            <Mic size={14} className={participant.isSpeaking ? 'text-[#3DBE8B]' : 'text-sb-ink-60'} />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* === تبويب التعليقات === */}
            {activeTab === 'comments' && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare size={32} className="mx-auto text-sb-ink-20 mb-2" />
                    <p className="text-[13px] text-sb-ink-40">لا توجد تعليقات بعد</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {comments.map(comment => (
                      <div 
                        key={comment.id} 
                        className={`p-3 rounded-lg ${
                          comment.resolved 
                            ? 'bg-sb-panel-bg opacity-60' 
                            : 'bg-white border border-sb-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                              style={{ backgroundColor: comment.authorColor }}
                            >
                              {comment.authorName.charAt(0)}
                            </div>
                            <p className="text-[13px] font-medium text-sb-ink">{comment.authorName}</p>
                            <p className="text-[10px] text-sb-ink-40">{formatTime(comment.timestamp)}</p>
                          </div>
                          {!comment.resolved && (
                            <button 
                              onClick={() => resolveComment(comment.id)}
                              className="p-1 hover:bg-sb-panel-bg rounded transition-colors"
                              title="تم الحل"
                            >
                              <Check size={14} className="text-[#3DBE8B]" />
                            </button>
                          )}
                        </div>
                        <p className="text-[12px] text-sb-ink-70 leading-relaxed">{comment.text}</p>
                        {comment.resolved && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-[#3DBE8B]">
                            <Check size={10} /> تم الحل
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2 border-t border-sb-border">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اكتب تعليقًا..."
                    className="flex-1 px-3 py-2 text-[12px] border border-sb-border rounded-lg focus:outline-none focus:border-sb-ink bg-white"
                  />
                  <button 
                    onClick={handleSendComment}
                    disabled={!newComment.trim()}
                    className="p-2 bg-sb-ink text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* === تبويب الصوت === */}
            {activeTab === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {/* حالة المكالمة */}
                {!isInCall && !voiceState.isCallActive ? (
                  <div className="text-center py-6">
                    <Phone size={40} className="mx-auto text-sb-ink-20 mb-3" />
                    <p className="text-[13px] text-sb-ink-60 mb-4">لا توجد مكالمة نشطة</p>
                    {voiceError && (
                      <p className="text-[12px] text-[#E5564D] mb-3">{voiceError}</p>
                    )}
                    {isHost ? (
                      <button 
                        onClick={async () => {
                          setIsConnecting(true);
                          await startCall();
                          setIsConnecting(false);
                        }}
                        disabled={isConnecting}
                        className="w-full px-4 py-3 bg-[#3DBE8B] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isConnecting ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <PhoneCall size={18} />
                        )}
                        {isConnecting ? 'جاري الاتصال...' : 'بدء مكالمة صوتية'}
                      </button>
                    ) : (
                      <p className="text-[12px] text-sb-ink-40">
                        انتظر المستضيف لبدء المكالمة
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {/* شريط التحكم */}
                    <div className="bg-sb-panel-bg rounded-xl p-4">
                      <div className="flex items-center justify-center gap-4">
                        {/* زر الكتم */}
                        <button
                          onClick={toggleMute}
                          className={`p-3 rounded-full transition-colors ${
                            isMuted
                              ? 'bg-sb-ink-20 text-sb-ink-60'
                              : 'bg-[#3DBE8B] text-white'
                          }`}
                          title={isMuted ? 'إلغاء الكتم' : 'كتم'}
                        >
                          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        
                        {/* زر مغادرة/إنهاء */}
                        {isHost ? (
                          <button
                            onClick={endCall}
                            className="p-3 rounded-full bg-[#E5564D] text-white transition-colors hover:opacity-90"
                            title="إنهاء المكالمة"
                          >
                            <PhoneOff size={20} />
                          </button>
                        ) : (
                          isInCall ? (
                            <button
                              onClick={leaveCall}
                              className="p-3 rounded-full bg-[#E5564D] text-white transition-colors hover:opacity-90"
                              title="مغادرة المكالمة"
                            >
                              <PhoneOff size={20} />
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                setIsConnecting(true);
                                await joinCall();
                                setIsConnecting(false);
                              }}
                              disabled={isConnecting}
                              className="p-3 rounded-full bg-[#3DBE8B] text-white transition-colors hover:opacity-90 disabled:opacity-50"
                              title="الانضمام للمكالمة"
                            >
                              {isConnecting ? (
                                <Loader2 size={20} className="animate-spin" />
                              ) : (
                                <PhoneCall size={20} />
                              )}
                            </button>
                          )
                        )}
                      </div>
                      
                      {/* حالة الاتصال */}
                      <div className="text-center mt-3">
                        <p className="text-[11px] text-sb-ink-60 flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#3DBE8B] animate-pulse" />
                          مكالمة نشطة
                        </p>
                      </div>
                    </div>
                    
                    {/* قائمة المشاركين في المكالمة */}
                    <div className="space-y-2">
                      <p className="text-[12px] text-sb-ink-60 font-medium">
                        المشاركين في المكالمة ({voiceState.participants.length || (isInCall ? 1 : 0)})
                      </p>
                      {allParticipants
                        .filter(p => voiceState.participants.includes(p.id) || (isInCall && p.id === collaborationUser.id))
                        .map(participant => (
                          <div key={participant.id} className="flex items-center gap-3 p-2 bg-sb-panel-bg/50 rounded-lg">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-semibold"
                              style={{ backgroundColor: participant.color }}
                            >
                              {participant.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="text-[12px] font-medium text-sb-ink">{participant.name}</p>
                              <p className="text-[10px] text-sb-ink-40">
                                {participant.role === 'host' ? 'مستضيف' : 'مشارك'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isParticipantSpeaking(participant.id) && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, duration: 0.8 }}
                                >
                                  <Volume2 size={14} className="text-[#3DBE8B]" />
                                </motion.div>
                              )}
                              {participant.id === collaborationUser.id ? (
                                isMuted ? (
                                  <MicOff size={14} className="text-sb-ink-40" />
                                ) : (
                                  <Mic size={14} className="text-[#3DBE8B]" />
                                )
                              ) : (
                                participant.isMuted ? (
                                  <MicOff size={14} className="text-sb-ink-40" />
                                ) : (
                                  <Mic size={14} className="text-[#3DBE8B]" />
                                )
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* نافذة رابط الدعوة */}
      <InviteLinkDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        inviteUrl={getInviteUrl()}
        isLoading={isInviteLoading}
        onCreateLink={createInviteLink}
        onDeactivateLink={deactivateLink}
      />
    </>
  );
};
