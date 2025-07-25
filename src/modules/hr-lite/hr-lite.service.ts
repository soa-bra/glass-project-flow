// HR Lite Service - Simple HR management
import { prisma, Employee } from '@/lib/prisma';

export interface CreateEmployeeInput {
  name: string;
  email?: string;
  position?: string;
  department?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface UpdateEmployeeInput {
  name?: string;
  email?: string;
  position?: string;
  department?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface CreateTimeEntryInput {
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  hours?: number;
  notes?: string;
}

// Employee Operations
export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  return await (prisma as any).createEmployee({
    ...input,
    status: input.status || 'active'
  });
}

export async function getEmployees(): Promise<Employee[]> {
  return await (prisma as any).findManyEmployees();
}

export async function getEmployee(id: string): Promise<Employee | null> {
  return await (prisma as any).findEmployee(id);
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput): Promise<Employee> {
  return await (prisma as any).updateEmployee(id, input);
}

export async function deleteEmployee(id: string): Promise<void> {
  return await (prisma as any).deleteEmployee(id);
}

// Time Entry Operations
export async function createTimeEntry(input: CreateTimeEntryInput): Promise<any> {
  return await (prisma as any).createTimeEntry(input);
}

export async function getTimeEntries(): Promise<any[]> {
  return await (prisma as any).findManyTimeEntries();
}

export async function getEmployeeTimeEntries(employeeId: string): Promise<any[]> {
  const timeEntries = await getTimeEntries();
  return timeEntries.filter(entry => entry.employeeId === employeeId);
}

export async function updateTimeEntry(id: string, input: Partial<CreateTimeEntryInput>): Promise<any> {
  return await (prisma as any).updateTimeEntry(id, input);
}

export async function deleteTimeEntry(id: string): Promise<void> {
  return await (prisma as any).deleteTimeEntry(id);
}

// HR Statistics
export async function getHRStats(): Promise<{
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  attendanceToday: number;
}> {
  const employees = await getEmployees();
  const timeEntries = await getTimeEntries();
  
  const today = new Date().toDateString();
  const attendanceToday = timeEntries.filter(entry => 
    new Date(entry.date).toDateString() === today
  ).length;

  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => (e as any).status === 'active').length,
    onLeaveEmployees: employees.filter(e => (e as any).status === 'on_leave').length,
    attendanceToday
  };
}

export async function generateAttendanceReport(startDate: Date, endDate: Date): Promise<{
  entries: any[];
  totalHours: number;
  averageHours: number;
}> {
  const timeEntries = await getTimeEntries();
  
  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });

  const totalHours = filteredEntries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  const averageHours = filteredEntries.length > 0 ? totalHours / filteredEntries.length : 0;

  return {
    entries: filteredEntries,
    totalHours,
    averageHours
  };
}