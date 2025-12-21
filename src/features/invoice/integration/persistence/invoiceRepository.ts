/**
 * Invoice Repository
 * طبقة الوصول للبيانات
 */

import { prisma, Invoice as PrismaInvoice, InvoiceLine as PrismaInvoiceLine, InvoiceStatus } from '@/lib/prisma';
import { nextVal } from '@/core/sequence/sequence.service';
import type { 
  Invoice, 
  InvoiceStats, 
  InvoiceReport, 
  CreateInvoiceInput 
} from '../../domain/types/invoice.types';

export class InvoiceRepository {
  async create(input: CreateInvoiceInput): Promise<Invoice> {
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

      return invoice as unknown as Invoice;
    });
  }

  async updateStatus(id: string, status: InvoiceStatus): Promise<Invoice> {
    return prisma.updateInvoice(id, { status }) as unknown as Promise<Invoice>;
  }

  async recordPayment(id: string, amount: number, method: string): Promise<void> {
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
      if (totalPaid >= invoice.total) {
        await tx.updateInvoice(id, { status: 'paid' });
      }
    });
  }

  async findAll(): Promise<Invoice[]> {
    return prisma.findManyInvoices() as unknown as Promise<Invoice[]>;
  }

  async findById(id: string): Promise<Invoice | null> {
    return prisma.findInvoice(id) as unknown as Promise<Invoice | null>;
  }

  async findByAccount(accountId: string): Promise<Invoice[]> {
    const invoices = await this.findAll();
    return invoices.filter(invoice => invoice.accountId === accountId);
  }

  async findByProject(projectId: string): Promise<Invoice[]> {
    const invoices = await this.findAll();
    return invoices.filter(invoice => invoice.projectId === projectId);
  }

  async findByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    const invoices = await this.findAll();
    return invoices.filter(invoice => invoice.status === status);
  }

  async findOverdue(): Promise<Invoice[]> {
    const invoices = await this.findAll();
    const now = new Date();
    
    return invoices.filter(invoice => 
      invoice.status === 'posted' && 
      invoice.dueDate && 
      new Date(invoice.dueDate as string) < now
    );
  }

  async getStats(): Promise<InvoiceStats> {
    const invoices = await this.findAll();
    
    const stats: InvoiceStats = {
      totalOutstanding: 0,
      totalPaid: 0,
      totalDraft: 0,
      overdueCount: 0,
      averageInvoiceValue: 0,
      totalRevenue: 0,
    };

    const now = new Date();

    for (const invoice of invoices) {
      switch (invoice.status) {
        case 'posted':
          stats.totalOutstanding += invoice.total;
          if (invoice.dueDate && new Date(invoice.dueDate as string) < now) {
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

    stats.averageInvoiceValue = invoices.length > 0 
      ? (stats.totalOutstanding + stats.totalPaid + stats.totalDraft) / invoices.length 
      : 0;

    return stats;
  }

  async generateReport(startDate: Date, endDate: Date): Promise<InvoiceReport> {
    const invoices = await this.findAll();
    
    const filteredInvoices = invoices.filter(invoice => {
      const createdAt = invoice.createdAt ? new Date(invoice.createdAt) : new Date();
      return createdAt >= startDate && createdAt <= endDate;
    });

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
      count: filteredInvoices.length,
    };
  }
}

export const invoiceRepository = new InvoiceRepository();
