// Invoice Service
import { prisma, Invoice, InvoiceLine, Payment, InvoiceStatus } from '@/lib/prisma';
import { nextVal } from '@/shared/services/sequence';

export class InvoiceService {
  async createInvoice(input: {
    accountId: string;
    projectId?: string;
    lines: Array<{ 
      description: string; 
      quantity: number; 
      unitPrice: number; 
      taxCode?: string 
    }>;
    dueDate?: Date;
  }): Promise<Invoice> {
    return prisma.$transaction(async (tx) => {
      const number = await nextVal('INV');

      // Calculate total from lines
      const total = input.lines.reduce((sum, line) => sum + (line.quantity * line.unitPrice), 0);

      // Create invoice
      const invoice = await tx.createInvoice({
        number,
        accountId: input.accountId,
        projectId: input.projectId,
        total,
        dueDate: input.dueDate,
        status: 'draft' as InvoiceStatus,
      });

      // Create invoice lines
      for (const lineData of input.lines) {
        await tx.createInvoiceLine({
          invoiceId: invoice.id,
          description: lineData.description,
          quantity: lineData.quantity,
          unitPrice: lineData.unitPrice,
          taxCode: lineData.taxCode,
        });
      }

      return invoice;
    });
  }

  async postInvoice(id: string): Promise<Invoice> {
    return prisma.updateInvoice(id, { status: 'posted' });
  }

  async cancelInvoice(id: string): Promise<Invoice> {
    return prisma.updateInvoice(id, { status: 'canceled' });
  }

  async payInvoice(id: string, amount: number, method: string): Promise<void> {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.findInvoice(id);
      if (!invoice) throw new Error('Invoice not found');
      if (invoice.status !== 'posted') throw new Error('Only posted invoices can be paid');

      // Create payment record
      await tx.createPayment({
        invoiceId: id,
        method,
        amount,
        receivedAt: new Date(),
      });

      // Calculate total payments
      const paymentsTotal = await tx.aggregatePayments(id);
      const totalPaid = paymentsTotal._sum.amount || 0;

      // Update invoice status if fully paid
      const fullyPaid = totalPaid >= invoice.total;
      if (fullyPaid) {
        await tx.updateInvoice(id, { status: 'paid' });
      }
    });
  }

  async getInvoices(): Promise<Invoice[]> {
    return prisma.findManyInvoices();
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    return prisma.findInvoice(id);
  }

  async getInvoicesByAccount(accountId: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.accountId === accountId);
  }

  async getInvoicesByProject(projectId: string): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.projectId === projectId);
  }

  async getInvoicesByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    return invoices.filter(invoice => invoice.status === status);
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const invoices = await this.getInvoices();
    const now = new Date();
    
    return invoices.filter(invoice => 
      invoice.status === 'posted' && 
      invoice.dueDate && 
      invoice.dueDate < now
    );
  }

  async getInvoiceStats(): Promise<{
    totalOutstanding: number;
    totalPaid: number;
    totalDraft: number;
    overdueCount: number;
    averageInvoiceValue: number;
    totalRevenue: number;
  }> {
    const invoices = await this.getInvoices();
    
    const stats = {
      totalOutstanding: 0,
      totalPaid: 0,
      totalDraft: 0,
      overdueCount: 0,
      averageInvoiceValue: 0,
      totalRevenue: 0
    };

    const now = new Date();

    for (const invoice of invoices) {
      switch (invoice.status) {
        case 'posted':
          stats.totalOutstanding += invoice.total;
          if (invoice.dueDate && invoice.dueDate < now) {
            stats.overdueCount++;
          }
          break;
        case 'paid':
          stats.totalPaid += invoice.total;
          stats.totalRevenue += invoice.total;
          break;
        case 'draft':
          stats.totalDraft += invoice.total;
          break;
      }
    }

    stats.averageInvoiceValue = invoices.length > 0 ? 
      (stats.totalOutstanding + stats.totalPaid + stats.totalDraft) / invoices.length : 0;

    return stats;
  }

  async generateInvoiceReport(startDate: Date, endDate: Date): Promise<{
    invoices: Invoice[];
    totalRevenue: number;
    totalOutstanding: number;
    count: number;
  }> {
    const invoices = await this.getInvoices();
    
    const filteredInvoices = invoices.filter(invoice => 
      invoice.createdAt >= startDate && invoice.createdAt <= endDate
    );

    const totalRevenue = filteredInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const totalOutstanding = filteredInvoices
      .filter(inv => inv.status === 'posted')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      invoices: filteredInvoices,
      totalRevenue,
      totalOutstanding,
      count: filteredInvoices.length
    };
  }
}

export const invoiceService = new InvoiceService();