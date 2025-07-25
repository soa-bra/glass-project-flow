import { useState, useEffect } from 'react';
import { 
  createSurvey, 
  getSurveys,
  getSurvey,
  updateSurvey,
  deleteSurvey,
  submitResponse,
  getSurveyResponses
} from '@/modules/surveys/surveys.service';
import { 
  CreateSurveyInput,
  UpdateSurveyInput,
  SubmitResponseInput
} from '@/modules/surveys/surveys.service';
import type { 
  Survey, 
  SurveyQuestion,
  SurveyResponse
} from '@/lib/prisma';

export function useSurveys() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const data = await getSurveys();
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

  const handleUpdateSurvey = async (
    surveyId: string, 
    input: UpdateSurveyInput
  ) => {
    try {
      setLoading(true);
      const survey = await updateSurvey(surveyId, input);
      setSurveys(prev => prev.map(s => s.id === surveyId ? survey : s));
      return survey;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحديث الاستطلاع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    try {
      setLoading(true);
      await deleteSurvey(surveyId);
      setSurveys(prev => prev.filter(s => s.id !== surveyId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في حذف الاستطلاع');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (input: SubmitResponseInput) => {
    try {
      const response = await submitResponse(input);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إرسال الرد');
      throw err;
    }
  };

  return {
    surveys,
    loading,
    error,
    actions: {
      fetchSurveys,
      createSurvey: handleCreateSurvey,
      updateSurvey: handleUpdateSurvey,
      deleteSurvey: handleDeleteSurvey,
      submitResponse: handleSubmitResponse
    }
  };
}

export function useSurvey(surveyId: string) {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (surveyId) {
      fetchSurvey();
      fetchResponses();
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

  return {
    survey,
    responses,
    loading,
    error,
    actions: {
      fetchSurvey,
      fetchResponses
    }
  };
}