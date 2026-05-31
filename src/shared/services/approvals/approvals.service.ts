/**
 * Enhanced Approvals Service
 * خدمة الموافقات المحسّنة - تتكامل مع النظام الحالي
 */

import { approvalsService as existingApprovalsService } from '@/services/approvals';
import { CreateApprovalRequest, ApprovalRequest } from '@/types/approvals';

export interface ApprovalRequestInput {
  resource: string;
  resourceId: string;
  title: string;
  createdById: string;
  approvers: string[];
  data?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export class EnhancedApprovalsService {
  async createApprovalRequest(input: ApprovalRequestInput): Promise<ApprovalRequest> {
    // Map our input to the existing service format
    const createRequest: CreateApprovalRequest = {
      entityType: this.mapResourceToEntityType(input.resource),
      entityId: input.resourceId,
      data: {
        title: input.title,
        createdById: input.createdById,
        approvers: input.approvers,
        ...input.data
      },
      priority: input.priority || 'medium',
      context: {
        resource: input.resource,
        resourceId: input.resourceId
      }
    };

    return await existingApprovalsService.createApprovalRequest(createRequest);
  }

  async approveRequest(requestId: string, approverId: string, comments?: string): Promise<void> {
    await existingApprovalsService.approveRequest(requestId, comments);
    
    // Here we would normally trigger the actual approval logic
    // For now, we'll emit an event that can be handled by other services
    this.emitApprovalEvent('approved', requestId, approverId, comments);
  }

  async rejectRequest(requestId: string, approverId: string, comments?: string): Promise<void> {
    await existingApprovalsService.rejectRequest(requestId, comments);
    
    // Emit rejection event
    this.emitApprovalEvent('rejected', requestId, approverId, comments);
  }

  private mapResourceToEntityType(resource: string): 'expense' | 'project' | 'contract' | 'hr' | 'legal' | 'asset' {
    const mapping: Record<string, 'expense' | 'project' | 'contract' | 'hr' | 'legal' | 'asset'> = {
      expense: 'expense',
      contract: 'contract', 
      project: 'project',
      invoice: 'asset', // Map invoice to asset for now
      proposal: 'asset'
    };
    
    return mapping[resource] || 'asset';
  }

  private emitApprovalEvent(action: 'approved' | 'rejected', requestId: string, approverId: string, comments?: string) {
    // In a real application, this would use an event bus or message queue
    // For now, we'll use a custom event
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('approval-action', {
        detail: {
          action,
          requestId,
          approverId,
          comments,
          timestamp: new Date()
        }
      });
      
      window.dispatchEvent(event);
    }
  }

  // Method to listen for approval events (for integration with other services)
  onApprovalEvent(callback: (event: { action: string; requestId: string; approverId: string; comments?: string }) => void): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }
    
    const handler = (event: Event) => {
      callback((event as CustomEvent).detail);
    };
    
    window.addEventListener('approval-action', handler);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('approval-action', handler);
    };
  }
}

export const enhancedApprovalsService = new EnhancedApprovalsService();
export const createApprovalRequest = (input: ApprovalRequestInput) => 
  enhancedApprovalsService.createApprovalRequest(input);
