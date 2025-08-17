// Knowledge Base Overview Component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BaseBadge } from '@/components/ui/BaseBadge';
import { BookOpen, Plus, Search, Tag } from "lucide-react";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";

export function KnowledgeBaseOverview() {
  const { spaces, articles, loading, actions } = useKnowledgeBase();

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">قاعدة المعرفة</h1>
        <Button onClick={() => {}}>
          <Plus className="ml-2 h-4 w-4" />
          إنشاء مساحة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المساحات</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{spaces.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المقالات</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المقالات المنشورة</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter(a => a.status === 'PUBLISHED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المساحات</CardTitle>
            <CardDescription>إدارة مساحات المعرفة المختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spaces.map(space => (
                <div key={space.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{space.name}</h3>
                    <p className="text-sm text-muted-foreground">{space.desc}</p>
                  </div>
                  <BaseBadge variant="secondary">
                    {articles.filter(a => a.spaceId === space.id).length} مقال
                  </BaseBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المقالات الحديثة</CardTitle>
            <CardDescription>آخر المقالات المضافة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.slice(0, 5).map(article => (
                <div key={article.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{article.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <BaseBadge variant={article.status === 'PUBLISHED' ? 'success' : 'secondary'}>
                    {article.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                  </BaseBadge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}