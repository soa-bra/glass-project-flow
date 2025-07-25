// Knowledge Base Service - High-performance implementation
import { prisma, KbSpace, KbArticle, KbArticleVersion, KbTag, KbComment } from '@/lib/prisma';

export interface CreateSpaceInput {
  name: string;
  desc?: string;
  createdBy: string;
}

export interface CreateArticleInput {
  userId: string;
  spaceId: string;
  title: string;
  content: any;
  tags?: string[];
}

export interface UpdateArticleInput {
  title?: string;
  content?: any;
  tags?: string[];
}

// Space Operations
export async function createSpace(input: CreateSpaceInput): Promise<KbSpace> {
  return await (prisma as any).createKbSpace({
    name: input.name,
    desc: input.desc,
    createdBy: input.createdBy
  });
}

export async function getSpaces(): Promise<KbSpace[]> {
  return await (prisma as any).findManyKbSpaces();
}

export async function getSpace(id: string): Promise<KbSpace | null> {
  return await (prisma as any).findKbSpace(id);
}

// Article Operations
export async function createArticle(input: CreateArticleInput): Promise<KbArticle> {
  return await (prisma as any).$transaction(async (tx: any) => {
    // Create article
    const article = await tx.createKbArticle({
      spaceId: input.spaceId,
      title: input.title,
      createdBy: input.userId,
      status: 'DRAFT'
    });

    // Create first version
    const version = await tx.createKbArticleVersion({
      articleId: article.id,
      number: 1,
      content: input.content,
      createdBy: input.userId
    });

    // Update article with current version
    const updatedArticle = await tx.updateKbArticle(article.id, {
      currentVid: version.id
    });

    // Handle tags if provided
    if (input.tags?.length) {
      await tx.addTagsToArticle(article.id, input.tags);
    }

    return { ...updatedArticle, currentVersion: version };
  });
}

export async function updateArticle(
  articleId: string, 
  input: UpdateArticleInput,
  userId: string
): Promise<KbArticle> {
  return await (prisma as any).$transaction(async (tx: any) => {
    const article = await tx.findKbArticle(articleId);
    if (!article) throw new Error('Article not found');

    let updates: any = {};

    // Update title if provided
    if (input.title) {
      updates.title = input.title;
    }

    // Create new version if content changed
    if (input.content) {
      const lastVersion = await tx.getLatestArticleVersion(articleId);
      const newVersionNumber = lastVersion ? lastVersion.number + 1 : 1;

      const newVersion = await tx.createKbArticleVersion({
        articleId,
        number: newVersionNumber,
        content: input.content,
        createdBy: userId
      });

      updates.currentVid = newVersion.id;
    }

    // Update tags if provided
    if (input.tags) {
      await tx.replaceArticleTags(articleId, input.tags);
    }

    if (Object.keys(updates).length > 0) {
      return await tx.updateKbArticle(articleId, updates);
    }

    return article;
  });
}

export async function publishArticle(articleId: string): Promise<KbArticle> {
  return await (prisma as any).updateKbArticle(articleId, { status: 'PUBLISHED' });
}

export async function archiveArticle(articleId: string): Promise<KbArticle> {
  return await (prisma as any).updateKbArticle(articleId, { status: 'ARCHIVED' });
}

export async function getArticles(spaceId?: string): Promise<KbArticle[]> {
  return await (prisma as any).findManyKbArticles(spaceId);
}

export async function getArticle(id: string): Promise<KbArticle | null> {
  return await (prisma as any).findKbArticle(id);
}

export async function searchArticles(query: string, spaceId?: string): Promise<KbArticle[]> {
  return await (prisma as any).searchKbArticles(query, spaceId);
}

// Tag Operations
export async function createTag(code: string, label: string): Promise<KbTag> {
  return await (prisma as any).createKbTag({ code, label });
}

export async function getTags(): Promise<KbTag[]> {
  return await (prisma as any).findManyKbTags();
}

// Comment Operations
export async function addComment(
  articleId: string, 
  authorId: string, 
  body: string
): Promise<KbComment> {
  return await (prisma as any).createKbComment({
    articleId,
    authorId,
    body
  });
}

export async function getArticleComments(articleId: string): Promise<KbComment[]> {
  return await (prisma as any).findArticleComments(articleId);
}

// Analytics
export async function getSpaceStats(spaceId: string) {
  return await (prisma as any).getKbSpaceStats(spaceId);
}

export async function getPopularArticles(spaceId?: string, limit = 10): Promise<KbArticle[]> {
  return await (prisma as any).getPopularKbArticles(spaceId, limit);
}