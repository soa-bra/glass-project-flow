/**
 * WebRTC Voice Service - اتصال صوتي حقيقي
 * يستخدم Supabase Realtime للإشارات (signaling)
 */

import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PeerConnection {
  odId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

interface VoiceCallbacks {
  onParticipantJoined?: (odId: string) => void;
  onParticipantLeft?: (odId: string) => void;
  onRemoteStream?: (odId: string, stream: MediaStream) => void;
  onSpeakingChange?: (odId: string, isSpeaking: boolean) => void;
  onError?: (error: Error) => void;
  onCallStarted?: () => void;
  onCallEnded?: () => void;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

class WebRTCVoiceService {
  private channel: RealtimeChannel | null = null;
  private peers: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private currentOdId: string | null = null;
  private currentBoardId: string | null = null;
  private callbacks: VoiceCallbacks = {};
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private analyserNodes: Map<string, AnalyserNode> = new Map();
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = true;
  private isHost: boolean = false;

  initialize(odId: string, callbacks: VoiceCallbacks) {
    this.currentOdId = odId;
    this.callbacks = callbacks;
  }

  async startCall(boardId: string, isHost: boolean): Promise<void> {
    if (!this.currentOdId) throw new Error('Not initialized');
    
    this.currentBoardId = boardId;
    this.isHost = isHost;
    
    // الحصول على الصوت المحلي
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      // كتم الصوت افتراضياً
      this.setMuted(true);
      
    } catch (error) {
      console.error('Failed to get microphone:', error);
      this.callbacks.onError?.(new Error('فشل الوصول للميكروفون'));
      throw error;
    }

    // إنشاء قناة Realtime للإشارات
    this.channel = supabase.channel(`voice-${boardId}`, {
      config: {
        presence: { key: this.currentOdId },
      },
    });

    // الاستماع لرسائل الإشارات
    this.channel
      .on('broadcast', { event: 'offer' }, (payload: { payload: unknown }) => this.handleOffer(payload as { payload: { from: string; to: string; sdp: RTCSessionDescriptionInit } }))
      .on('broadcast', { event: 'answer' }, (payload: { payload: unknown }) => this.handleAnswer(payload as { payload: { from: string; to: string; sdp: RTCSessionDescriptionInit } }))
      .on('broadcast', { event: 'ice-candidate' }, (payload: { payload: unknown }) => this.handleIceCandidate(payload as { payload: { from: string; to: string; candidate: RTCIceCandidateInit } }))
      .on('broadcast', { event: 'call-started' }, () => this.handleCallStarted())
      .on('broadcast', { event: 'call-ended' }, () => this.handleCallEnded())
      .on('presence', { event: 'sync' }, () => this.handlePresenceSync())
      .on('presence', { event: 'join' }, ({ key }) => this.handlePresenceJoin(key))
      .on('presence', { event: 'leave' }, ({ key }) => this.handlePresenceLeave(key));

    await this.channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await this.channel?.track({ 
          odId: this.currentOdId,
          joinedAt: Date.now(),
        });
        
        // إذا كان المستضيف، أعلن بدء المكالمة
        if (isHost) {
          this.channel?.send({
            type: 'broadcast',
            event: 'call-started',
            payload: { hostId: this.currentOdId },
          });
        }
        
        this.callbacks.onCallStarted?.();
      }
    });
  }

  async joinCall(boardId: string): Promise<void> {
    await this.startCall(boardId, false);
  }

  private handleCallStarted() {
    this.callbacks.onCallStarted?.();
  }

  private handleCallEnded() {
    this.cleanup();
    this.callbacks.onCallEnded?.();
  }

  private async handlePresenceSync() {
    if (!this.channel) return;
    
    const state = this.channel.presenceState();
    const participants = Object.keys(state).filter(key => key !== this.currentOdId);
    
    // إنشاء اتصالات مع المشاركين الجدد
    for (const participantId of participants) {
      if (!this.peers.has(participantId)) {
        await this.createPeerConnection(participantId, true);
      }
    }
  }

  private async handlePresenceJoin(participantId: string) {
    if (participantId === this.currentOdId) return;
    
    this.callbacks.onParticipantJoined?.(participantId);
    
    // إنشاء عرض للمشارك الجديد
    if (!this.peers.has(participantId)) {
      await this.createPeerConnection(participantId, true);
    }
  }

  private handlePresenceLeave(participantId: string) {
    if (participantId === this.currentOdId) return;
    
    this.removePeer(participantId);
    this.callbacks.onParticipantLeft?.(participantId);
  }

  private async createPeerConnection(remoteOdId: string, createOffer: boolean): Promise<RTCPeerConnection> {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    
    this.peers.set(remoteOdId, { odId: remoteOdId, connection: pc });

    // إضافة المسار المحلي
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    // معالجة ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.channel?.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: {
            from: this.currentOdId,
            to: remoteOdId,
            candidate: event.candidate.toJSON(),
          },
        });
      }
    };

    // معالجة المسار البعيد
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        this.setupRemoteAudio(remoteOdId, remoteStream);
        this.callbacks.onRemoteStream?.(remoteOdId, remoteStream);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Peer ${remoteOdId} connection state: ${pc.connectionState}`);
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        this.removePeer(remoteOdId);
      }
    };

    // إنشاء عرض إذا لزم الأمر
    if (createOffer) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      
      this.channel?.send({
        type: 'broadcast',
        event: 'offer',
        payload: {
          from: this.currentOdId,
          to: remoteOdId,
          sdp: pc.localDescription?.toJSON(),
        },
      });
    }

    return pc;
  }

  private async handleOffer(payload: { payload: { from: string; to: string; sdp: RTCSessionDescriptionInit } }) {
    const { from, to, sdp } = payload.payload;
    
    if (to !== this.currentOdId) return;

    let pc = this.peers.get(from)?.connection;
    if (!pc) {
      pc = await this.createPeerConnection(from, false);
    }

    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.channel?.send({
      type: 'broadcast',
      event: 'answer',
      payload: {
        from: this.currentOdId,
        to: from,
        sdp: pc.localDescription?.toJSON(),
      },
    });
  }

  private async handleAnswer(payload: { payload: { from: string; to: string; sdp: RTCSessionDescriptionInit } }) {
    const { from, to, sdp } = payload.payload;
    
    if (to !== this.currentOdId) return;

    const pc = this.peers.get(from)?.connection;
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  }

  private async handleIceCandidate(payload: { payload: { from: string; to: string; candidate: RTCIceCandidateInit } }) {
    const { from, to, candidate } = payload.payload;
    
    if (to !== this.currentOdId) return;

    const pc = this.peers.get(from)?.connection;
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  private setupRemoteAudio(remoteOdId: string, stream: MediaStream) {
    // إزالة العنصر القديم إن وجد
    const existingAudio = this.audioElements.get(remoteOdId);
    if (existingAudio) {
      existingAudio.srcObject = null;
      existingAudio.remove();
    }

    // إنشاء عنصر صوتي جديد
    const audioEl = document.createElement('audio');
    audioEl.srcObject = stream;
    audioEl.autoplay = true;
    audioEl.volume = 1;
    this.audioElements.set(remoteOdId, audioEl);

    // إعداد محلل الصوت للكشف عن التحدث
    this.setupSpeakingDetection(remoteOdId, stream);
  }

  private setupSpeakingDetection(odId: string, stream: MediaStream) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    const source = this.audioContext.createMediaStreamSource(stream);
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    
    this.analyserNodes.set(odId, analyser);

    // كشف التحدث
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let lastSpeaking = false;

    const checkSpeaking = () => {
      if (!this.analyserNodes.has(odId)) return;
      
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const isSpeaking = average > 20;

      if (isSpeaking !== lastSpeaking) {
        lastSpeaking = isSpeaking;
        this.callbacks.onSpeakingChange?.(odId, isSpeaking);
      }

      requestAnimationFrame(checkSpeaking);
    };

    checkSpeaking();
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !muted;
      });
    }
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  private removePeer(odId: string) {
    const peer = this.peers.get(odId);
    if (peer) {
      peer.connection.close();
      this.peers.delete(odId);
    }

    const audio = this.audioElements.get(odId);
    if (audio) {
      audio.srcObject = null;
      audio.remove();
      this.audioElements.delete(odId);
    }

    this.analyserNodes.delete(odId);
  }

  async endCall() {
    if (this.isHost) {
      // إعلان إنهاء المكالمة للجميع
      this.channel?.send({
        type: 'broadcast',
        event: 'call-ended',
        payload: {},
      });
    }
    
    this.cleanup();
    this.callbacks.onCallEnded?.();
  }

  async leaveCall() {
    this.cleanup();
    this.callbacks.onCallEnded?.();
  }

  private cleanup() {
    // إيقاف المسار المحلي
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    // إغلاق جميع الاتصالات
    this.peers.forEach((_, odId) => this.removePeer(odId));

    // إلغاء الاشتراك في القناة
    if (this.channel) {
      this.channel.unsubscribe();
      this.channel = null;
    }

    // إغلاق سياق الصوت
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.currentBoardId = null;
    this.isHost = false;
  }

  getParticipantCount(): number {
    return this.peers.size + 1; // +1 للمستخدم المحلي
  }

  isInCall(): boolean {
    return this.channel !== null;
  }

  destroy() {
    this.cleanup();
    this.callbacks = {};
    this.currentOdId = null;
  }
}

export const webrtcVoiceService = new WebRTCVoiceService();
