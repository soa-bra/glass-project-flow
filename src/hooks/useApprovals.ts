import { useState, useEffect, useCallback } from 'react';
import { approvalsService } from '@/services/approvals';
import type { 
  ApprovalRequest, 
  ApprovalDashboardStats, 
  CreateApprovalRequest,
  ApprovalRule
} from '@/types/approvals';

export const useApprovals = () => {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [stats, setStats] = useState<ApprovalDashboardStats | null>(null);
  const [rules, setRules] = useState<ApprovalRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await approvalsService.getApprovalRequests(status);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch approval requests');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await approvalsService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  const fetchRules = useCallback(async () => {
    try {
      const data = await approvalsService.getApprovalRules();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rules');
    }
  }, []);

  const createRequest = useCallback(async (request: CreateApprovalRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newRequest = await approvalsService.createApprovalRequest(request);
      setRequests(prev => [newRequest, ...prev]);
      
      // Refresh stats
      await fetchStats();
      
      return newRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create approval request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  const approveRequest = useCallback(async (requestId: string, comments?: string) => {
    try {
      setLoading(true);
      setError(null);
      await approvalsService.approveRequest(requestId, comments);
      
      // Refresh data
      await fetchRequests();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRequests, fetchStats]);

  const rejectRequest = useCallback(async (requestId: string, comments?: string) => {
    try {
      setLoading(true);
      setError(null);
      await approvalsService.rejectRequest(requestId, comments);
      
      // Refresh data
      await fetchRequests();
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchRequests, fetchStats]);

  useEffect(() => {
    fetchRequests();
    fetchStats();
    fetchRules();
  }, [fetchRequests, fetchStats, fetchRules]);

  return {
    requests,
    stats,
    rules,
    loading,
    error,
    actions: {
      fetchRequests,
      fetchStats,
      createRequest,
      approveRequest,
      rejectRequest,
      refresh: () => {
        fetchRequests();
        fetchStats();
      }
    }
  };
};