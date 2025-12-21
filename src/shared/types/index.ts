/**
 * Shared Types
 * أنواع مشتركة بين جميع الميزات
 */

// Invoice Status
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'canceled' | 'posted';

// Common Entity Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Money
export interface Money {
  amount: number;
  currency: string;
}
