// HR Lite Service - Complete employee lifecycle management
import { prisma, Employee, TimeOffRequest, AppraisalCycle, AppraisalSubmission } from '@/lib/prisma';
import { createApprovalRequest } from '@/shared/services/approvals/approvals.service';

export interface CreateEmployeeInput {
  userId: string;
  role: string;
  tribe?: string;
  costRate?: number;
}

export interface TimeOffRequestInput {
  employeeId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  approvers: string[];
  createdById: string;
  reason?: string;
}

export interface CreateAppraisalCycleInput {
  title: string;
  periodStart: Date;
  periodEnd: Date;
  questions: Array<{
    order: number;
    text: string;
    type: 'scale' | 'text';
  }>;
}

export interface SubmitAppraisalInput {
  cycleId: string;
  employeeId: string;
  answers: Array<{
    questionId: string;
    value: any;
  }>;
}

// Employee Management
export async function createEmployee(input: CreateEmployeeInput): Promise<Employee> {
  return await (prisma as any).createEmployee({
    userId: input.userId,
    role: input.role,
    tribe: input.tribe,
    costRate: input.costRate
  });
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee> {
  return await (prisma as any).updateEmployee(id, updates);
}

export async function getEmployees(): Promise<Employee[]> {
  return await (prisma as any).findManyEmployees();
}

export async function getEmployee(id: string): Promise<Employee | null> {
  return await (prisma as any).findEmployee(id);
}

export async function getEmployeeByUserId(userId: string): Promise<Employee | null> {
  return await (prisma as any).findEmployeeByUserId(userId);
}

// Time-off Management with Approval Integration
export async function requestTimeOff(input: TimeOffRequestInput): Promise<TimeOffRequest> {
  return await (prisma as any).$transaction(async (tx: any) => {
    // Create time-off request
    const request = await tx.createTimeOffRequest({
      employeeId: input.employeeId,
      type: input.type,
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'waiting'
    });

    // Calculate days
    const days = Math.ceil((input.endDate.getTime() - input.startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Create approval request
    await createApprovalRequest({
      resource: 'timeoff',
      resourceId: request.id,
      title: `طلب إجازة - ${input.type} (${days} أيام)`,
      createdById: input.createdById,
      approvers: input.approvers,
      data: {
        employeeId: input.employeeId,
        type: input.type,
        startDate: input.startDate,
        endDate: input.endDate,
        days,
        reason: input.reason
      },
      priority: days > 5 ? 'high' : 'medium'
    });

    return request;
  });
}

export async function approveTimeOff(id: string): Promise<TimeOffRequest> {
  return await (prisma as any).updateTimeOffRequest(id, { status: 'approved' });
}

export async function rejectTimeOff(id: string): Promise<TimeOffRequest> {
  return await (prisma as any).updateTimeOffRequest(id, { status: 'rejected' });
}

export async function cancelTimeOff(id: string): Promise<TimeOffRequest> {
  return await (prisma as any).updateTimeOffRequest(id, { status: 'canceled' });
}

export async function getTimeOffRequests(employeeId?: string): Promise<TimeOffRequest[]> {
  return await (prisma as any).findManyTimeOffRequests(employeeId);
}

export async function getTimeOffBalance(employeeId: string, year: number) {
  const requests = await (prisma as any).getApprovedTimeOffByYear(employeeId, year);
  
  // Calculate used days by type
  const usedDays = requests.reduce((acc: any, req: TimeOffRequest) => {
    const days = Math.ceil((req.endDate.getTime() - req.startDate.getTime()) / (1000 * 60 * 60 * 24));
    acc[req.type] = (acc[req.type] || 0) + days;
    return acc;
  }, {});

  // Standard allocations (configurable)
  const allocations = {
    vacation: 21,
    sick: 10,
    personal: 3
  };

  return {
    allocations,
    used: usedDays,
    remaining: Object.keys(allocations).reduce((acc: any, type) => {
      acc[type] = (allocations as any)[type] - (usedDays[type] || 0);
      return acc;
    }, {})
  };
}

// Appraisal Management
export async function createAppraisalCycle(input: CreateAppraisalCycleInput): Promise<AppraisalCycle> {
  return await (prisma as any).$transaction(async (tx: any) => {
    const cycle = await tx.createAppraisalCycle({
      title: input.title,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
      status: 'open'
    });

    const questions = await Promise.all(
      input.questions.map(q =>
        tx.createAppraisalQuestion({
          cycleId: cycle.id,
          text: q.text,
          type: q.type,
          order: q.order
        })
      )
    );

    return { ...cycle, questions };
  });
}

export async function submitAppraisal(input: SubmitAppraisalInput): Promise<AppraisalSubmission> {
  return await (prisma as any).$transaction(async (tx: any) => {
    // Check if cycle is open
    const cycle = await tx.findAppraisalCycle(input.cycleId);
    if (!cycle || cycle.status !== 'open') {
      throw new Error('Appraisal cycle is not open for submissions');
    }

    // Create or update submission
    const submission = await tx.upsertAppraisalSubmission({
      cycleId: input.cycleId,
      employeeId: input.employeeId
    });

    // Delete existing answers
    await tx.deleteAppraisalAnswers(submission.id);

    // Create new answers
    await Promise.all(
      input.answers.map(answer =>
        tx.createAppraisalAnswer({
          submissionId: submission.id,
          questionId: answer.questionId,
          value: answer.value
        })
      )
    );

    return submission;
  });
}

export async function closeAppraisalCycle(cycleId: string): Promise<AppraisalCycle> {
  return await (prisma as any).updateAppraisalCycle(cycleId, { status: 'closed' });
}

export async function getAppraisalCycles(): Promise<AppraisalCycle[]> {
  return await (prisma as any).findManyAppraisalCycles();
}

export async function getAppraisalCycle(id: string): Promise<AppraisalCycle | null> {
  return await (prisma as any).findAppraisalCycle(id);
}

export async function getEmployeeAppraisals(employeeId: string): Promise<AppraisalSubmission[]> {
  return await (prisma as any).findEmployeeAppraisals(employeeId);
}

// Analytics & Reporting
export async function generatePerformanceReport(cycleId: string) {
  const [cycle, submissions] = await Promise.all([
    (prisma as any).findAppraisalCycle(cycleId),
    (prisma as any).findAppraisalSubmissions(cycleId)
  ]);

  if (!cycle) throw new Error('Appraisal cycle not found');

  const analytics = {
    participationRate: submissions.length, // Would need total employee count
    averageScores: await (prisma as any).calculateAverageScores(cycleId),
    topPerformers: await (prisma as any).getTopPerformers(cycleId),
    improvementAreas: await (prisma as any).getImprovementAreas(cycleId),
    departmentBreakdown: await (prisma as any).getDepartmentBreakdown(cycleId)
  };

  return {
    cycle,
    analytics,
    submissions: submissions.length
  };
}

export async function getHRDashboard() {
  const [employees, activeRequests, activeCycles] = await Promise.all([
    getEmployees(),
    (prisma as any).findActiveTimeOffRequests(),
    (prisma as any).findActiveAppraisalCycles()
  ]);

  return {
    totalEmployees: employees.length,
    pendingTimeOff: activeRequests.length,
    activeAppraisals: activeCycles.length,
    teamDistribution: await (prisma as any).getTeamDistribution(),
    upcomingDeadlines: await (prisma as any).getUpcomingHRDeadlines()
  };
}

// Compliance & Reporting
export async function generateComplianceReport(startDate: Date, endDate: Date) {
  return {
    timeOffCompliance: await (prisma as any).getTimeOffCompliance(startDate, endDate),
    appraisalCompliance: await (prisma as any).getAppraisalCompliance(startDate, endDate),
    trainingCompliance: await (prisma as any).getTrainingCompliance(startDate, endDate)
  };
}