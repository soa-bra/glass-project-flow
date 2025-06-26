
import React, { useState } from 'react';
import { HiPlus, HiStar, HiArrowLeft } from 'react-icons/hi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TaskCard from './TaskCard';
import { useTaskSelection } from '@/hooks/useTaskSelection';
import type { TaskCardProps } from './TaskCard/types';

const TaskColumn: React.FC = () => {
  const { selectedTasks, toggleTaskSelection, clearSelection } = useTaskSelection();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showBulkArchiveDialog, setShowBulkArchiveDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [tasks, setTasks] = useState<TaskCardProps[]>([
    {
      id: 1,
      title: 'تصميم الواجهة',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '28 May',
      assignee: 'د. أسامة',
      members: 'غير مضيف',
      daysLeft: 1,
      priority: 'urgent-not-important'
    },
    {
      id: 2,
      title: 'كتابة الكود',
      description: 'تطوير موقع سوبرا',
      status: 'وفق الخطة',
      statusColor: '#A1E8B8',
      date: '29 May',
      assignee: 'د. أسامة',
      members: 'عضو',
      daysLeft: 1,
      priority: 'urgent-important'
    },
  ]);

  const handleTaskSelect = (taskId: string) => {
    toggleTaskSelection(taskId);
  };

  const handleTaskEdit = (taskId: string) => {
    console.log('تعديل المهمة:', taskId);
  };

  const handleTaskArchive = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== parseInt(taskId)));
    console.log('تم أرشفة المهمة:', taskId);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== parseInt(taskId)));
    console.log('تم حذف المهمة:', taskId);
  };

  const handleBulkArchive = () => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id.toString())));
    clearSelection();
    setShowBulkArchiveDialog(false);
    console.log('تم أرشفة المهام المحددة:', selectedTasks);
  };

  const handleBulkDelete = () => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id.toString())));
    clearSelection();
    setShowBulkDeleteDialog(false);
    console.log('تم حذف المهام المحددة:', selectedTasks);
  };

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden rounded-t-3xl"
      style={{
        background: 'var(--backgrounds-project-column-bg)',
      }}
    >
      <div className="flex-shrink-0 px-4 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">قائمة المهام</h2>
          <div className="flex gap-2 text-gray-600">
            <button onClick={() => setShowAddTaskModal(true)}><HiPlus /></button>
            <button><HiStar /></button>
            <button><HiArrowLeft /></button>
          </div>
        </div>

        {/* شريط الإجراءات الجماعية */}
        {selectedTasks.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center font-arabic" style={{ direction: 'rtl' }}>
            <span className="text-sm text-blue-700">
              تم تحديد {selectedTasks.length} مهمة
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowBulkArchiveDialog(true)}
                className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
              >
                أرشفة المحدد
              </button>
              <button 
                onClick={() => setShowBulkDeleteDialog(true)}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                حذف المحدد
              </button>
              <button 
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
              >
                إلغاء التحديد
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden rounded-t-3xl">
        <ScrollArea className="h-full w-full">
          <div className="space-y-2 pb-4 mx-[5px]">
            {tasks.map(task => (
              <div 
                key={task.id}
                className={`${selectedTasks.includes(task.id.toString()) ? 'ring-2 ring-blue-400' : ''}`}
              >
                <TaskCard 
                  {...task} 
                  onSelect={handleTaskSelect}
                  onEdit={handleTaskEdit}
                  onArchive={handleTaskArchive}
                  onDelete={handleTaskDelete}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* حوار تأكيد الأرشفة الجماعية */}
      <AlertDialog open={showBulkArchiveDialog} onOpenChange={setShowBulkArchiveDialog}>
        <AlertDialogContent className="font-arabic" style={{ direction: 'rtl' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الأرشفة الجماعية</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد أرشفة {selectedTasks.length} مهمة؟ يمكنك استعادتها لاحقاً من الأرشيف.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkArchive}>أرشفة الكل</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* حوار تأكيد الحذف الجماعي */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent className="font-arabic" style={{ direction: 'rtl' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف الجماعي</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من أنك تريد حذف {selectedTasks.length} مهمة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              حذف الكل نهائياً
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskColumn;
