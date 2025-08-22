export class ExpenseService {
  async getExpenses() {
    return [{ id: '1', description: 'مصروف', amount: 1000, status: 'approved' }];
  }
}