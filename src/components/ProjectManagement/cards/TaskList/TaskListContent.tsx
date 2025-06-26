import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import TaskCard from '@/components/TaskCard';
import { useTaskSelection } from '@/hooks/useTaskSelection';

export const TaskListContent: React.FC = () => {
  const {
    selectedTasks,
    toggleTaskSelection,
    clearSelection
  } = useTaskSelection();
  const [showBulkArchiveDialog, setShowBulkArchiveDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [tasks, setTasks] = useState([{
    id: 1,
    title: 'تصميم الواجهة',
    description: 'تطوير موقع سوبرا',
    status: 'وفق الخطة',
    statusColor: '#A1E8B8',
    date: '28 May',
    assignee: 'د. أسامة',
    members: 'غير مضيف',
    daysLeft: 1,
    priority: 'urgent-not-important' as const
  }, {
    id: 2,
    title: 'كتابة الكود',
    description: 'تطوير موقع سوبرا',
    status: 'وفق الخطة',
    statusColor: '#A1E8B8',
    date: '29 May',
    assignee: 'د. أسامة',
    members: 'عضو',
    daysLeft: 2,
    priority: 'urgent-important' as const
  }, {
    id: 3,
    title: 'تطوير قواعد البيانات',
    description: 'تطوير موقع سوبرا',
    status: 'وفق الخطة',
    statusColor: '#A1E8B8',
    date: '01 Jun',
    assignee: 'د. أسامة',
    members: 'عضوين',
    daysLeft: 5,
    priority: 'not-urgent-important' as const
  }, {
    id: 4,
    title: 'التسليم',
    description: 'تسليم الموقع النهائي',
    status: 'وفق الخطة',
    statusColor: '#A1E8B8',
    date: '05 Jun',
    assignee: 'د. أسامة',
    members: 'غير مضيف',
    daysLeft: 10,
    priority: 'not-urgent-not-important' as const
  }]);
  const handleTaskSelect = (taskId: string) => {
    console.log('تحديد/إلغاء تحديد المهمة:', taskId);
    toggleTaskSelection(taskId);

    // تفعيل نمط التحديد عند تحديد أول مهمة
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    }
  };
  const handleClearSelection = () => {
    clearSelection();
    setIsSelectionMode(false);
  };
  const handleTaskEdit = (taskId: string) => {
    console.log('تعديل المهمة:', taskId);
    // سيتم تنفيذ modal التعديل لاحقاً
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
    setIsSelectionMode(false);
    setShowBulkArchiveDialog(false);
    console.log('تم أرشفة المهام المحددة:', selectedTasks);
  };
  const handleBulkDelete = () => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id.toString())));
    clearSelection();
    setIsSelectionMode(false);
    setShowBulkDeleteDialog(false);
    console.log('تم حذف المهام المحددة:', selectedTasks);
  };
  return <>
      {/* شريط الإجراءات الجماعية */}
      {selectedTasks.length > 0 && <div style={{
      direction: 'rtl',
      backgroundColor: 'transparent',
      border: '1px solid rgba(59, 130, 246, 0.2)'
    }} className="mb-4 p-3 flex justify-between items-center font-arabic bg-transparent">
          <span style={{
        color: '#000000'
      }} className="text-sm">
            تم تحديد {selectedTasks.length} مهمة
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowBulkArchiveDialog(true)} 
              style={{
                backgroundColor: '#fbe2aa'
              }}
              className="px-3 py-1 text-sm transition-colors rounded-full text-black hover:opacity-80"
            >
              أرشفة المحدد
            </button>
            <button 
              onClick={() => setShowBulkDeleteDialog(true)} 
              style={{
                backgroundColor: '#f1b5b9'
              }}
              className="px-3 py-1 text-sm transition-colors rounded-full text-black hover:opacity-80"
            >
              حذف المحدد
            </button>
            <button onClick={handleClearSelection} className="px-3 py-1 text-sm transition-colors bg-gray-500 hover:bg-gray-400 rounded-full text-black">
              إلغاء التحديد
            </button>
          </div>
        </div>}

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 pr-1 py-0 my-0">
          {tasks.map(task => <div key={task.id} className={`transition-all duration-200 ${selectedTasks.includes(task.id.toString()) ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
              <TaskCard {...task} isSelected={selectedTasks.includes(task.id.toString())} isSelectionMode={isSelectionMode} onSelect={handleTaskSelect} onEdit={handleTaskEdit} onArchive={handleTaskArchive} onDelete={handleTaskDelete} />
            </div>)}
        </div>
      </div>

      {/* حوار تأكيد الأرشفة الجماعية */}
      <AlertDialog open={showBulkArchiveDialog} onOpenChange={setShowBulkArchiveDialog}>
        <AlertDialogContent 
          className="font-arabic" 
          style={{
            direction: 'rtl',
            zIndex: 9999
          }}
        >
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
        <AlertDialogContent 
          className="font-arabic" 
          style={{
            direction: 'rtl',
            zIndex: 9999
          }}
        >
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
    </>;
};
