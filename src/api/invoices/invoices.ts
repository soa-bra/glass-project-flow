// Invoices API
import { invoiceService } from '@/modules/invoice/invoice.service';
import { InvoiceStatus } from '@/lib/prisma';

export class InvoicesAPI {
  async getInvoices() {
    try {
      return await invoiceService.getInvoices();
    } catch (error) {
      throw new Error(`Failed to fetch invoices: ${error}`);
    }
  }

  async getInvoice(id: string) {
    try {
      return await invoiceService.getInvoice(id);
    } catch (error) {
      throw new Error(`Failed to fetch invoice: ${error}`);
    }
  }

  async createInvoice(data: {
    accountId: string;
    projectId?: string;
    lines: Array<{ 
      description: string; 
      quantity: number; 
      unitPrice: number; 
      taxCode?: string 
    }>;
    dueDate?: Date;
  }) {
    try {
      return await invoiceService.createInvoice(data);
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error}`);
    }
  }

  async postInvoice(id: string) {
    try {
      return await invoiceService.postInvoice(id);
    } catch (error) {
      throw new Error(`Failed to post invoice: ${error}`);
    }
  }

  async cancelInvoice(id: string) {
    try {
      return await invoiceService.cancelInvoice(id);
    } catch (error) {
      throw new Error(`Failed to cancel invoice: ${error}`);
    }
  }

  async payInvoice(id: string, amount: number, method: string) {
    try {
      return await invoiceService.payInvoice(id, amount, method);
    } catch (error) {
      throw new Error(`Failed to process payment: ${error}`);
    }
  }

  async getInvoicesByAccount(accountId: string) {
    try {
      return await invoiceService.getInvoicesByAccount(accountId);
    } catch (error) {
      throw new Error(`Failed to fetch invoices by account: ${error}`);
    }
  }

  async getInvoicesByProject(projectId: string) {
    try {
      return await invoiceService.getInvoicesByProject(projectId);
    } catch (error) {
      throw new Error(`Failed to fetch invoices by project: ${error}`);
    }
  }

  async getInvoicesByStatus(status: InvoiceStatus) {
    try {
      return await invoiceService.getInvoicesByStatus(status);
    } catch (error) {
      throw new Error(`Failed to fetch invoices by status: ${error}`);
    }
  }

  async getOverdueInvoices() {
    try {
      return await invoiceService.getOverdueInvoices();
    } catch (error) {
      throw new Error(`Failed to fetch overdue invoices: ${error}`);
    }
  }

  async getInvoiceStats() {
    try {
      return await invoiceService.getInvoiceStats();
    } catch (error) {
      throw new Error(`Failed to fetch invoice stats: ${error}`);
    }
  }

  async generateInvoiceReport(startDate: Date, endDate: Date) {
    try {
      return await invoiceService.generateInvoiceReport(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to generate invoice report: ${error}`);
    }
  }
}

export const invoicesAPI = new InvoicesAPI();