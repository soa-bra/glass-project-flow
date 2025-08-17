
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Download, 
  Eye, 
  Calendar,
  User,
  Tag,
  FileText,
  Star,
  Upload
} from 'lucide-react';
import { mockKnowledgeDocuments } from './data/mockData';

export const KnowledgeRepositoryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const documents = mockKnowledgeDocuments;

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || doc.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'review': return 'outline';
      case 'archived': return 'error';
      default: return 'secondary';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'research': return 'default';
      case 'publication': return 'secondary';
      case 'report': return 'outline';
      case 'guide': return 'secondary';
      case 'template': return 'outline';
      case 'metric': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            البحث والتصفية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="البحث في الوثائق..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="نوع الوثيقة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="research">بحث</SelectItem>
                <SelectItem value="publication">منشور</SelectItem>
                <SelectItem value="report">تقرير</SelectItem>
                <SelectItem value="guide">دليل</SelectItem>
                <SelectItem value="template">نموذج</SelectItem>
                <SelectItem value="metric">مقياس</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="draft">مسودة</SelectItem>
                <SelectItem value="review">قيد المراجعة</SelectItem>
                <SelectItem value="published">منشور</SelectItem>
                <SelectItem value="archived">مؤرشف</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="الفئة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="brand-sociology">علم اجتماع العلامة</SelectItem>
                <SelectItem value="cultural-identity">الهوية الثقافية</SelectItem>
                <SelectItem value="research-methods">مناهج البحث</SelectItem>
                <SelectItem value="metrics">المقاييس</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">إضافة وثيقة جديدة</h3>
              <p className="text-sm text-gray-600">رفع وثائق جديدة إلى مستودع المعرفة</p>
            </div>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              رفع وثيقة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{doc.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <BaseBadge variant={getTypeBadgeVariant(doc.type)} className="text-xs">
                      {doc.type === 'research' ? 'بحث' :
                       doc.type === 'publication' ? 'منشور' :
                       doc.type === 'report' ? 'تقرير' :
                       doc.type === 'guide' ? 'دليل' :
                       doc.type === 'template' ? 'نموذج' : 'مقياس'}
                    </BaseBadge>
                    <BaseBadge variant={getStatusBadgeVariant(doc.status)} className="text-xs">
                      {doc.status === 'published' ? 'منشور' :
                       doc.status === 'draft' ? 'مسودة' :
                       doc.status === 'review' ? 'مراجعة' : 'مؤرشف'}
                    </BaseBadge>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Star className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{doc.author}</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{new Date(doc.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Eye className="h-3 w-3" />
                  <span>{doc.readCount}</span>
                  <Download className="h-3 w-3 mr-1" />
                  <span>{doc.downloads}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {doc.tags.slice(0, 3).map((tag, index) => (
                    <BaseBadge key={index} variant="outline" className="text-xs">
                      {tag}
                    </BaseBadge>
                  ))}
                  {doc.tags.length > 3 && (
                    <BaseBadge variant="outline" className="text-xs">
                      +{doc.tags.length - 3}
                    </BaseBadge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">لا توجد وثائق</h3>
            <p className="text-gray-600">لم يتم العثور على وثائق تطابق معايير البحث المحددة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
