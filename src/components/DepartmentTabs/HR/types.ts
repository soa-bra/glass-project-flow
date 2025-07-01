
export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: string;
  employeeId: string;
  status: 'active' | 'inactive' | 'onLeave';
  skills: Skill[];
  avatar?: string;
  salary: number;
  manager?: string;
  emergencyContact: EmergencyContact;
  documents: Document[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  certifications?: string[];
  lastAssessed: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'certificate' | 'evaluation' | 'other';
  uploadDate: string;
  url: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours: number;
  status: 'present' | 'absent' | 'late' | 'halfDay';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  submittedDate: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewPeriod: string;
  overallRating: number;
  goals: Goal[];
  competencies: Competency[];
  feedback: string;
  developmentPlan: string[];
  reviewDate: string;
  reviewedBy: string;
  status: 'draft' | 'completed' | 'approved';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'pending' | 'inProgress' | 'completed' | 'overdue';
  progress: number;
  kpi?: string;
}

export interface Competency {
  name: string;
  rating: number;
  maxRating: number;
  comments?: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  qualifications: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  type: 'fullTime' | 'partTime' | 'contract' | 'internship';
  status: 'active' | 'paused' | 'closed';
  postedDate: string;
  applicationDeadline: string;
  applicationsCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  resume: string;
  coverLetter?: string;
  applicationDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  interviews: Interview[];
  notes: string;
  aiScore?: number;
}

export interface Interview {
  id: string;
  candidateId: string;
  interviewerName: string;
  scheduledDate: string;
  type: 'phone' | 'video' | 'inPerson' | 'technical';
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in hours
  format: 'online' | 'inPerson' | 'hybrid';
  instructor: string;
  maxParticipants: number;
  enrolledCount: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  materials: string[];
  cost: number;
}

export interface TrainingEnrollment {
  id: string;
  employeeId: string;
  programId: string;
  enrollmentDate: string;
  status: 'enrolled' | 'inProgress' | 'completed' | 'dropped';
  progress: number;
  completionDate?: string;
  certificateUrl?: string;
  feedback?: string;
  rating?: number;
}

export interface HRTemplate {
  id: string;
  name: string;
  category: 'contract' | 'evaluation' | 'policy' | 'form' | 'letter';
  description: string;
  fileUrl: string;
  lastModified: string;
  usageCount: number;
  createdBy: string;
  tags: string[];
}

export interface HRReport {
  id: string;
  title: string;
  type: 'attendance' | 'performance' | 'recruitment' | 'training' | 'workforce';
  generatedDate: string;
  parameters: Record<string, any>;
  data: any;
  summary: string;
  insights: string[];
  charts?: ChartData[];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area';
  title: string;
  data: any[];
  config: any;
}

export interface WorkforceAnalytics {
  totalEmployees: number;
  activeEmployees: number;
  newHires: number;
  turnoverRate: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
  };
  departmentDistribution: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  skillsGaps: Array<{
    skill: string;
    currentLevel: number;
    requiredLevel: number;
    gap: number;
  }>;
  performanceDistribution: {
    excellent: number;
    good: number;
    satisfactory: number;
    needsImprovement: number;
  };
}

export type HRTabType = 
  | 'overview'
  | 'employees' 
  | 'attendance'
  | 'performance'
  | 'recruitment'
  | 'training'
  | 'templates'
  | 'reports';

export interface HRStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  newHires: number;
  pendingReviews: number;
  openPositions: number;
  upcomingTraining: number;
  attendanceRate: number;
}
