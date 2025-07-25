// Surveys Service - Basic implementation
import { prisma, Survey } from '@/lib/prisma';

export interface CreateSurveyInput {
  title: string;
  description?: string;
  deadline?: Date;
  createdBy: string;
}

export interface UpdateSurveyInput {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
}

export interface SubmitResponseInput {
  surveyId: string;
  respondentId?: string;
  answers: {
    questionId: string;
    value: any;
  }[];
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

export async function updateSurvey(id: string, input: UpdateSurveyInput): Promise<Survey> {
  return await (prisma as any).updateSurvey(id, input);
}

export async function deleteSurvey(id: string): Promise<void> {
  return await (prisma as any).deleteSurvey(id);
}

export async function submitResponse(input: SubmitResponseInput): Promise<any> {
  const response = await (prisma as any).createSurveyResponse({
    surveyId: input.surveyId,
    respondentId: input.respondentId
  });

  // Create answers
  for (const answer of input.answers) {
    await (prisma as any).createSurveyAnswer({
      responseId: response.id,
      questionId: answer.questionId,
      value: answer.value
    });
  }

  return response;
}

export async function getSurveyResponses(surveyId: string): Promise<any[]> {
  return await (prisma as any).findManySurveyResponses(surveyId);
}