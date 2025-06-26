
import { useEffect } from 'react';

interface DepartmentKeyboardShortcutsProps {
  departments: Array<{ id: string; name: string }>;
  onDepartmentSelect: (departmentId: string) => void;
}

const DepartmentKeyboardShortcuts = ({ departments, onDepartmentSelect }: DepartmentKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // التحقق من الضغط على Alt + رقم (1-9)
      if (event.altKey && event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        const index = parseInt(event.key) - 1;
        if (departments[index]) {
          onDepartmentSelect(departments[index].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [departments, onDepartmentSelect]);

  return null; // هذا المكون لا يعرض شيئاً، فقط يدير الاختصارات
};

export default DepartmentKeyboardShortcuts;
