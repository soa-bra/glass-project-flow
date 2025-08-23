// CRM Opportunity Service
import { prisma, Opportunity, OpportunityStage } from '@/lib/prisma';

const Flow: Record<OpportunityStage, OpportunityStage[]> = {
  LEAD: ['QUALIFY'],
  QUALIFY: ['PROPOSAL', 'LOST'],
  PROPOSAL: ['WON', 'LOST'],
  WON: [],
  LOST: [],
};

export class OpportunityService {
  async moveOpportunity(id: string, to: OpportunityStage): Promise<Opportunity> {
    const opp = await prisma.findOpportunity(id);
    if (!opp) throw new Error('Opportunity not found');

    const allowed = Flow[opp.stage] || [];
    if (!allowed.includes(to)) {
      throw new Error(`Transition not allowed: ${opp.stage} -> ${to}`);
    }

    return prisma.updateOpportunity(id, { stage: to });
  }

  async createOpportunity(input: {
    accountId: string;
    stage?: OpportunityStage;
    value?: number;
    expectedClose?: Date;
  }): Promise<Opportunity> {
    const opportunity = {
      accountId: input.accountId,
      stage: input.stage || 'LEAD' as OpportunityStage,
      value: input.value,
      expectedClose: input.expectedClose,
    };

    return prisma.createOpportunity(opportunity);
  }

  async getOpportunities(): Promise<Opportunity[]> {
    return prisma.findManyOpportunities();
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    return prisma.findOpportunity(id);
  }

  async updateOpportunityValue(id: string, value: number): Promise<Opportunity> {
    return prisma.updateOpportunity(id, { value });
  }

  async markAsLost(id: string, reason: string): Promise<Opportunity> {
    return prisma.updateOpportunity(id, { 
      stage: 'LOST',
      reasonLost: reason 
    });
  }

  async getOpportunitiesByStage(stage: OpportunityStage): Promise<Opportunity[]> {
    const opportunities = await this.getOpportunities();
    return opportunities.filter(opp => opp.stage === stage);
  }

  async getPipelineStats(): Promise<{
    totalValue: number;
    countByStage: Record<OpportunityStage, number>;
    valueByStage: Record<OpportunityStage, number>;
    winRate: number;
  }> {
    const opportunities = await this.getOpportunities();
    
    const stats = {
      totalValue: 0,
      countByStage: {} as Record<OpportunityStage, number>,
      valueByStage: {} as Record<OpportunityStage, number>,
      winRate: 0
    };

    // Initialize counters
    const stages: OpportunityStage[] = ['LEAD', 'QUALIFY', 'PROPOSAL', 'WON', 'LOST'];
    stages.forEach(stage => {
      stats.countByStage[stage] = 0;
      stats.valueByStage[stage] = 0;
    });

    // Calculate stats
    let totalWon = 0;
    let totalLost = 0;

    opportunities.forEach(opp => {
      const value = opp.value || 0;
      stats.countByStage[opp.stage]++;
      stats.valueByStage[opp.stage] += value;
      
      if (opp.stage !== 'WON' && opp.stage !== 'LOST') {
        stats.totalValue += value;
      }

      if (opp.stage === 'WON') totalWon++;
      if (opp.stage === 'LOST') totalLost++;
    });

    // Calculate win rate
    const totalClosed = totalWon + totalLost;
    stats.winRate = totalClosed > 0 ? (totalWon / totalClosed) * 100 : 0;

    return stats;
  }
}

export const opportunityService = new OpportunityService();