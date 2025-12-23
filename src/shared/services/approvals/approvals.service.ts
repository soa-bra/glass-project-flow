/**
 * Enhanced Approvals Service
 * خدمة الموافقات المحسّنة
 */

// Input interface for creating approval requests
export interface ApprovalRequestInput {
  resourceType: string;
  resourceId: string;
  title: string;
  description?: string;
  approvers: string[];
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Approval request type
export interface ApprovalRequest {
  id: string;
  resourceType: string;
  resourceId: string;
  title: string;
  description?: string;
  approvers: string[];
  status: 'pending' | 'approved' | 'rejected';
  data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
}

// Approval event type
export interface ApprovalEvent {
  action: 'approved' | 'rejected';
  requestId: string;
  approverId: string;
  comments?: string;
  timestamp: Date;
}

// Event callback type
type ApprovalEventCallback = (event: ApprovalEvent) => void;

/**
 * Enhanced Approvals Service
 * Provides approval workflow management
 */
export class EnhancedApprovalsService {
  private requests: Map<string, ApprovalRequest> = new Map();
  private eventListeners: ApprovalEventCallback[] = [];
  private idCounter = 0;

  /**
   * Create a new approval request
   */
  async createApprovalRequest(input: ApprovalRequestInput): Promise<ApprovalRequest> {
    const id = `APR-${Date.now()}-${++this.idCounter}`;
    
    const request: ApprovalRequest = {
      id,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      title: input.title,
      description: input.description,
      approvers: input.approvers,
      status: 'pending',
      data: input.data,
      priority: input.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.requests.set(id, request);
    return request;
  }

  /**
   * Approve a request
   */
  async approveRequest(
    requestId: string,
    approverId: string,
    comments?: string
  ): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error(`Approval request ${requestId} not found`);
    }

    if (!request.approvers.includes(approverId)) {
      throw new Error(`User ${approverId} is not an approver for this request`);
    }

    request.status = 'approved';
    request.updatedAt = new Date();
    this.requests.set(requestId, request);

    // Emit event
    this.emitEvent({
      action: 'approved',
      requestId,
      approverId,
      comments,
      timestamp: new Date(),
    });
  }

  /**
   * Reject a request
   */
  async rejectRequest(
    requestId: string,
    approverId: string,
    comments?: string
  ): Promise<void> {
    const request = this.requests.get(requestId);
    if (!request) {
      throw new Error(`Approval request ${requestId} not found`);
    }

    if (!request.approvers.includes(approverId)) {
      throw new Error(`User ${approverId} is not an approver for this request`);
    }

    request.status = 'rejected';
    request.updatedAt = new Date();
    this.requests.set(requestId, request);

    // Emit event
    this.emitEvent({
      action: 'rejected',
      requestId,
      approverId,
      comments,
      timestamp: new Date(),
    });
  }

  /**
   * Get a request by ID
   */
  async getRequest(requestId: string): Promise<ApprovalRequest | null> {
    return this.requests.get(requestId) || null;
  }

  /**
   * Get all pending requests for an approver
   */
  async getPendingRequests(approverId: string): Promise<ApprovalRequest[]> {
    const pending: ApprovalRequest[] = [];
    
    this.requests.forEach((request) => {
      if (request.status === 'pending' && request.approvers.includes(approverId)) {
        pending.push(request);
      }
    });

    return pending.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Listen for approval events
   */
  onApprovalEvent(callback: ApprovalEventCallback): () => void {
    this.eventListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  /**
   * Emit an approval event
   */
  private emitEvent(event: ApprovalEvent): void {
    this.eventListeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in approval event listener:', error);
      }
    });
  }
}

// Export singleton instance
export const enhancedApprovalsService = new EnhancedApprovalsService();

// Convenience function
export const createApprovalRequest = (input: ApprovalRequestInput) =>
  enhancedApprovalsService.createApprovalRequest(input);
