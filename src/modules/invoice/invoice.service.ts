export class InvoiceService {
  async getInvoices() {
    return [{ id: '1', projectId: 'p1', total: 25000, status: 'PAID' }];
  }
}