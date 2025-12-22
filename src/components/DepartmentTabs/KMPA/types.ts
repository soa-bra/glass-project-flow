export interface KnowledgeDocument {
  id: string;
  title: string;
  type: "research" | "publication" | "report" | "guide" | "template" | "metric";
  category: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "review" | "published" | "archived";
  tags: string[];
  content: string;
  readCount: number;
  citations: number;
  downloads: number;
  version: string;
  permissions: {
    read: string[];
    write: string[];
    admin: string[];
  };
  metadata: {
    size: number;
    format: string;
    language: string;
    keywords: string[];
  };
}

export interface KnowledgeMetrics {
  totalDocuments: number;
  totalReads: number;
  totalCitations: number;
  totalDownloads: number;
  activeUsers: number;
  monthlyGrowth: number;
  topCategories: {
    name: string;
    count: number;
    percentage: number;
  }[];
}

export interface SoaBraMetric {
  id: string;
  name: string;
  nameEn: string;
  category: "cultural_identity" | "social_responsibility" | "brand_community" | "digital_communication" | "independent";
  description: string;
  scale: {
    min: number;
    max: number;
    levels: {
      range: string;
      label: string;
      description: string;
    }[];
  };
  criteria: {
    id: string;
    name: string;
    statements: {
      id: string;
      text: string;
      score: number;
      notes?: string;
    }[];
  }[];
  excelFile: string;
  lastUpdated: string;
  usage: number;
}

export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  status: "planning" | "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  researchers: string[];
  publications: string[];
  budget: number;
  progress: number;
  milestones: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

export interface AIRecommendation {
  id: string;
  type: "gap_analysis" | "content_suggestion" | "research_topic" | "citation_opportunity";
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  confidence: number;
  relatedDocuments: string[];
  createdAt: string;
  status: "pending" | "reviewed" | "implemented" | "dismissed";
}

export interface DocumentClassification {
  id: string;
  documentId: string;
  type: string;
  category: string;
  tags: string[];
  confidence: number;
  suggestedActions: string[];
  classifiedAt: string;
}

export interface KnowledgeGap {
  id: string;
  topic: string;
  description: string;
  searchQueries: string[];
  priority: "low" | "medium" | "high";
  suggestedResources: string[];
  identifiedAt: string;
  status: "identified" | "addressing" | "resolved";
}

export interface ContentAnalytics {
  documentId: string;
  views: number;
  downloads: number;
  shares: number;
  citations: number;
  engagement: {
    comments: number;
    ratings: number;
    averageRating: number;
  };
  geography: {
    country: string;
    views: number;
  }[];
  timeRange: {
    date: string;
    views: number;
  }[];
}
