
// Marketing Dashboard Types
export interface MarketingKPIs {
  roas: number; // Return on Ad Spend
  cpa: number;  // Cost Per Acquisition
  ctr: number;  // Click Through Rate
  cpc: number;  // Cost Per Click
  conversionRate: number;
  totalSpent: number;
  totalRevenue: number;
  activeAudience: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'paid_ads' | 'email' | 'events' | 'print' | 'field_relations' | 'social_media' | 'content';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience: string[];
  channels: MarketingChannel[];
  objectives: string[];
  kpis: Partial<MarketingKPIs>;
  createdBy: string;
  approvalStatus: 'pending' | 'creative_review' | 'legal_review' | 'financial_review' | 'approved' | 'rejected';
  description: string;
}

export interface MarketingChannel {
  id: string;
  name: string;
  type: 'digital' | 'traditional' | 'social' | 'email' | 'direct';
  platform?: string; // Facebook, Instagram, LinkedIn, etc.
  status: 'active' | 'inactive' | 'paused';
  budget: number;
  spent: number;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpa: number;
  };
}

export interface MarketingAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'template' | 'brand_asset';
  category: 'social_media' | 'print' | 'digital_ads' | 'email' | 'presentations' | 'branding';
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  dimensions?: { width: number; height: number };
  createdBy: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'review' | 'approved' | 'expired' | 'archived';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  expiryDate?: string;
  licenseInfo?: string;
  tags: string[];
  brandCompliant: boolean;
}

export interface ContentCalendar {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'story' | 'ad' | 'email' | 'blog';
  platform: string[];
  scheduledDate: string;
  status: 'draft' | 'scheduled' | 'published' | 'cancelled';
  campaign?: string;
  assets: string[]; // Asset IDs
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  createdBy: string;
}

export interface Audience {
  id: string;
  name: string;
  description: string;
  criteria: {
    demographics: {
      ageRange: { min: number; max: number };
      gender: string[];
      location: string[];
      income?: { min: number; max: number };
    };
    interests: string[];
    behaviors: string[];
    customFilters: Record<string, any>;
  };
  size: number;
  source: 'crm' | 'platform' | 'custom';
  lastUpdated: string;
}

export interface MarketingPersona {
  id: string;
  name: string;
  description: string;
  demographics: {
    age: number;
    gender: string;
    location: string;
    occupation: string;
    income: number;
  };
  psychographics: {
    interests: string[];
    values: string[];
    lifestyle: string[];
    painPoints: string[];
    goals: string[];
  };
  preferredChannels: string[];
  messagingTone: string;
  contentPreferences: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketingBudget {
  id: string;
  name: string;
  totalBudget: number;
  spent: number;
  remaining: number;
  period: 'monthly' | 'quarterly' | 'yearly' | 'campaign';
  startDate: string;
  endDate: string;
  allocations: {
    channelId: string;
    channelName: string;
    allocated: number;
    spent: number;
  }[];
  alerts: {
    threshold: number; // percentage
    enabled: boolean;
  };
  status: 'active' | 'paused' | 'completed';
  approvedBy: string;
}

export interface AttributionData {
  touchpoint: string;
  channel: string;
  timestamp: string;
  value: number;
  attribution: {
    firstTouch: number;
    lastTouch: number;
    linear: number;
    timeDecay: number;
    positionBased: number;
  };
  conversionContribution: number;
}

export interface MarketingReport {
  id: string;
  title: string;
  type: 'campaign' | 'channel' | 'roi' | 'attribution' | 'audience' | 'comprehensive';
  period: { start: string; end: string };
  data: Record<string, any>;
  insights: string[];
  recommendations: string[];
  charts: {
    type: 'bar' | 'line' | 'pie' | 'funnel';
    data: any[];
    config: Record<string, any>;
  }[];
  generatedAt: string;
  generatedBy: string;
  aiGenerated: boolean;
}

export interface Alert {
  id: string;
  type: 'budget_exceeded' | 'campaign_ending' | 'asset_expiring' | 'performance_drop' | 'approval_needed';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  relatedItem: string;
  actionRequired: boolean;
  status: 'new' | 'acknowledged' | 'resolved';
}
