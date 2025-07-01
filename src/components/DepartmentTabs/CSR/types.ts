
export interface CSRInitiative {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'suspended';
  category: 'education' | 'environment' | 'economic_empowerment' | 'health' | 'community';
  budget: number;
  allocatedBudget: number;
  startDate: string;
  endDate: string;
  beneficiaries: number;
  sdgGoals: string[];
  manager: string;
  team: string[];
  partnerships: string[];
  impact: {
    socialImpactIndex: number;
    sroi: number;
    volunteerHours: number;
    directBeneficiaries: number;
    indirectBeneficiaries: number;
  };
  theoryOfChange: {
    problem: string;
    inputs: string[];
    activities: string[];
    outputs: string[];
    outcomes: string[];
    impact: string[];
  };
  kpis: {
    id: string;
    metric: string;
    target: number;
    achieved: number;
    unit: string;
  }[];
}

export interface CSRPartner {
  id: string;
  name: string;
  type: 'government' | 'ngo' | 'private' | 'international';
  contactPerson: string;
  email: string;
  phone: string;
  expertise: string[];
  capacity: 'high' | 'medium' | 'low';
  previousProjects: number;
  rating: number;
  contractId?: string;
  contractStatus?: 'draft' | 'signed' | 'expired';
  partnership: {
    startDate: string;
    endDate?: string;
    contributions: string[];
    responsibilities: string[];
  };
}

export interface CSRStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  images: string[];
  videos: string[];
  initiativeId: string;
  publishDate: string;
  author: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  engagement: {
    views: number;
    shares: number;
    likes: number;
    comments: number;
  };
  tags: string[];
}

export interface CSREvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'fieldwork' | 'training' | 'awareness' | 'volunteer';
  date: string;
  location: string;
  duration: number;
  capacity: number;
  registered: number;
  attended: number;
  initiativeId: string;
  organizer: string;
  volunteers: string[];
  resources: string[];
  feedback: {
    averageRating: number;
    responses: number;
    comments: string[];
  };
}

export interface CSRReport {
  id: string;
  title: string;
  type: 'impact' | 'esg' | 'sdg' | 'sroi' | 'annual';
  period: {
    start: string;
    end: string;
  };
  initiatives: string[];
  generatedDate: string;
  generatedBy: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  metrics: {
    totalBudget: number;
    totalBeneficiaries: number;
    totalVolunteerHours: number;
    averageSROI: number;
    sdgContribution: {
      goal: string;
      percentage: number;
    }[];
  };
  attachments: string[];
}

export interface CSRTemplate {
  id: string;
  name: string;
  description: string;
  category: 'proposal' | 'agreement' | 'report' | 'evaluation' | 'contract';
  fileUrl: string;
  variables: string[];
  isActive: boolean;
  usageCount: number;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  tags: string[];
}

export interface CSRVolunteer {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  skills: string[];
  availability: {
    days: string[];
    hours: number;
  };
  experience: string[];
  preferences: string[];
  totalHours: number;
  currentInitiatives: string[];
  rating: number;
  feedback: string[];
}

export interface CSRDashboardData {
  overview: {
    totalInitiatives: number;
    activeInitiatives: number;
    totalBeneficiaries: number;
    totalVolunteerHours: number;
    totalBudget: number;
    averageSROI: number;
    socialImpactIndex: number;
  };
  initiatives: CSRInitiative[];
  partners: CSRPartner[];
  stories: CSRStory[];
  events: CSREvent[];
  volunteers: CSRVolunteer[];
  reports: CSRReport[];
  templates: CSRTemplate[];
}
