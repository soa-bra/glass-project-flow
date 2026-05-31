/**
 * useWebRTCVoice Hook
 * Hook للتحكم في المكالمات الصوتية عبر WebRTC
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { webrtcVoiceService } from '@/engine/canvas/voice/webrtcVoice';
import { useCollaborationStore } from '@/stores/collaborationStore';
import { useCollaborationUser } from '@/hooks/useCollaborationUser';
import { toast } from 'sonner';

interface UseWebRTCVoiceOptions {
  boardId: string | null;
  enabled?: boolean;
}

export function useWebRTCVoice({ boardId, enabled = true }: UseWebRTCVoiceOptions) {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [speakingParticipants, setSpeakingParticipants] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  
  const collaborationUser = useCollaborationUser();
  const { 
    isHost, 
    voiceState,
    updateParticipant,
    setParticipants,
    participants,
  } = useCollaborationStore();

  const initializedRef = useRef(false);

  // تهيئة الخدمة
  useEffect(() => {
    if (!enabled || !collaborationUser.id || initializedRef.current) return;

    webrtcVoiceService.initialize(collaborationUser.id, {
      onParticipantJoined: (odId) => {
        console.log('Participant joined voice call:', odId);
        updateParticipant(odId, { inVoiceCall: true });
      },
      onParticipantLeft: (odId) => {
        console.log('Participant left voice call:', odId);
        updateParticipant(odId, { inVoiceCall: false, isSpeaking: false });
        setSpeakingParticipants(prev => {
          const next = new Set(prev);
          next.delete(odId);
          return next;
        });
      },
      onRemoteStream: (odId, stream) => {
        console.log('Received remote stream from:', odId);
      },
      onSpeakingChange: (odId, isSpeaking) => {
        updateParticipant(odId, { isSpeaking });
        setSpeakingParticipants(prev => {
          const next = new Set(prev);
          if (isSpeaking) {
            next.add(odId);
          } else {
            next.delete(odId);
          }
          return next;
        });
      },
      onError: (err) => {
        console.error('WebRTC Voice error:', err);
        setError(err.message);
        toast.error(err.message);
      },
      onCallStarted: () => {
        setIsInCall(true);
        toast.success('تم الانضمام للمكالمة الصوتية');
      },
      onCallEnded: () => {
        setIsInCall(false);
        setIsMuted(true);
        setSpeakingParticipants(new Set());
        toast.info('انتهت المكالمة الصوتية');
      },
    });

    initializedRef.current = true;

    return () => {
      webrtcVoiceService.destroy();
      initializedRef.current = false;
    };
  }, [enabled, collaborationUser.id, updateParticipant]);

  // بدء مكالمة (للمستضيف فقط)
  const startCall = useCallback(async () => {
    if (!boardId || !isHost) return;
    
    try {
      setError(null);
      await webrtcVoiceService.startCall(boardId, true);
      
      // تحديث حالة المتجر
      useCollaborationStore.getState().startVoiceCall();
    } catch (err) {
      console.error('Failed to start call:', err);
      setError('فشل بدء المكالمة');
    }
  }, [boardId, isHost]);

  // الانضمام لمكالمة
  const joinCall = useCallback(async () => {
    if (!boardId) return;
    
    try {
      setError(null);
      await webrtcVoiceService.joinCall(boardId);
      
      // تحديث حالة المتجر
      useCollaborationStore.getState().joinVoiceCall();
    } catch (err) {
      console.error('Failed to join call:', err);
      setError('فشل الانضمام للمكالمة');
    }
  }, [boardId]);

  // إنهاء المكالمة (للمستضيف فقط)
  const endCall = useCallback(async () => {
    if (!isHost) return;
    
    try {
      await webrtcVoiceService.endCall();
      useCollaborationStore.getState().endVoiceCall();
    } catch (err) {
      console.error('Failed to end call:', err);
    }
  }, [isHost]);

  // مغادرة المكالمة
  const leaveCall = useCallback(async () => {
    try {
      await webrtcVoiceService.leaveCall();
      useCollaborationStore.getState().leaveVoiceCall();
    } catch (err) {
      console.error('Failed to leave call:', err);
    }
  }, []);

  // تبديل الكتم
  const toggleMute = useCallback(() => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    webrtcVoiceService.setMuted(newMutedState);
    useCollaborationStore.getState().toggleMute();
  }, [isMuted]);

  // التحقق إذا كان المشارك يتحدث
  const isParticipantSpeaking = useCallback((odId: string) => {
    return speakingParticipants.has(odId);
  }, [speakingParticipants]);

  return {
    // الحالة
    isInCall,
    isMuted,
    error,
    speakingParticipants: Array.from(speakingParticipants),
    
    // الإجراءات
    startCall,
    joinCall,
    endCall,
    leaveCall,
    toggleMute,
    
    // المساعدات
    isParticipantSpeaking,
  };
}
