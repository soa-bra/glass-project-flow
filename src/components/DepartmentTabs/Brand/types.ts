
export interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'font' | 'color' | 'image' | 'template' | 'icon';
  category: string;
  url: string;
  thumbnail?: string;
  metadata: {
    size?: string;
    format?: string;
    dimensions?: string;
    colorProfile?: string;
  };
  usage: {
    projects: string[];
    downloads: number;
    lastUsed: string;
  };
  approval: {
    status: 'approved' | 'pending' | 'rejected';
    approvedBy?: string;
    approvedAt?: string;
    notes?: string;
  };
  tags: string[];
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface CulturalContent {
  id: string;
  title: string;
  type: 'article' | 'video' | 'podcast' | 'infographic' | 'presentation';
  content: string;
  author: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  culturalReview: {
    score: number;
    reviewer: string;
    notes: string;
    reviewedAt: string;
  };
  platforms: string[];
  scheduledDate?: string;
  publishedDate?: string;
  metrics: {
    views: number;
    engagement: number;
    shares: number;
    culturalImpact: number;
  };
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  type: 'lecture' | 'seminar' | 'workshop' | 'conference' | 'cultural_initiative';
  status: 'planning' | 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  date: string;
  duration: number;
  location: {
    type: 'physical' | 'virtual' | 'hybrid';
    address?: string;
    platform?: string;
  };
  audience: {
    target: string;
    capacity: number;
    registered: number;
    attended?: number;
  };
  speakers: {
    name: string;
    title: string;
    bio: string;
    image?: string;
  }[];
  culturalObjectives: string[];
  budget: {
    allocated: number;
    spent: number;
  };
  partnerships: string[];
  materials: string[];
  feedback: {
    rating: number;
    comments: string[];
    culturalImpact: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CulturalResearchProject {
  id: string;
  title: string;
  description: string;
  type: 'academic' | 'applied' | 'collaborative';
  status: 'proposal' | 'approved' | 'active' | 'completed' | 'published';
  researchers: {
    lead: string;
    team: string[];
    external?: string[];
  };
  timeline: {
    start: string;
    end: string;
    milestones: {
      title: string;
      date: string;
      completed: boolean;
    }[];
  };
  budget: {
    allocated: number;
    spent: number;
  };
  objectives: string[];
  methodology: string;
  expectedOutcomes: string[];
  publications: string[];
  culturalImpact: {
    predicted: number;
    actual?: number;
    assessment: string;
  };
  partnerships: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BrandMetrics {
  culturalHarmony: number;
  identityHealth: number;
  brandAwareness: number;
  culturalImpact: number;
  employeeEngagement: number;
  consistencyScore: number;
  messageResonance: number;
}

export interface AIBrandInsight {
  id: string;
  type: 'opportunity' | 'risk' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  category: 'cultural' | 'visual' | 'content' | 'strategic';
  actionItems: string[];
  relatedAssets: string[];
  createdAt: string;
  status: 'new' | 'reviewed' | 'implemented' | 'dismissed';
}
