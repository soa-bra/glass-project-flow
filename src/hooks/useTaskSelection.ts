
import { useState, useCallback } from 'react';

export const useTaskSelection = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const toggleTaskSelection = useCallback((taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTasks([]);
  }, []);

  const selectAll = useCallback((taskIds: string[]) => {
    setSelectedTasks(taskIds);
  }, []);

  return {
    selectedTasks,
    toggleTaskSelection,
    clearSelection,
    selectAll
  };
};
