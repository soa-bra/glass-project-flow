import { useState, useEffect } from 'react';
import { 
  createEmployee, 
  updateEmployee,
  deleteEmployee,
  getEmployees,
  getEmployee,
  createTimeEntry,
  getTimeEntries,
  getEmployeeTimeEntries
} from '@/modules/hr-lite/hr-lite.service';
import { 
  CreateEmployeeInput,
  UpdateEmployeeInput,
  CreateTimeEntryInput
} from '@/modules/hr-lite/hr-lite.service';
import type { 
  Employee
} from '@/lib/prisma';

export function useHRLite() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الموظفين');
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeEntries = async () => {
    try {
      setLoading(true);
      const data = await getTimeEntries();
      setTimeEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل سجلات الحضور');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = async (input: CreateEmployeeInput) => {
    try {
      setLoading(true);
      const employee = await createEmployee(input);
      setEmployees(prev => [...prev, employee]);
      return employee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء الموظف');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (
    employeeId: string, 
    input: UpdateEmployeeInput
  ) => {
    try {
      setLoading(true);
      const employee = await updateEmployee(employeeId, input);
      setEmployees(prev => prev.map(e => e.id === employeeId ? employee : e));
      return employee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحديث الموظف');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      setLoading(true);
      await deleteEmployee(employeeId);
      setEmployees(prev => prev.filter(e => e.id !== employeeId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حذف الموظف');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimeEntry = async (input: CreateTimeEntryInput) => {
    try {
      const timeEntry = await createTimeEntry(input);
      setTimeEntries(prev => [...prev, timeEntry]);
      return timeEntry;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تسجيل الوقت');
      throw err;
    }
  };

  return {
    employees,
    timeEntries,
    loading,
    error,
    actions: {
      fetchEmployees,
      fetchTimeEntries,
      createEmployee: handleCreateEmployee,
      updateEmployee: handleUpdateEmployee,
      deleteEmployee: handleDeleteEmployee,
      createTimeEntry: handleCreateTimeEntry
    }
  };
}

export function useEmployee(employeeId: string) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (employeeId) {
      fetchEmployee();
      fetchEmployeeTimeEntries();
    }
  }, [employeeId]);

  const fetchEmployee = async () => {
    try {
      setLoading(true);
      const data = await getEmployee(employeeId);
      setEmployee(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل بيانات الموظف');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeTimeEntries = async () => {
    try {
      const data = await getEmployeeTimeEntries(employeeId);
      setTimeEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل سجلات الحضور');
    }
  };

  return {
    employee,
    timeEntries,
    loading,
    error,
    actions: {
      fetchEmployee,
      fetchEmployeeTimeEntries
    }
  };
}