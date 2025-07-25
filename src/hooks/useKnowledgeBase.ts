// Knowledge Base Hooks - Complete KB management
import { useState, useEffect } from 'react';
import { 
  createSpace, 
  createArticle, 
  updateArticle,
  publishArticle,
  archiveArticle,
  getSpaces, 
  getArticles, 
  getArticle,
  searchArticles,
  createTag,
  getTags,
  addComment,
  getArticleComments,
  getSpaceStats
} from '@/modules/kb/kb.service';
import { 
  CreateSpaceInput,
  CreateArticleInput,
  UpdateArticleInput 
} from '@/modules/kb/kb.service';
import type { 
  KbSpace, 
  KbArticle, 
  KbTag, 
  KbComment
} from '@/lib/prisma';

export function useKnowledgeBase() {
  const [spaces, setSpaces] = useState<KbSpace[]>([]);
  const [articles, setArticles] = useState<KbArticle[]>([]);
  const [tags, setTags] = useState<KbTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    fetchSpaces();
    fetchTags();
  }, []);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const data = await getSpaces();
      setSpaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل المساحات');
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async (spaceId?: string) => {
    try {
      setLoading(true);
      const data = await getArticles(spaceId);
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const data = await getTags();
      setTags(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الوسوم');
    }
  };

  const handleCreateSpace = async (input: CreateSpaceInput) => {
    try {
      setLoading(true);
      const space = await createSpace(input);
      setSpaces(prev => [...prev, space]);
      return space;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء المساحة');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = async (input: CreateArticleInput) => {
    try {
      setLoading(true);
      const article = await createArticle(input);
      setArticles(prev => [...prev, article]);
      return article;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء المقال');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArticle = async (
    articleId: string, 
    input: UpdateArticleInput,
    userId: string
  ) => {
    try {
      setLoading(true);
      const article = await updateArticle(articleId, input, userId);
      setArticles(prev => prev.map(a => a.id === articleId ? article : a));
      return article;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحديث المقال');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePublishArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const article = await publishArticle(articleId);
      setArticles(prev => prev.map(a => a.id === articleId ? article : a));
      return article;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في نشر المقال');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveArticle = async (articleId: string) => {
    try {
      setLoading(true);
      const article = await archiveArticle(articleId);
      setArticles(prev => prev.map(a => a.id === articleId ? article : a));
      return article;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في أرشفة المقال');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTag = async (code: string, label: string) => {
    try {
      const tag = await createTag(code, label);
      setTags(prev => [...prev, tag]);
      return tag;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إنشاء الوسم');
      throw err;
    }
  };

  const handleSearch = async (query: string, spaceId?: string) => {
    try {
      setLoading(true);
      const results = await searchArticles(query, spaceId);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في البحث');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    spaces,
    articles,
    tags,
    loading,
    error,
    actions: {
      fetchSpaces,
      fetchArticles,
      fetchTags,
      createSpace: handleCreateSpace,
      createArticle: handleCreateArticle,
      updateArticle: handleUpdateArticle,
      publishArticle: handlePublishArticle,
      archiveArticle: handleArchiveArticle,
      createTag: handleCreateTag,
      search: handleSearch
    }
  };
}

export function useKbArticle(articleId: string) {
  const [article, setArticle] = useState<KbArticle | null>(null);
  const [comments, setComments] = useState<KbComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchComments();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await getArticle(articleId);
      setArticle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل المقال');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getArticleComments(articleId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل التعليقات');
    }
  };

  const handleAddComment = async (authorId: string, body: string) => {
    try {
      const comment = await addComment(articleId, authorId, body);
      setComments(prev => [...prev, comment]);
      return comment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في إضافة التعليق');
      throw err;
    }
  };

  return {
    article,
    comments,
    loading,
    error,
    actions: {
      fetchArticle,
      fetchComments,
      addComment: handleAddComment
    }
  };
}

export function useKbSpace(spaceId: string) {
  const [space, setSpace] = useState<KbSpace | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (spaceId) {
      fetchSpace();
      fetchStats();
    }
  }, [spaceId]);

  const fetchSpace = async () => {
    try {
      setLoading(true);
      const data = await getSpaces();
      const spaceData = data.find(s => s.id === spaceId);
      setSpace(spaceData || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل المساحة');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getSpaceStats(spaceId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'فشل في تحميل الإحصائيات');
    }
  };

  return {
    space,
    stats,
    loading,
    error,
    actions: {
      fetchSpace,
      fetchStats
    }
  };
}