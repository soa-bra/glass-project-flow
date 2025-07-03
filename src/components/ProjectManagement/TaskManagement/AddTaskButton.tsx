import React, { useState } from 'react';

interface AddTaskButtonProps {
  column: string;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ column }) => {
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      // Here you would add the task to your data store
      console.log(`Adding task "${taskTitle}" to column "${column}"`);
      setTaskTitle('');
      setShowForm(false);
    }
  };

  if (showForm) {
    return (
      <div className="bg-transparent border border-black/10 rounded-3xl p-4">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="عنوان المهمة..."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="w-full p-2 text-sm border border-black/10 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-black"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-black text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
            >
              إضافة
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setTaskTitle('');
              }}
              className="px-3 py-2 bg-gray-100 text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full p-4 bg-transparent border border-dashed border-black/20 rounded-3xl text-sm font-medium text-gray-400 hover:border-black/40 hover:text-black transition-colors flex items-center justify-center gap-2"
    >
      <span>+</span>
      إضافة مهمة
    </button>
  );
};