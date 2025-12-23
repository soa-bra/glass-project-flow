// Contract Service
import { prisma, Contract } from '@/lib/prisma';
import { nextVal } from '@/shared/services/sequence/sequence.service';

export class ContractService {
  async createContract(input: {
    accountId: string;
    projectId?: string;
    value: number;
    paymentTerms?: string;
    startDate: Date;
    endDate?: Date;
  }): Promise<Contract> {
    const number = await nextVal('CNTR');
    
    const contractData = {
      number,
      accountId: input.accountId,
      projectId: input.projectId,
      value: input.value,
      paymentTerms: input.paymentTerms,
      startDate: input.startDate,
      endDate: input.endDate,
    };

    return prisma.createContract(contractData);
  }

  async getContracts(): Promise<Contract[]> {
    return prisma.findManyContracts();
  }

  async getContract(id: string): Promise<Contract | null> {
    return prisma.findContract?.(id) || null;
  }

  async getContractsByAccount(accountId: string): Promise<Contract[]> {
    const contracts = await this.getContracts();
    return contracts.filter(contract => contract.accountId === accountId);
  }

  async getContractsByProject(projectId: string): Promise<Contract[]> {
    const contracts = await this.getContracts();
    return contracts.filter(contract => contract.projectId === projectId);
  }

  async updateContract(id: string, data: Partial<Contract>): Promise<Contract> {
    return prisma.updateContract?.(id, data) || 
           Promise.reject(new Error('Contract update not implemented'));
  }

  async getContractStats(): Promise<{
    totalValue: number;
    activeContracts: number;
    expiringThisMonth: number;
    averageValue: number;
  }> {
    const contracts = await this.getContracts();
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    const stats = {
      totalValue: 0,
      activeContracts: 0,
      expiringThisMonth: 0,
      averageValue: 0
    };

    contracts.forEach(contract => {
      stats.totalValue += contract.value;
      
      // Consider contract active if it hasn't ended or has no end date
      if (!contract.endDate || contract.endDate > now) {
        stats.activeContracts++;
      }

      // Check if expiring this month
      if (contract.endDate && contract.endDate <= nextMonth && contract.endDate > now) {
        stats.expiringThisMonth++;
      }
    });

    stats.averageValue = contracts.length > 0 ? stats.totalValue / contracts.length : 0;

    return stats;
  }

  async generateContractReport(startDate: Date, endDate: Date): Promise<{
    contracts: Contract[];
    totalValue: number;
    count: number;
  }> {
    const contracts = await this.getContracts();
    
    const filteredContracts = contracts.filter(contract => 
      contract.createdAt >= startDate && contract.createdAt <= endDate
    );

    const totalValue = filteredContracts.reduce((sum, contract) => sum + contract.value, 0);

    return {
      contracts: filteredContracts,
      totalValue,
      count: filteredContracts.length
    };
  }
}

export const contractService = new ContractService();