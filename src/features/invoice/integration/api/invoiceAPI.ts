/**
 * Invoice API
 * واجهة برمجة الفواتير
 */

import { invoiceRepository } from '../persistence/invoiceRepository';
import { InvoiceStatus as PrismaInvoiceStatus } from '@/lib/prisma';
import type { 
  Invoice, 
  InvoiceStats, 
  InvoiceReport, 
  CreateInvoiceInput,
} from '../../domain/types/invoice.types';

export class InvoiceAPI {
  async getInvoices(): Promise<Invoice[]> {
    try {
      return await invoiceRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch invoices: ${error}`);
    }
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    try {
      return await invoiceRepository.findById(id);
    } catch (error) {
      throw new Error(`Failed to fetch invoice: ${error}`);
    }
  }

  async createInvoice(data: CreateInvoiceInput): Promise<Invoice> {
    try {
      return await invoiceRepository.create(data);
    } catch (error) {
      throw new Error(`Failed to create invoice: ${error}`);
    }
  }

  async postInvoice(id: string): Promise<Invoice> {
    try {
      return await invoiceRepository.updateStatus(id, 'posted');
    } catch (error) {
      throw new Error(`Failed to post invoice: ${error}`);
    }
  }

  async cancelInvoice(id: string): Promise<Invoice> {
    try {
      return await invoiceRepository.updateStatus(id, 'canceled');
    } catch (error) {
      throw new Error(`Failed to cancel invoice: ${error}`);
    }
  }

  async payInvoice(id: string, amount: number, method: string): Promise<void> {
    try {
      return await invoiceRepository.recordPayment(id, amount, method);
    } catch (error) {
      throw new Error(`Failed to process payment: ${error}`);
    }
  }

  async getInvoicesByAccount(accountId: string): Promise<Invoice[]> {
    try {
      return await invoiceRepository.findByAccount(accountId);
    } catch (error) {
      throw new Error(`Failed to fetch invoices by account: ${error}`);
    }
  }

  async getInvoicesByProject(projectId: string): Promise<Invoice[]> {
    try {
      return await invoiceRepository.findByProject(projectId);
    } catch (error) {
      throw new Error(`Failed to fetch invoices by project: ${error}`);
    }
  }

  async getInvoicesByStatus(status: PrismaInvoiceStatus): Promise<Invoice[]> {
    try {
      return await invoiceRepository.findByStatus(status);
    } catch (error) {
      throw new Error(`Failed to fetch invoices by status: ${error}`);
    }
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    try {
      return await invoiceRepository.findOverdue();
    } catch (error) {
      throw new Error(`Failed to fetch overdue invoices: ${error}`);
    }
  }

  async getInvoiceStats(): Promise<InvoiceStats> {
    try {
      return await invoiceRepository.getStats();
    } catch (error) {
      throw new Error(`Failed to fetch invoice stats: ${error}`);
    }
  }

  async generateInvoiceReport(startDate: Date, endDate: Date): Promise<InvoiceReport> {
    try {
      return await invoiceRepository.generateReport(startDate, endDate);
    } catch (error) {
      throw new Error(`Failed to generate invoice report: ${error}`);
    }
  }
}

export const invoiceAPI = new InvoiceAPI();
