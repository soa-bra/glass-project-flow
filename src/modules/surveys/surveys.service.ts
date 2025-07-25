// Surveys Framework Service - Advanced cultural impact measurement
import { prisma, Survey, SurveyQuestion, SurveyResponse, QuestionType } from '@/lib/prisma';

export interface CreateSurveyInput {
  userId: string;
  title: string;
  resource?: string;
  resourceId?: string;
  questions: Array<{
    order: number;
    type: QuestionType;
    text: string;
    meta?: any;
  }>;
}

export interface SubmitResponseInput {
  surveyId: string;
  respondentId?: string;
  answers: Array<{
    questionId: string;
    value: any;
  }>;
}

export interface SurveyAnalytics {
  totalResponses: number;
  averageScore?: number;
  responseRate: number;
  insights: {
    topResponses: any[];
    trends: any[];
    segments: any[];
  };
}

// Survey Management
export async function createSurvey(input: CreateSurveyInput): Promise<Survey> {
  return await (prisma as any).$transaction(async (tx: any) => {
    const survey = await tx.createSurvey({
      title: input.title,
      resource: input.resource,
      resourceId: input.resourceId,
      createdBy: input.userId,
      status: 'DRAFT'
    });

    // Create questions
    const questions = await Promise.all(
      input.questions.map(q => 
        tx.createSurveyQuestion({
          surveyId: survey.id,
          order: q.order,
          type: q.type,
          text: q.text,
          meta: q.meta
        })
      )
    );

    return { ...survey, questions };
  });
}

export async function activateSurvey(id: string): Promise<Survey> {
  const survey = await (prisma as any).findSurvey(id);
  if (!survey) throw new Error('Survey not found');
  
  if (survey.status !== 'DRAFT') {
    throw new Error('Only draft surveys can be activated');
  }

  return await (prisma as any).updateSurvey(id, { status: 'ACTIVE' });
}

export async function closeSurvey(id: string): Promise<Survey> {
  return await (prisma as any).updateSurvey(id, { status: 'CLOSED' });
}

export async function getSurveys(status?: string): Promise<Survey[]> {
  return await (prisma as any).findManySurveys(status);
}

export async function getSurvey(id: string): Promise<Survey | null> {
  return await (prisma as any).findSurvey(id);
}

// Response Management
export async function submitSurveyResponse(input: SubmitResponseInput): Promise<SurveyResponse> {
  const survey = await (prisma as any).findSurvey(input.surveyId);
  if (!survey || survey.status !== 'ACTIVE') {
    throw new Error('Survey is not available for responses');
  }

  return await (prisma as any).$transaction(async (tx: any) => {
    const response = await tx.createSurveyResponse({
      surveyId: input.surveyId,
      respondentId: input.respondentId
    });

    await Promise.all(
      input.answers.map(answer =>
        tx.createSurveyAnswer({
          responseId: response.id,
          questionId: answer.questionId,
          value: answer.value
        })
      )
    );

    return response;
  });
}

export async function getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
  return await (prisma as any).findSurveyResponses(surveyId);
}

// Analytics & Insights
export async function calculateScaleScore(surveyId: string): Promise<number> {
  const answers = await (prisma as any).getScaleAnswers(surveyId);
  if (!answers.length) return 0;

  const values = answers.map((a: any) => Number(a.value));
  return values.reduce((sum: number, val: number) => sum + val, 0) / values.length;
}

export async function getSurveyAnalytics(surveyId: string): Promise<SurveyAnalytics> {
  const [responses, questions, scaleScore] = await Promise.all([
    (prisma as any).findSurveyResponses(surveyId),
    (prisma as any).findSurveyQuestions(surveyId),
    calculateScaleScore(surveyId)
  ]);

  const analytics: SurveyAnalytics = {
    totalResponses: responses.length,
    averageScore: scaleScore || undefined,
    responseRate: 0, // Would need target audience size
    insights: {
      topResponses: await (prisma as any).getTopResponses(surveyId),
      trends: await (prisma as any).getResponseTrends(surveyId),
      segments: await (prisma as any).getResponseSegments(surveyId)
    }
  };

  return analytics;
}

// Cultural Impact Measurement
export async function measureBrandAlignment(resourceId: string): Promise<{
  alignmentScore: number;
  culturalImpact: number;
  engagementLevel: number;
  recommendations: string[];
}> {
  const brandSurveys = await (prisma as any).findBrandSurveys(resourceId);
  
  // Calculate composite scores
  const alignmentScore = await calculateAverageScore(brandSurveys, 'alignment');
  const culturalImpact = await calculateAverageScore(brandSurveys, 'cultural');
  const engagementLevel = await calculateAverageScore(brandSurveys, 'engagement');

  // Generate recommendations based on scores
  const recommendations = generateRecommendations({
    alignmentScore,
    culturalImpact,
    engagementLevel
  });

  return {
    alignmentScore,
    culturalImpact,
    engagementLevel,
    recommendations
  };
}

export async function getCommunityFeedback(communityId: string) {
  return await (prisma as any).getCommunityFeedbackData(communityId);
}

// Helper functions
async function calculateAverageScore(surveys: Survey[], category: string): Promise<number> {
  // Implementation would filter and calculate based on survey category/meta
  return 0; // Placeholder
}

function generateRecommendations(scores: {
  alignmentScore: number;
  culturalImpact: number;
  engagementLevel: number;
}): string[] {
  const recommendations: string[] = [];

  if (scores.alignmentScore < 7) {
    recommendations.push('تحسين توافق العلامة التجارية مع قيم المجتمع');
  }

  if (scores.culturalImpact < 6) {
    recommendations.push('زيادة التأثير الثقافي من خلال مبادرات مجتمعية');
  }

  if (scores.engagementLevel < 8) {
    recommendations.push('تعزيز مستوى التفاعل والمشاركة');
  }

  return recommendations;
}