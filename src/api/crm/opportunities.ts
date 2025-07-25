// CRM Opportunities API
import { opportunityService } from '@/modules/crm/opportunity.service';
import { OpportunityStage } from '@/lib/prisma';

export class OpportunitiesAPI {
  async getOpportunities() {
    try {
      return await opportunityService.getOpportunities();
    } catch (error) {
      throw new Error(`Failed to fetch opportunities: ${error}`);
    }
  }

  async getOpportunity(id: string) {
    try {
      return await opportunityService.getOpportunity(id);
    } catch (error) {
      throw new Error(`Failed to fetch opportunity: ${error}`);
    }
  }

  async createOpportunity(data: {
    accountId: string;
    stage?: OpportunityStage;
    value?: number;
    expectedClose?: Date;
  }) {
    try {
      return await opportunityService.createOpportunity(data);
    } catch (error) {
      throw new Error(`Failed to create opportunity: ${error}`);
    }
  }

  async moveOpportunity(id: string, stage: OpportunityStage) {
    try {
      return await opportunityService.moveOpportunity(id, stage);
    } catch (error) {
      throw new Error(`Failed to move opportunity: ${error}`);
    }
  }

  async updateOpportunityValue(id: string, value: number) {
    try {
      return await opportunityService.updateOpportunityValue(id, value);
    } catch (error) {
      throw new Error(`Failed to update opportunity value: ${error}`);
    }
  }

  async markAsLost(id: string, reason: string) {
    try {
      return await opportunityService.markAsLost(id, reason);
    } catch (error) {
      throw new Error(`Failed to mark opportunity as lost: ${error}`);
    }
  }

  async getPipelineStats() {
    try {
      return await opportunityService.getPipelineStats();
    } catch (error) {
      throw new Error(`Failed to fetch pipeline stats: ${error}`);
    }
  }

  async getOpportunitiesByStage(stage: OpportunityStage) {
    try {
      return await opportunityService.getOpportunitiesByStage(stage);
    } catch (error) {
      throw new Error(`Failed to fetch opportunities by stage: ${error}`);
    }
  }
}

export const opportunitiesAPI = new OpportunitiesAPI();