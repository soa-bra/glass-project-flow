// HR Lite Hooks - Employee lifecycle management
import { useState, useEffect } from 'react';
import {
  createEmployee,
  getEmployees,
  requestTimeOff,
  getTimeOffRequests,
  getTimeOffBalance,
  createAppraisalCycle,
  submitAppraisal,
  getAppraisalCycles,
  getEmployeeAppraisals,
  getHRDashboard,
  CreateEmployeeInput,
  TimeOffRequestInput,
  CreateAppraisalCycleInput,
  SubmitAppraisalInput
} from '@/modules/hr/hr.service';
import type { Employee, TimeOffRequest, AppraisalCycle } from '@/lib/prisma';

export function useHR() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [timeOffRequests, setTimeOffRequests] = useState<TimeOffRequest[]>([]);
  const [appraisalCycles, setAppraisalCycles] = useState<AppraisalCycle[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchTimeOffRequests();
    fetchAppraisalCycles();
    fetchDashboard();
  }, []);

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

  const fetchTimeOffRequests = async () => {
    try {
      const data = await getTimeOffRequests();
      setTimeOffRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل طلبات الإجازة');
    }
  };

  const fetchAppraisalCycles = async () => {
    try {
      const data = await getAppraisalCycles();
      setAppraisalCycles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل دورات التقييم');
    }
  };

  const fetchDashboard = async () => {
    try {
      const data = await getHRDashboard();
      setDashboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل لوحة التحكم');
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

  const handleRequestTimeOff = async (input: TimeOffRequestInput) => {
    try {
      setLoading(true);
      const request = await requestTimeOff(input);
      setTimeOffRequests(prev => [...prev, request]);
      return request;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في طلب الإجازة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAppraisalCycle = async (input: CreateAppraisalCycleInput) => {
    try {
      setLoading(true);
      const cycle = await createAppraisalCycle(input);
      setAppraisalCycles(prev => [...prev, cycle]);
      return cycle;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء دورة التقييم');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    timeOffRequests,
    appraisalCycles,
    dashboard,
    loading,
    error,
    actions: {
      fetchEmployees,
      fetchTimeOffRequests,
      fetchAppraisalCycles,
      fetchDashboard,
      createEmployee: handleCreateEmployee,
      requestTimeOff: handleRequestTimeOff,
      createAppraisalCycle: handleCreateAppraisalCycle
    }
  };
}