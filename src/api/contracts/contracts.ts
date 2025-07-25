// Contracts API
import { contractService } from '@/modules/contract/contract.service';

export class ContractsAPI {
  async getContracts() {
    try {
      return await contractService.getContracts();
    } catch (error) {
      throw new Error(`Failed to fetch contracts: ${error}`);
    }
  }

  async getContract(id: string) {
    try {
      return await contractService.getContract(id);
    } catch (error) {
      throw new Error(`Failed to fetch contract: ${error}`);
    }
  }

  async createContract(data: {
    accountId: string;
    projectId?: string;
    value: number;
    paymentTerms?: string;
    startDate: Date;
    endDate?: Date;
  }) {
    try {
      return await contractService.createContract(data);
    } catch (error) {
      throw new Error(`Failed to create contract: ${error}`);
    }
  }

  async getContractsByAccount(accountId: string) {
    try {
      return await contractService.getContractsByAccount(accountId);
    } catch (error) {
      throw new Error(`Failed to fetch contracts by account: ${error}`);
    }
  }

  async getContractsByProject(projectId: string) {
    try {
      return await contractService.getContractsByProject(projectId);
    } catch (error) {
      throw new Error(`Failed to fetch contracts by project: ${error}`);
    }
  }

  async getContractStats() {
    try {
      return await contractService.getContractStats();
    } catch (error) {
      throw new Error(`Failed to fetch contract stats: ${error}`);
    }
  }

  async generateContractReport(startDate: Date, endDate: Date) {
    try {
      return await contractService.generateContractReport(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to generate contract report: ${error}`);
    }
  }
}

export const contractsAPI = new ContractsAPI();