import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ToolPanelContainer } from '@/components/custom/ToolPanelContainer';
import { Mic, Square, Play, Pause, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AudioCommentToolProps {
  selectedTool: string;
  selectedElementId: string | null;
  userId: string;
  onSaveAudio: (audioData: {
    elementId: string;
    audioUrl: string;
    duration: number;
    timestamp: Date;
    userId: string;
  }) => void;
}

export const AudioCommentTool: React.FC<AudioCommentToolProps> = ({
  selectedTool,
  selectedElementId,
  userId,
  onSaveAudio
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  if (selectedTool !== 'audio-comment') return null;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setDuration(recordingTime);
        
        // إيقاف الميكروفون
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // بدء عداد الوقت
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success('بدأ التسجيل...');
    } catch (error) {
      toast.error('فشل في الوصول للميكروفون');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      toast.success('تم إيقاف التسجيل');
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      setDuration(0);
      setIsPlaying(false);
      toast.info('تم حذف التسجيل');
    }
  };

  const saveAudioComment = () => {
    if (!audioUrl || !selectedElementId) {
      toast.error('لا يوجد تسجيل أو عنصر محدد');
      return;
    }

    const audioData = {
      elementId: selectedElementId,
      audioUrl,
      duration,
      timestamp: new Date(),
      userId
    };

    onSaveAudio(audioData);
    
    // إعادة تعيين الحالة
    setAudioUrl(null);
    setDuration(0);
    setIsPlaying(false);
    
    toast.success('تم حفظ التعليق الصوتي');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ToolPanelContainer title="تعليق صوتي">
      <div className="space-y-4">
        {/* حالة العنصر المحدد */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="text-sm font-arabic">
            العنصر المحدد: {selectedElementId ? `✓ ${selectedElementId}` : '❌ غير محدد'}
          </div>
        </div>

        {!selectedElementId && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm font-arabic text-yellow-800">
              يرجى تحديد عنصر أولاً لإضافة تعليق صوتي له
            </p>
          </div>
        )}

        {/* أزرار التحكم في التسجيل */}
        <div className="space-y-3">
          {!audioUrl && (
            <div className="flex gap-2">
              <Button
                onClick={startRecording}
                disabled={isRecording || !selectedElementId}
                className={`flex-1 rounded-full ${isRecording ? 'bg-red-600 hover:bg-red-700' : ''}`}
              >
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? 'جاري التسجيل...' : 'بدء التسجيل'}
              </Button>
              
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="outline"
                  className="rounded-full"
                >
                  <Square className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* عرض وقت التسجيل */}
          {isRecording && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
              <div className="text-lg font-mono text-red-600">
                🔴 {formatTime(recordingTime)}
              </div>
              <div className="text-xs font-arabic text-red-700">
                جاري التسجيل...
              </div>
            </div>
          )}

          {/* مشغل الصوت */}
          {audioUrl && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-arabic">التسجيل الصوتي</div>
                  <div className="text-xs font-mono">{formatTime(duration)}</div>
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                
                <div className="flex gap-2">
                  <Button
                    onClick={playAudio}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3 mr-1" />
                        إيقاف
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 mr-1" />
                        تشغيل
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={deleteRecording}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* حفظ التعليق */}
              <Button
                onClick={saveAudioComment}
                className="w-full rounded-full"
              >
                <Save className="w-4 h-4 mr-2" />
                حفظ التعليق الصوتي
              </Button>
            </div>
          )}
        </div>

        {/* تعليمات الاستخدام */}
        <div className="border-t pt-3">
          <div className="text-xs text-gray-500 font-arabic space-y-1">
            <div>📝 كيفية الاستخدام:</div>
            <div>• حدد عنصراً على اللوحة</div>
            <div>• اضغط "بدء التسجيل" واتحدث</div>
            <div>• اضغط الزر المربع لإيقاف التسجيل</div>
            <div>• استمع للتسجيل ثم احفظه</div>
          </div>
        </div>
      </div>
    </ToolPanelContainer>
  );
};