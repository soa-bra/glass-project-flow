/**
 * WebRTC Voice Service - خدمة الاتصال الصوتي
 * @module engine/canvas/voice
 */

/**
 * خيارات التهيئة
 */
export interface WebRTCVoiceCallbacks {
  onParticipantJoined?: (odId: string) => void;
  onParticipantLeft?: (odId: string) => void;
  onRemoteStream?: (odId: string, stream: MediaStream) => void;
  onSpeakingChange?: (odId: string, isSpeaking: boolean) => void;
  onError?: (error: Error) => void;
  onCallStarted?: () => void;
  onCallEnded?: () => void;
}

/**
 * خدمة الاتصال الصوتي عبر WebRTC
 */
export class WebRTCVoiceService {
  private userId: string = '';
  private callbacks: WebRTCVoiceCallbacks = {};
  private localStream: MediaStream | null = null;
  private isInCall: boolean = false;
  private isMuted: boolean = true;
  private currentBoardId: string | null = null;

  /**
   * تهيئة الخدمة
   */
  initialize(userId: string, callbacks: WebRTCVoiceCallbacks): void {
    this.userId = userId;
    this.callbacks = callbacks;
    console.log('WebRTC Voice Service initialized for user:', userId);
  }

  /**
   * بدء مكالمة
   */
  async startCall(boardId: string, isHost: boolean): Promise<void> {
    if (this.isInCall) {
      throw new Error('المستخدم في مكالمة بالفعل');
    }

    try {
      // طلب إذن الميكروفون
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.currentBoardId = boardId;
      this.isInCall = true;
      this.isMuted = false;

      this.callbacks.onCallStarted?.();
      
      console.log('Call started for board:', boardId);
    } catch (error) {
      this.callbacks.onError?.(error instanceof Error ? error : new Error('فشل بدء المكالمة'));
      throw error;
    }
  }

  /**
   * الانضمام لمكالمة
   */
  async joinCall(boardId: string): Promise<void> {
    if (this.isInCall) {
      throw new Error('المستخدم في مكالمة بالفعل');
    }

    try {
      // طلب إذن الميكروفون
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      this.currentBoardId = boardId;
      this.isInCall = true;
      this.isMuted = true; // الانضمام مع كتم الصوت افتراضياً

      this.callbacks.onCallStarted?.();
      
      console.log('Joined call for board:', boardId);
    } catch (error) {
      this.callbacks.onError?.(error instanceof Error ? error : new Error('فشل الانضمام للمكالمة'));
      throw error;
    }
  }

  /**
   * إنهاء المكالمة
   */
  async endCall(): Promise<void> {
    this.cleanup();
    this.callbacks.onCallEnded?.();
    console.log('Call ended');
  }

  /**
   * مغادرة المكالمة
   */
  async leaveCall(): Promise<void> {
    this.cleanup();
    this.callbacks.onCallEnded?.();
    console.log('Left call');
  }

  /**
   * تنظيف الموارد
   */
  private cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    this.isInCall = false;
    this.isMuted = true;
    this.currentBoardId = null;
  }

  /**
   * تعيين حالة الكتم
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }

    console.log('Muted:', muted);
  }

  /**
   * الحصول على حالة المكالمة
   */
  getCallState(): { isInCall: boolean; isMuted: boolean; boardId: string | null } {
    return {
      isInCall: this.isInCall,
      isMuted: this.isMuted,
      boardId: this.currentBoardId,
    };
  }

  /**
   * تدمير الخدمة
   */
  destroy(): void {
    this.cleanup();
    this.callbacks = {};
    this.userId = '';
    console.log('WebRTC Voice Service destroyed');
  }
}

/**
 * مثيل الخدمة الافتراضي
 */
export const webrtcVoiceService = new WebRTCVoiceService();
