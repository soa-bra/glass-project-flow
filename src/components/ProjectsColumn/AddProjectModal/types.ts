
import type { ProjectData, TaskData } from '@/types';

export interface ContractPayment {
  id: number;
  amount: string;
  date: string;
}

export interface PartnerData {
  id: number;
  entityName: string;
  entityType: string;
  representativeName: string;
  phone: string;
  email: string;
  partnershipDescription: string;
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
  partnerships: PartnerData[];
  hasContract: boolean;
  contractValue: string;
  contractPayments: ContractPayment[];
}
