
// CRM Types and Interfaces

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  country: string;
  city: string;
  website?: string;
  status: 'active' | 'inactive' | 'prospect' | 'churned';
  customerSince: string;
  lastContact: string;
  totalValue: number;
  nextFollowUp?: string;
  assignedManager: string;
  preferences: CustomerPreferences;
  specialNeeds: string[];
  interactionHistory: Interaction[];
  projects: CustomerProject[];
  satisfaction: {
    npsScore: number;
    lastSurveyDate: string;
    overallRating: number;
  };
  tags: string[];
  avatar?: string;
}

export interface CustomerPreferences {
  communicationChannel: 'email' | 'phone' | 'whatsapp' | 'meeting';
  contactTiming: string;
  language: 'ar' | 'en';
  meetingPreference: 'virtual' | 'inPerson' | 'either';
  documentFormat: 'pdf' | 'word' | 'both';
}

export interface Interaction {
  id: string;
  customerId: string;
  type: 'email' | 'call' | 'meeting' | 'whatsapp' | 'social' | 'support';
  direction: 'inbound' | 'outbound';
  subject: string;
  summary: string;
  date: string;
  duration?: number;
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: string;
  attachments: string[];
  sentimentScore: number;
  employeeId: string;
  employeeName: string;
}

export interface CustomerProject {
  id: string;
  name: string;
  status: 'inquiry' | 'proposal' | 'contract' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  value: number;
  description: string;
  phase: string;
  satisfaction?: number;
}

export interface Opportunity {
  id: string;
  customerId: string;
  customerName: string;
  title: string;
  description: string;
  value: number;
  currency: string;
  probability: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: 'website' | 'referral' | 'marketing' | 'cold-outreach' | 'social' | 'other';
  expectedCloseDate: string;
  actualCloseDate?: string;
  assignedTo: string;
  createdDate: string;
  lastActivityDate: string;
  nextSteps: string;
  competitors: string[];
  lossReason?: string;
  tags: string[];
  documents: OpportunityDocument[];
}

export interface OpportunityDocument {
  id: string;
  name: string;
  type: 'proposal' | 'contract' | 'presentation' | 'requirement' | 'other';
  url: string;
  uploadDate: string;
  version: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
}

export interface CustomerService {
  id: string;
  customerId: string;
  customerName: string;
  type: 'complaint' | 'inquiry' | 'request' | 'compliment';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  subject: string;
  description: string;
  category: string;
  subcategory: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  resolvedDate?: string;
  resolution?: string;
  satisfactionRating?: number;
  escalated: boolean;
  tags: string[];
  attachments: string[];
  responseTime: number;
  resolutionTime?: number;
}

export interface CRMAnalytics {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  churnRate: number;
  customerLifetimeValue: number;
  averageNPS: number;
  totalOpportunities: number;
  wonOpportunities: number;
  conversionRate: number;
  averageDealSize: number;
  salesFunnel: FunnelStage[];
  customerSatisfaction: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  monthlyRevenue: number;
  projectedRevenue: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  value: number;
  conversionRate: number;
}

export interface CRMTemplate {
  id: string;
  name: string;
  category: 'proposal' | 'contract' | 'email' | 'report' | 'survey';
  description: string;
  content: string;
  variables: string[];
  lastModified: string;
  usageCount: number;
  createdBy: string;
  tags: string[];
  isActive: boolean;
}

export interface CRMReport {
  id: string;
  title: string;
  type: 'customer' | 'sales' | 'service' | 'analytics' | 'performance';
  generatedDate: string;
  period: {
    from: string;
    to: string;
  };
  parameters: Record<string, any>;
  data: any;
  summary: string;
  insights: string[];
  recommendations: string[];
  charts?: ChartData[];
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'area' | 'funnel';
  title: string;
  data: any[];
  config: any;
}

export interface CRMIntegration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'zapier' | 'meta' | 'email';
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
  lastSync: string;
  syncStatus: 'success' | 'failed' | 'pending';
  errorMessage?: string;
}

export interface NPS {
  score: number;
  responses: number;
  promoters: number;
  passives: number;
  detractors: number;
  trend: 'up' | 'down' | 'stable';
  segments: NPSSegment[];
}

export interface NPSSegment {
  segment: string;
  score: number;
  responses: number;
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
  };
  keywords: string[];
  context: string;
}

export type CRMTabType = 
  | 'overview'
  | 'customers'
  | 'opportunities'
  | 'service'
  | 'analytics'
  | 'templates'
  | 'reports';

export interface CRMStats {
  totalCustomers: number;
  activeOpportunities: number;
  monthlyRevenue: number;
  npsScore: number;
  responseTime: number;
  conversionRate: number;
  customerSatisfaction: number;
  openTickets: number;
}
