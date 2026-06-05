/**
 * بيانات قسم الموارد البشرية
 * تم مسح جميع البيانات الوهمية للموظفين بناءً على طلب المستخدم.
 * الواجهات تعرض حالات فارغة حتى يتم ربطها بمصدر بيانات حقيقي (Supabase: hr_employees …).
 */
import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PerformanceReview,
  JobPosting,
  Candidate,
  TrainingProgram,
  HRTemplate,
  WorkforceAnalytics,
  HRStats,
} from "./types";

export const mockEmployees: Employee[] = [];
export const mockAttendanceRecords: AttendanceRecord[] = [];
export const mockLeaveRequests: LeaveRequest[] = [];
export const mockPerformanceReviews: PerformanceReview[] = [];
export const mockJobPostings: JobPosting[] = [];
export const mockCandidates: Candidate[] = [];
export const mockTrainingPrograms: TrainingProgram[] = [];
export const mockHRTemplates: HRTemplate[] = [];

export const mockWorkforceAnalytics: WorkforceAnalytics = {
  totalEmployees: 0,
  activeEmployees: 0,
  newHires: 0,
  turnoverRate: 0,
  averageAge: 0,
  genderDistribution: { male: 0, female: 0 },
  departmentDistribution: [],
  skillsGaps: [],
  performanceDistribution: {
    excellent: 0,
    good: 0,
    satisfactory: 0,
    needsImprovement: 0,
  },
};

export const mockHRStats: HRStats = {
  totalEmployees: 0,
  activeEmployees: 0,
  onLeave: 0,
  newHires: 0,
  pendingReviews: 0,
  openPositions: 0,
  upcomingTraining: 0,
  attendanceRate: 0,
};
