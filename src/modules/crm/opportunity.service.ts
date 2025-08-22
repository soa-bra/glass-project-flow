export class OpportunityService {
  async getOpportunities() {
    return [{ id: '1', clientName: 'عميل', value: 50000, stage: 'LEAD' }];
  }
}