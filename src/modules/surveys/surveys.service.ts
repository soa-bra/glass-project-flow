// Surveys Service - Basic implementation
import { prisma, Survey } from '@/lib/prisma';

export interface CreateSurveyInput {
  title: string;
  createdBy: string;
}

export async function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  return await (prisma as any).createSurvey({
    ...input,
    status: 'DRAFT'
  });
}

export async function getSurveys(): Promise<Survey[]> {
  return await (prisma as any).findManySurveys();
}

export async function getSurvey(id: string): Promise<Survey | null> {
  return await (prisma as any).findSurvey(id);
}