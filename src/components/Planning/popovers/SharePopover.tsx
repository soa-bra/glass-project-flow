import React, { useState } from 'react';
import { Users, MessageSquare, Phone, UserPlus, Send } from 'lucide-react';

interface SharePopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'participants' | 'comments' | 'voice';

export const SharePopover: React.FC<SharePopoverProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('participants');
  const [newComment, setNewComment] = useState('');
  
  if (!isOpen) return null;
  
  // Mock data
  const participants = [
    { id: 1, name: 'أحمد محمد', role: 'مالك', online: true, color: '#3DBE8B' },
    { id: 2, name: 'فاطمة علي', role: 'محرر', online: true, color: '#F6C445' },
    { id: 3, name: 'خالد سعيد', role: 'قارئ', online: false, color: '#3DA8F5' },
  ];
  
  const comments = [
    { id: 1, author: 'أحمد', text: 'هل نغير هذا اللون؟', resolved: false, timestamp: Date.now() },
    { id: 2, author: 'فاطمة', text: 'تمام، تم التعديل', resolved: true, timestamp: Date.now() - 3600000 },
  ];
  
  const voiceParticipants = [
    { id: 1, name: 'أحمد محمد', inCall: true, muted: false, volume: 80 },
    { id: 2, name: 'فاطمة علي', inCall: true, muted: false, volume: 65 },
  ];
  
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-sb-border overflow-hidden z-50">
        {/* Tabs */}
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
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'participants' && (
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 px-3 py-2 bg-sb-panel-bg rounded-lg hover:bg-sb-ink-20 transition-colors">
                <UserPlus size={16} className="text-sb-ink" />
                <span className="text-[13px] font-medium text-sb-ink">دعوة مشاركين</span>
              </button>
              
              <div className="space-y-2">
                {participants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-3 p-2">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[14px] font-semibold"
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-sb-ink">{participant.name}</p>
                      <p className="text-[11px] text-sb-ink-40">{participant.role}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${participant.online ? 'bg-[#3DBE8B]' : 'bg-sb-ink-20'}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'comments' && (
            <div className="space-y-3">
              <div className="space-y-2">
                {comments.map(comment => (
                  <div 
                    key={comment.id} 
                    className={`p-3 rounded-lg ${comment.resolved ? 'bg-sb-panel-bg' : 'bg-white border border-sb-border'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-[13px] font-medium text-sb-ink">{comment.author}</p>
                      {comment.resolved && (
                        <span className="text-[11px] text-[#3DBE8B]">✓ محلول</span>
                      )}
                    </div>
                    <p className="text-[12px] text-sb-ink-70">{comment.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="اكتب تعليقًا..."
                  className="flex-1 px-3 py-2 text-[12px] border border-sb-border rounded-lg focus:outline-none focus:border-sb-ink"
                />
                <button className="p-2 bg-sb-ink text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'voice' && (
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-[#3DBE8B] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
                بدء المكالمة
              </button>
              
              <div className="space-y-2">
                {voiceParticipants.map(participant => (
                  <div key={participant.id} className="flex items-center gap-3 p-2">
                    <div className="w-10 h-10 rounded-full bg-sb-panel-bg flex items-center justify-center">
                      <Phone size={16} className="text-sb-ink" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-sb-ink">{participant.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-sb-panel-bg rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#3DBE8B]"
                            style={{ width: `${participant.volume}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-sb-ink-40">{participant.volume}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
