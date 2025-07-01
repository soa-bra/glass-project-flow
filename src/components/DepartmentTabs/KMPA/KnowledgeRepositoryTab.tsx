
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2,
  FolderTree,
  Lock,
  Unlock,
  FileText,
  Brain,
  Tag
} from 'lucide-react';
import { mockKnowledgeDocuments } from './data/mockData';

export const KnowledgeRepositoryTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const documents = mockKnowledgeDocuments;
  const categories = ['all', 'guide', 'research', 'publication', 'report', 'template', 'metric'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'review': return 'warning';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'draft': return 'مسودة';
      case 'review': return 'قيد المراجعة';
      case 'archived': return 'مؤرشف';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'guide': return 'دليل';
      case 'research': return 'بحث';
      case 'publication': return 'منشور';
      case 'report': return 'تقرير';
      case 'template': return 'قالب';
      case 'metric': return 'مقياس';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">مستودع المعرفة</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            تصنيف تلقائي
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            رفع وثيقة
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="البحث في الوثائق..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">جميع الفئات</option>
                <option value="guide">أدلة</option>
                <option value="research">بحوث</option>
                <option value="publication">منشورات</option>
                <option value="report">تقارير</option>
                <option value="template">قوالب</option>
                <option value="metric">مقاييس</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Tree Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            هيكل الوثائق
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
              <FolderTree className="h-4 w-4" />
              <span className="font-medium">علم اجتماع العلامة التجارية</span>
              <Badge variant="secondary" className="mr-auto">45</Badge>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded mr-4">
              <FileText className="h-4 w-4" />
              <span>أدلة ومراجع</span>
              <Badge variant="secondary" className="mr-auto">12</Badge>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded mr-4">
              <FileText className="h-4 w-4" />
              <span>بحوث تطبيقية</span>
              <Badge variant="secondary" className="mr-auto">18</Badge>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
              <FolderTree className="h-4 w-4" />
              <span className="font-medium">مقاييس وأدوات</span>
              <Badge variant="secondary" className="mr-auto">32</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>الوثائق ({filteredDocuments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-lg mb-1">{doc.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span>{doc.author}</span>
                      <span>•</span>
                      <span>{new Date(doc.updatedAt).toLocaleDateString('ar-SA')}</span>
                      <span>•</span>
                      <span>الإصدار {doc.version}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{getTypeLabel(doc.type)}</Badge>
                      <Badge variant={getStatusColor(doc.status)}>
                        {getStatusLabel(doc.status)}
                      </Badge>
                      <Badge variant="secondary">{doc.category}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {doc.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.permissions.read.includes('all') ? (
                      <Unlock className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {doc.readCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {doc.downloads}
                    </span>
                    <span>الاقتباسات: {doc.citations}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      عرض
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      تحميل
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      تحرير
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Classification Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            نتائج التصنيف التلقائي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
              <div>
                <span className="font-medium">تم تصنيف "دليل التسويق الرقمي" تلقائياً</span>
                <div className="text-sm text-gray-600">الفئة: أدلة ومراجع • الثقة: 95%</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">قبول</Button>
                <Button size="sm" variant="outline">رفض</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
              <div>
                <span className="font-medium">تم إضافة وسوم جديدة لـ "مقاييس الأثر الثقافي"</span>
                <div className="text-sm text-gray-600">الوسوم المقترحة: الثقافة، القياس، الأثر</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">قبول</Button>
                <Button size="sm" variant="outline">رفض</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
