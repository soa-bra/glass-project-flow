import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, BookOpen, Users, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import type { KbArticle } from '@/lib/prisma';

export const KnowledgeBaseMainPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { articles, loading, spaces, actions } = useKnowledgeBase();

  useEffect(() => {
    actions.fetchArticles();
  }, []);

  const categories = [
    { id: 'all', name: 'الكل', icon: BookOpen },
    { id: 'procedures', name: 'الإجراءات', icon: BookOpen },
    { id: 'policies', name: 'السياسات', icon: BookOpen },
    { id: 'guidelines', name: 'الدلائل', icon: BookOpen },
    { id: 'templates', name: 'القوالب', icon: BookOpen },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || (article.space?.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleCreateArticle = async () => {
    if (spaces.length === 0) return;
    
    try {
      await actions.createArticle({
        userId: 'current-user',
        spaceId: spaces[0].id,
        title: 'مقال جديد',
        content: { body: '' }
      });
    } catch (error) {
      console.error('Error creating article:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground font-arabic">جاري تحميل قاعدة المعرفة...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-arabic font-bold text-foreground">قاعدة المعرفة</h1>
          <p className="text-muted-foreground font-arabic">إدارة ومشاركة المعرفة المؤسسية</p>
        </div>
        <Button onClick={handleCreateArticle} className="font-arabic">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مقال
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في قاعدة المعرفة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 font-arabic"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="font-arabic"
              >
                <Icon className="w-4 h-4 ml-1" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">إجمالي المقالات</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">المقالات المنشورة</p>
                <p className="text-2xl font-bold">{articles.filter(a => a.status === 'PUBLISHED').length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">الفئات</p>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
              </div>
              <Tag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-arabic text-muted-foreground">المساحات</p>
                <p className="text-2xl font-bold">{spaces.length}</p>
              </div>
              <Filter className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Articles Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-arabic line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <Badge variant={article.status === 'PUBLISHED' ? "default" : "secondary"} className="font-arabic">
                    {article.status === 'PUBLISHED' ? 'منشور' : article.status === 'DRAFT' ? 'مسودة' : 'مؤرشف'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground font-arabic line-clamp-3 mb-3">
                  {article.space?.name || 'مساحة غير محددة'}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs font-arabic">
                      {tag.tag?.label || tag.tag?.code}
                    </Badge>
                  ))}
                  {(article.tags?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-xs font-arabic">
                      +{(article.tags?.length || 0) - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground font-arabic">
                  <span>{article.createdBy}</span>
                  <span>{new Date(article.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-arabic font-medium mb-2">لا توجد مقالات</h3>
            <p className="text-sm text-muted-foreground font-arabic text-center max-w-md">
              لم يتم العثور على أي مقالات تطابق معايير البحث. جرب تعديل مصطلحات البحث أو الفئة المحددة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};