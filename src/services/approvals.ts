import type { 
  ApprovalRequest, 
  ApprovalRule, 
  ApprovalDashboardStats, 
  CreateApprovalRequest,
  ApprovalAction
} from '@/types/approvals';

// Mock data for development
const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    entityType: 'expense',
    entityId: 'exp-001',
    requesterId: 'user-1',
    status: 'pending',
    priority: 'medium',
    data: { amount: 5000, description: 'Marketing Campaign' },
    ruleId: 'rule-1',
    requiredApprovers: 2,
    currentLevel: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    approvers: []
  }
];

const mockApprovalRules: ApprovalRule[] = [
  {
    id: 'rule-1',
    entityType: 'expense',
    condition: { amount: { gte: 1000 } },
    requiredApprovers: 2,
    approverRoles: ['finance_manager', 'department_head'],
    timeoutMinutes: 1440,
    escalationRoles: ['cfo'],
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class ApprovalsService {
  // Mock implementation - replace with actual API calls when Supabase is integrated
  
  async getApprovalRequests(status?: string): Promise<ApprovalRequest[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
    
    if (status) {
      return mockApprovalRequests.filter(req => req.status === status);
    }
    return mockApprovalRequests;
  }

  async createApprovalRequest(request: CreateApprovalRequest): Promise<ApprovalRequest> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const newRequest: ApprovalRequest = {
      id: Date.now().toString(),
      ...request,
      priority: request.priority || 'medium',
      requesterId: 'current-user', // TODO: Get from auth context
      status: 'pending',
      ruleId: 'rule-1', // TODO: Determine from rules engine
      requiredApprovers: 2,
      currentLevel: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      approvers: []
    };
    
    mockApprovalRequests.push(newRequest);
    return newRequest;
  }

  async approveRequest(requestId: string, comments?: string): Promise<ApprovalAction> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const action: ApprovalAction = {
      id: Date.now().toString(),
      requestId,
      approverId: 'current-user', // TODO: Get from auth context
      action: 'approved',
      level: 1,
      comments,
      createdAt: new Date().toISOString()
    };

    // Update mock data
    const request = mockApprovalRequests.find(r => r.id === requestId);
    if (request) {
      request.approvers.push(action);
      request.updatedAt = new Date().toISOString();
      
      // Check if fully approved
      if (request.approvers.filter(a => a.action === 'approved').length >= request.requiredApprovers) {
        request.status = 'approved';
      }
    }

    return action;
  }

  async rejectRequest(requestId: string, comments?: string): Promise<ApprovalAction> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const action: ApprovalAction = {
      id: Date.now().toString(),
      requestId,
      approverId: 'current-user', // TODO: Get from auth context
      action: 'rejected',
      level: 1,
      comments,
      createdAt: new Date().toISOString()
    };

    // Update mock data
    const request = mockApprovalRequests.find(r => r.id === requestId);
    if (request) {
      request.approvers.push(action);
      request.status = 'rejected';
      request.updatedAt = new Date().toISOString();
    }

    return action;
  }

  async getDashboardStats(): Promise<ApprovalDashboardStats> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      pending: mockApprovalRequests.filter(r => r.status === 'pending').length,
      approved: mockApprovalRequests.filter(r => r.status === 'approved').length,
      rejected: mockApprovalRequests.filter(r => r.status === 'rejected').length,
      overdue: 0, // TODO: Calculate based on expiresAt
      myPending: mockApprovalRequests.filter(r => r.status === 'pending').length // TODO: Filter by current user
    };
  }

  async getApprovalRules(): Promise<ApprovalRule[]> {
    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockApprovalRules;
  }
}

export const approvalsService = new ApprovalsService();