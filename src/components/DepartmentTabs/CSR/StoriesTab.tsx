
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Eye, 
  Share2, 
  Heart, 
  MessageCircle,
  Edit,
  Image,
  Video,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import { mockCSRStories } from './data';
import { CSRStory } from './types';

export const StoriesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: CSRStory['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: CSRStory['status']) => {
    switch (status) {
      case 'published': return 'منشور';
      case 'approved': return 'معتمد';
      case 'review': return 'قيد المراجعة';
      case 'draft': return 'مسودة';
      default: return status;
    }
  };

  const filteredStories = mockCSRStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || story.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96">
            <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="البحث في قصص الأثر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white"
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="approved">معتمد</option>
            <option value="review">قيد المراجعة</option>
            <option value="draft">مسودة</option>
          </select>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-arabic">
          <Plus className="ml-2 h-4 w-4" />
          إنشاء قصة جديدة
        </Button>
      </div>

      {/* Stories Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCSRStories.reduce((sum, story) => sum + story.engagement.views, 0).toLocaleString('ar-SA')}
          </h3>
          <p className="text-gray-600 font-arabic">إجمالي المشاهدات</p>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Share2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCSRStories.reduce((sum, story) => sum + story.engagement.shares, 0)}
          </h3>
          <p className="text-gray-600 font-arabic">المشاركات</p>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCSRStories.reduce((sum, story) => sum + story.engagement.likes, 0)}
          </h3>
          <p className="text-gray-600 font-arabic">الإعجابات</p>
        </GenericCard>

        <GenericCard className="text-center">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold font-arabic text-gray-900">
            {mockCSRStories.reduce((sum, story) => sum + story.engagement.comments, 0)}
          </h3>
          <p className="text-gray-600 font-arabic">التعليقات</p>
        </GenericCard>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <GenericCard key={story.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold font-arabic text-gray-900">{story.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(story.status)}`}>
                    {getStatusText(story.status)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 font-arabic mb-4 line-clamp-3">
              {story.summary}
            </p>

            {/* Media Indicators */}
            <div className="flex items-center gap-4 mb-4">
              {story.images.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Image className="h-4 w-4" />
                  <span className="font-arabic">{story.images.length} صورة</span>
                </div>
              )}
              {story.videos.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Video className="h-4 w-4" />
                  <span className="font-arabic">{story.videos.length} فيديو</span>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {story.tags.slice(0, 4).map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-arabic">
                  {tag}
                </span>
              ))}
              {story.tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded font-arabic">
                  +{story.tags.length - 4}
                </span>
              )}
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div className="flex flex-col items-center">
                <Eye className="h-4 w-4 text-blue-600 mb-1" />
                <span className="text-xs font-arabic text-gray-600">
                  {story.engagement.views.toLocaleString('ar-SA')}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Share2 className="h-4 w-4 text-green-600 mb-1" />
                <span className="text-xs font-arabic text-gray-600">
                  {story.engagement.shares}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-4 w-4 text-red-600 mb-1" />
                <span className="text-xs font-arabic text-gray-600">
                  {story.engagement.likes}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="h-4 w-4 text-purple-600 mb-1" />
                <span className="text-xs font-arabic text-gray-600">
                  {story.engagement.comments}
                </span>
              </div>
            </div>

            {/* Story Details */}
            <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{story.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(story.publishDate).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 font-arabic">
                <Eye className="h-3 w-3 ml-1" />
                عرض
              </Button>
              <Button size="sm" variant="outline" className="font-arabic">
                <Edit className="h-3 w-3 ml-1" />
                تعديل
              </Button>
              <Button size="sm" variant="outline" className="font-arabic">
                <Share2 className="h-3 w-3 ml-1" />
                مشاركة
              </Button>
            </div>
          </GenericCard>
        ))}
      </div>

      {/* Content Guidelines */}
      <GenericCard>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-bold font-arabic">إرشادات المحتوى</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">معايير القصص الفعالة</h4>
            <ul className="space-y-1 text-sm font-arabic text-gray-600">
              <li>• تركز على التأثير الإنساني والتغيير الحقيقي</li>
              <li>• تحتوي على بيانات وأرقام داعمة</li>
              <li>• تتضمن اقتباسات مباشرة من المستفيدين</li>
              <li>• تستخدم الصور والفيديوهات المؤثرة</li>
              <li>• تربط بأهداف التنمية المستدامة</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold font-arabic text-gray-900 mb-2">مسار الموافقة</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm font-arabic text-gray-600">المؤلف ينشئ المسودة</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-arabic text-gray-600">وحدة العلامة التجارية تراجع</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-arabic text-gray-600">الوحدة القانونية تعتمد</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-arabic text-gray-600">النشر على المنصات</span>
              </div>
            </div>
          </div>
        </div>
      </GenericCard>
    </div>
  );
};
