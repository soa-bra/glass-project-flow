
import type { ProjectData, TaskData } from '@/types';

export interface ContractPayment {
  id: number;
  amount: string;
  date: string;
}

export interface ProjectFormData extends Omit<ProjectData, 'id' | 'budget'> {
  id?: number;
  startDate: string;
  endDate: string;
  manager: string;
  clientType: 'internal' | 'external';
  budget: string;
  clientData?: {
    name: string;
    type: string;
    responsiblePerson: string;
    phone: string;
    email: string;
  };
  tasks: TaskData[];
  partnerships: unknown[];
  hasContract: boolean;
  contractValue: string;
  contractPayments: ContractPayment[];
}
