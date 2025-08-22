export class ContractService {
  async getContracts() {
    return [{ id: '1', projectId: 'p1', value: 100000, status: 'active' }];
  }
  async getContract(id: string) {
    return { id, projectId: 'p1', value: 100000, status: 'active' };
  }
  async createContract(data: any) {
    return { id: 'new', ...data };
  }
}