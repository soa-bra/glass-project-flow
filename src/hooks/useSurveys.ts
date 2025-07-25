// Surveys Framework Hooks - Cultural impact measurement
import { useState, useEffect } from 'react';
import {
  createSurvey,
  activateSurvey,
  closeSurvey,
  getSurveys,
  getSurvey,
  submitSurveyResponse,
  getSurveyResponses,
  calculateScaleScore,
  getSurveyAnalytics,
  measureBrandAlignment,
  getCommunityFeedback,
  CreateSurveyInput,
  SubmitResponseInput,
  SurveyAnalytics
} from '@/modules/surveys/surveys.service';
import type { Survey, SurveyResponse } from '@/lib/prisma';

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async (status?: string) => {
    try {
      setLoading(true);
      const data = await getSurveys(status);
      setSurveys(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الاستطلاعات');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = async (input: CreateSurveyInput) => {
    try {
      setLoading(true);
      const survey = await createSurvey(input);
      setSurveys(prev => [...prev, survey]);
      return survey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء الاستطلاع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleActivateSurvey = async (id: string) => {
    try {
      setLoading(true);
      const survey = await activateSurvey(id);
      setSurveys(prev => prev.map(s => s.id === id ? survey : s));
      return survey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تفعيل الاستطلاع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSurvey = async (id: string) => {
    try {
      setLoading(true);
      const survey = await closeSurvey(id);
      setSurveys(prev => prev.map(s => s.id === id ? survey : s));
      return survey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إغلاق الاستطلاع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    surveys,
    loading,
    error,
    actions: {
      fetchSurveys,
      createSurvey: handleCreateSurvey,
      activateSurvey: handleActivateSurvey,
      closeSurvey: handleCloseSurvey
    }
  };
}

export function useSurvey(surveyId: string) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (surveyId) {
      fetchSurvey();
      fetchResponses();
      fetchAnalytics();
    }
  }, [surveyId]);

  const fetchSurvey = async () => {
    try {
      setLoading(true);
      const data = await getSurvey(surveyId);
      setSurvey(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الاستطلاع');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async () => {
    try {
      const data = await getSurveyResponses(surveyId);
      setResponses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الردود');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await getSurveyAnalytics(surveyId);
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل التحليلات');
    }
  };

  const handleSubmitResponse = async (input: SubmitResponseInput) => {
    try {
      setLoading(true);
      const response = await submitSurveyResponse(input);
      setResponses(prev => [...prev, response]);
      await fetchAnalytics(); // Refresh analytics
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إرسال الرد');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    survey,
    responses,
    analytics,
    loading,
    error,
    actions: {
      fetchSurvey,
      fetchResponses,
      fetchAnalytics,
      submitResponse: handleSubmitResponse
    }
  };
}

export function useBrandImpact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const measureAlignment = async (resourceId: string) => {
    try {
      setLoading(true);
      const result = await measureBrandAlignment(resourceId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في قياس التوافق');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCommunityInsights = async (communityId: string) => {
    try {
      setLoading(true);
      const result = await getCommunityFeedback(communityId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل آراء المجتمع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    actions: {
      measureAlignment,
      getCommunityInsights
    }
  };
}