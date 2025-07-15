
import { useState, useCallback } from 'react';

export const useTaskSelection = (projectId?: string) => {
  const [selectedTasksMap, setSelectedTasksMap] = useState<Record<string, string[]>>({});
  
  const currentProjectId = projectId || 'default';
  const selectedTasks = selectedTasksMap[currentProjectId] || [];

  const toggleTaskSelection = useCallback((taskId: string) => {
    console.log(`تحديد/إلغاء تحديد المهمة: ${taskId} في المشروع: ${currentProjectId}`);
    setSelectedTasksMap(prev => {
      const currentSelected = prev[currentProjectId] || [];
      const newSelected = currentSelected.includes(taskId) 
        ? currentSelected.filter(id => id !== taskId)
        : [...currentSelected, taskId];
      
      console.log(`المهام المحددة في المشروع ${currentProjectId}:`, newSelected);
      
      return {
        ...prev,
        [currentProjectId]: newSelected
      };
    });
  }, [currentProjectId]);

  const clearSelection = useCallback(() => {
    console.log(`مسح التحديد للمشروع: ${currentProjectId}`);
    setSelectedTasksMap(prev => ({
      ...prev,
      [currentProjectId]: []
    }));
  }, [currentProjectId]);

  const selectAll = useCallback((taskIds: string[]) => {
    console.log(`تحديد الكل للمشروع ${currentProjectId}:`, taskIds);
    setSelectedTasksMap(prev => ({
      ...prev,
      [currentProjectId]: taskIds
    }));
  }, [currentProjectId]);

  return {
    selectedTasks,
    toggleTaskSelection,
    clearSelection,
    selectAll
  };
};
