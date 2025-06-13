
import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MediaPlayerWidgetProps {
  className?: string;
}

export const MediaPlayerWidget: React.FC<MediaPlayerWidgetProps> = ({
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(127);
  const totalTime = 247;

  return (
    <div className={`
      ${className}
      rounded-3xl p-4
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col justify-between
      font-arabic
    `}>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-bold text-gray-800">
            مشغل الوسائط
          </h3>
          <p className="text-xs text-gray-600">
            أغنية حالية
          </p>
        </div>
        <div className="text-xs text-gray-600">
          {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* شريط التقدم */}
      <div className="w-full bg-gray-200/50 rounded-full h-1 mb-4">
        <div 
          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${(currentTime / totalTime) * 100}%` }}
        />
      </div>

      {/* أزرار التحكم */}
      <div className="flex items-center justify-center gap-4">
        <button className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200">
          <SkipBack size={14} className="text-gray-700" />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-all duration-200 text-white"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button className="w-8 h-8 rounded-full bg-white/60 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/80 transition-all duration-200">
          <SkipForward size={14} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};
