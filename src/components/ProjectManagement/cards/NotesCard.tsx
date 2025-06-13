
import React, { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';

const notes = [
  { id: 1, text: 'مراجعة التصميم مع العميل', time: '10:30 ص' },
  { id: 2, text: 'تحديث قاعدة البيانات', time: '2:15 م' }
];

export const NotesCard: React.FC = () => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  const addNote = () => {
    if (noteText.trim()) {
      // يمكن إضافة منطق حفظ الملاحظة هنا
      console.log('إضافة ملاحظة:', noteText);
      setNoteText('');
      setShowAddNote(false);
    }
  };

  return (
    <div className="h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 font-arabic">الملاحظات</h3>
        <button 
          onClick={() => setShowAddNote(!showAddNote)}
          className="p-1 hover:bg-white/20 rounded transition-colors duration-200"
        >
          <Plus size={16} className="text-gray-600" />
        </button>
      </div>

      {showAddNote && (
        <div className="mb-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="أضف ملاحظة جديدة..."
            className="w-full h-16 p-2 bg-white/20 border border-white/30 rounded-lg
                     text-gray-800 placeholder-gray-500 font-arabic text-right text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            autoFocus
          />
          <div className="flex gap-2 justify-end mt-2">
            <button
              onClick={() => setShowAddNote(false)}
              className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 font-arabic"
            >
              إلغاء
            </button>
            <button
              onClick={addNote}
              className="px-2 py-1 bg-blue-500 text-white text-xs rounded-md
                       hover:bg-blue-600 font-arabic"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="p-2 bg-white/10 rounded-lg">
            <div className="text-sm text-gray-800 font-arabic mb-1">
              {note.text}
            </div>
            <div className="text-xs text-gray-600 font-arabic">
              {note.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
