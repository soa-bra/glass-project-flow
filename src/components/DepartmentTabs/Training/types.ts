
// Core Training Types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'onboarding' | 'technical' | 'management' | 'corporate' | 'workshop';
  type: 'internal' | 'external' | 'partnership';
  duration: number; // in hours
  status: 'draft' | 'published' | 'archived';
  instructor: string;
  maxStudents?: number;
  prerequisites?: string[];
  skills: string[];
  scormCompliant: boolean;
  xApiEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: 'video' | 'document' | 'quiz' | 'assignment' | 'live_session';
  content: string;
  duration: number; // in minutes
  completionCriteria: {
    type: 'time_based' | 'assessment_based' | 'interaction_based';
    threshold: number;
  };
  resources: Resource[];
}

export interface Resource {
  id: string;
  type: 'file' | 'link' | 'video' | 'document';
  title: string;
  url: string;
  size?: number;
  format?: string;
}

// Learning Management System Types
export interface Enrollment {
  id: string;
  courseId: string;
  studentId: string;
  enrolledAt: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'dropped' | 'failed';
  progress: number; // percentage
  completedModules: string[];
  timeSpent: number; // in minutes
  lastAccessed: string;
  certificateIssued?: boolean;
  grade?: number;
}

export interface TrainingSession {
  id: string;
  courseId: string;
  title: string;
  instructor: string;
  type: 'live' | 'workshop' | 'webinar';
  scheduledAt: string;
  duration: number; // in minutes
  location: string; // physical or virtual
  maxAttendees: number;
  registeredCount: number;
  waitingList: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  materials: Resource[];
}

// Certification and Badging Types
export interface Certificate {
  id: string;
  courseId: string;
  studentId: string;
  issuedAt: string;
  validUntil?: string;
  certificateNumber: string;
  digitalBadgeUrl: string;
  skills: string[];
  score: number;
  instructor: string;
  verificationCode: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  relatedCourses: string[];
}

export interface EmployeeSkillMatrix {
  employeeId: string;
  skills: {
    skillId: string;
    currentLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    targetLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    lastUpdated: string;
    certificationsEarned: string[];
  }[];
}

// Analytics and KPI Types
export interface TrainingMetrics {
  totalCourses: number;
  activeLearners: number;
  completionRate: number;
  averageScore: number;
  totalHoursDelivered: number;
  certificatesIssued: number;
  monthlyStats: {
    newEnrollments: number;
    coursesCompleted: number;
    sessionsConducted: number;
    revenue: number; // for external training
  };
  kirkpatrickMetrics: {
    reaction: number; // Level 1
    learning: number; // Level 2
    behavior: number; // Level 3
    results: number; // Level 4
  };
}

export interface LearningROI {
  courseId: string;
  totalCost: number;
  trainingHours: number;
  participantCount: number;
  performanceImprovement: number;
  businessImpact: number;
  roi: number; // percentage
  calculatedAt: string;
}

// Corporate and External Training Types
export interface CorporateProgram {
  id: string;
  clientId: string;
  title: string;
  description: string;
  customCourses: string[];
  contractValue: number;
  startDate: string;
  endDate: string;
  status: 'proposal' | 'contracted' | 'in_progress' | 'completed';
  participantCount: number;
  needsAssessment: NeedsAssessment;
  impactReport?: ImpactReport;
}

export interface NeedsAssessment {
  id: string;
  clientId: string;
  conductedBy: string;
  completedAt: string;
  skillGaps: {
    area: string;
    currentLevel: number;
    targetLevel: number;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }[];
  recommendations: string[];
  estimatedDuration: number;
  proposedSolutions: string[];
}

export interface ImpactReport {
  id: string;
  programId: string;
  generatedAt: string;
  preTrainingMetrics: Record<string, number>;
  postTrainingMetrics: Record<string, number>;
  behaviorChange: {
    metric: string;
    improvement: number;
    significance: 'low' | 'medium' | 'high';
  }[];
  businessResults: {
    kpi: string;
    beforeValue: number;
    afterValue: number;
    improvement: number;
  }[];
  clientSatisfaction: number;
  recommendations: string[];
}

// Partnership and Academic Types
export interface AcademicPartnership {
  id: string;
  partnerName: string;
  partnerType: 'university' | 'research_center' | 'professional_body';
  accreditationLevel: 'certificate' | 'diploma' | 'degree';
  sharedCourses: string[];
  creditHours: number;
  status: 'active' | 'pending' | 'suspended';
  agreementStartDate: string;
  agreementEndDate: string;
  contactPerson: string;
  accessPermissions: {
    subraAccess: string[];
    partnerAccess: string[];
  };
}

// Integration Types
export interface TrainingTimeEntry {
  timeEntryId: string;
  employeeId: string;
  courseId: string;
  sessionId?: string;
  hours: number;
  entryType: 'course_study' | 'live_session' | 'practical_application';
  projectId?: string; // for applied learning
  status: 'logged' | 'approved' | 'billed';
  loggedAt: string;
}

export interface SkillGapAlert {
  id: string;
  area: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedEmployees: string[];
  recommendedCourses: string[];
  businessImpact: string;
  createdAt: string;
  status: 'open' | 'addressing' | 'resolved';
}

// Dashboard and UI Types
export interface TrainingDashboardData {
  metrics: TrainingMetrics;
  recentEnrollments: Enrollment[];
  upcomingSessions: TrainingSession[];
  skillGapAlerts: SkillGapAlert[];
  topCourses: {
    courseId: string;
    title: string;
    enrollmentCount: number;
    completionRate: number;
    averageRating: number;
  }[];
  roiAnalysis: LearningROI[];
}

export type TrainingTabType = 
  | 'overview'
  | 'courses'
  | 'lms'
  | 'scheduling'
  | 'certifications'
  | 'analytics'
  | 'corporate'
  | 'partnerships'
  | 'templates'
  | 'reports';
