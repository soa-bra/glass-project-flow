
import React, { useState } from 'react';
import { GenericCard } from '@/components/ui/GenericCard';
import { BaseActionButton } from '@/components/shared/BaseActionButton';
import { Input } from '@/components/ui/input';
import { Plus, Search, Eye, Share2, Heart, MessageCircle, Edit, Image, Video, Calendar, User, TrendingUp } from 'lucide-react';
import { mockCSRStories } from './data';
import { CSRStory } from './types';
import { GenericFormModal, FormField } from '../shared/GenericFormModal';
import { GenericDetailModal, DetailField } from '../shared/GenericDetailModal';
import { toast } from 'sonner';

export const StoriesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [stories, setStories] = useState(mockCSRStories);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingStory, setViewingStory] = useState<CSRStory | null>(null);
  const [editingStory, setEditingStory] = useState<CSRStory | null>(null);

  const getStatusColor = (s: CSRStory['status']) => ({ published: 'bg-green-100 text-green-800', approved: 'bg-blue-100 text-blue-800', review: 'bg-yellow-100 text-yellow-800', draft: 'bg-gray-100 text-gray-800' }[s] || 'bg-gray-100 text-gray-800');
  const getStatusText = (s: CSRStory['status']) => ({ published: 'منشور', approved: 'معتمد', review: 'قيد المراجعة', draft: 'مسودة' }[s] || s);

  const filteredStories = stories.filter(story => {
    const ms = story.title.toLowerCase().includes(searchTerm.toLowerCase()) || story.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (selectedStatus === 'all' || story.status === selectedStatus);
  });

  const addFields: FormField[] = [
    { name: 'title', label: 'عنوان القصة', type: 'text', required: true, placeholder: 'أدخل العنوان' },
    { name: 'summary', label: 'الملخص', type: 'textarea', required: true, placeholder: 'ملخص القصة...' },
    { name: 'author', label: 'الكاتب', type: 'text', required: true, placeholder: 'اسم الكاتب' },
    { name: 'tags', label: 'الوسوم (مفصولة بفاصلة)', type: 'text', placeholder: 'تعليم, بيئة' },
  ];

  const handleAddStory = (data: Record<string, string>) => {
    const newStory: any = {
      id: `story-${Date.now()}`, title: data.title, summary: data.summary, author: data.author,
      status: 'draft', publishDate: new Date().toISOString().split('T')[0],
      tags: data.tags ? data.tags.split(',').map(s => s.trim()) : [],
      images: [], videos: [], engagement: { views: 0, shares: 0, likes: 0, comments: 0 },
    };
    setStories(prev => [newStory, ...prev]);
  };

  const handleEditStory = (data: Record<string, string>) => {
    if (!editingStory) return;
    setStories(prev => prev.map(s => s.id === editingStory.id ? {
      ...s, title: data.title, summary: data.summary, author: data.author,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : s.tags,
    } : s));
    setEditingStory(null);
  };

  const handleShare = (story: CSRStory) => {
    navigator.clipboard.writeText(`قصة أثر: ${story.title} - ${story.summary.substring(0, 100)}...`);
    toast.success('تم نسخ رابط القصة');
  };

  const getViewFields = (s: CSRStory): DetailField[] => [
    { label: 'العنوان', value: s.title }, { label: 'الملخص', value: s.summary },
    { label: 'الكاتب', value: s.author }, { label: 'الحالة', value: getStatusText(s.status) },
    { label: 'تاريخ النشر', value: new Date(s.publishDate).toLocaleDateString('ar-SA') },
    { label: 'المشاهدات', value: s.engagement.views.toLocaleString('ar-SA') },
    { label: 'المشاركات', value: String(s.engagement.shares) },
    { label: 'الإعجابات', value: String(s.engagement.likes) },
    { label: 'الوسوم', value: s.tags.join(', ') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-96"><Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" /><Input placeholder="البحث في قصص الأثر..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10" /></div>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg font-arabic bg-white">
            <option value="all">جميع الحالات</option><option value="published">منشور</option><option value="approved">معتمد</option><option value="review">قيد المراجعة</option><option value="draft">مسودة</option>
          </select>
        </div>
        <BaseActionButton onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-arabic"><Plus className="ml-2 h-4 w-4" /> إنشاء قصة جديدة</BaseActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GenericCard className="text-center"><Eye className="h-8 w-8 text-blue-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{stories.reduce((s, st) => s + st.engagement.views, 0).toLocaleString('ar-SA')}</h3><p className="text-gray-600 font-arabic">إجمالي المشاهدات</p></GenericCard>
        <GenericCard className="text-center"><Share2 className="h-8 w-8 text-green-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{stories.reduce((s, st) => s + st.engagement.shares, 0)}</h3><p className="text-gray-600 font-arabic">المشاركات</p></GenericCard>
        <GenericCard className="text-center"><Heart className="h-8 w-8 text-red-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{stories.reduce((s, st) => s + st.engagement.likes, 0)}</h3><p className="text-gray-600 font-arabic">الإعجابات</p></GenericCard>
        <GenericCard className="text-center"><MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-4" /><h3 className="text-2xl font-bold font-arabic text-gray-900">{stories.reduce((s, st) => s + st.engagement.comments, 0)}</h3><p className="text-gray-600 font-arabic">التعليقات</p></GenericCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStories.map((story) => (
          <GenericCard key={story.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-2"><h4 className="font-semibold font-arabic text-gray-900">{story.title}</h4><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(story.status)}`}>{getStatusText(story.status)}</span></div>
            <p className="text-sm text-gray-600 font-arabic mb-4 line-clamp-3">{story.summary}</p>
            <div className="flex items-center gap-4 mb-4">
              {story.images.length > 0 && <div className="flex items-center gap-1 text-sm text-gray-500"><Image className="h-4 w-4" /><span className="font-arabic">{story.images.length} صورة</span></div>}
              {story.videos.length > 0 && <div className="flex items-center gap-1 text-sm text-gray-500"><Video className="h-4 w-4" /><span className="font-arabic">{story.videos.length} فيديو</span></div>}
            </div>
            <div className="flex flex-wrap gap-1 mb-4">
              {story.tags.slice(0, 4).map((tag, i) => <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-arabic">{tag}</span>)}
              {story.tags.length > 4 && <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded font-arabic">+{story.tags.length - 4}</span>}
            </div>
            <div className="grid grid-cols-4 gap-2 mb-4 text-center">
              <div className="flex flex-col items-center"><Eye className="h-4 w-4 text-blue-600 mb-1" /><span className="text-xs font-arabic text-gray-600">{story.engagement.views.toLocaleString('ar-SA')}</span></div>
              <div className="flex flex-col items-center"><Share2 className="h-4 w-4 text-green-600 mb-1" /><span className="text-xs font-arabic text-gray-600">{story.engagement.shares}</span></div>
              <div className="flex flex-col items-center"><Heart className="h-4 w-4 text-red-600 mb-1" /><span className="text-xs font-arabic text-gray-600">{story.engagement.likes}</span></div>
              <div className="flex flex-col items-center"><MessageCircle className="h-4 w-4 text-purple-600 mb-1" /><span className="text-xs font-arabic text-gray-600">{story.engagement.comments}</span></div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 font-arabic mb-4">
              <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>{story.author}</span></div>
              <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{new Date(story.publishDate).toLocaleDateString('ar-SA')}</span></div>
            </div>
            <div className="flex gap-2">
              <BaseActionButton size="sm" variant="outline" className="flex-1 font-arabic" onClick={() => setViewingStory(story)}><Eye className="h-3 w-3 ml-1" /> عرض</BaseActionButton>
              <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => setEditingStory(story)}><Edit className="h-3 w-3 ml-1" /> تعديل</BaseActionButton>
              <BaseActionButton size="sm" variant="outline" className="font-arabic" onClick={() => handleShare(story)}><Share2 className="h-3 w-3 ml-1" /> مشاركة</BaseActionButton>
            </div>
          </GenericCard>
        ))}
      </div>

      <GenericCard>
        <div className="flex items-center gap-3 mb-4"><TrendingUp className="h-6 w-6 text-blue-600" /><h3 className="text-lg font-bold font-arabic">إرشادات المحتوى</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><h4 className="font-semibold font-arabic text-gray-900 mb-2">معايير القصص الفعالة</h4><ul className="space-y-1 text-sm font-arabic text-gray-600"><li>• تركز على التأثير الإنساني والتغيير الحقيقي</li><li>• تحتوي على بيانات وأرقام داعمة</li><li>• تتضمن اقتباسات مباشرة من المستفيدين</li><li>• تستخدم الصور والفيديوهات المؤثرة</li><li>• تربط بأهداف التنمية المستدامة</li></ul></div>
          <div><h4 className="font-semibold font-arabic text-gray-900 mb-2">مسار الموافقة</h4><div className="space-y-2"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-500 rounded-full"></div><span className="text-sm font-arabic text-gray-600">المؤلف ينشئ المسودة</span></div><div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div><span className="text-sm font-arabic text-gray-600">وحدة العلامة التجارية تراجع</span></div><div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full"></div><span className="text-sm font-arabic text-gray-600">الوحدة القانونية تعتمد</span></div><div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div><span className="text-sm font-arabic text-gray-600">النشر على المنصات</span></div></div></div>
        </div>
      </GenericCard>

      <GenericFormModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="إنشاء قصة جديدة" fields={addFields} onSubmit={handleAddStory} submitLabel="إنشاء" successMessage="تم إنشاء القصة بنجاح" />
      {editingStory && <GenericFormModal isOpen={!!editingStory} onClose={() => setEditingStory(null)} title={`تعديل: ${editingStory.title}`} fields={addFields.map(f => ({ ...f, defaultValue: f.name === 'tags' ? editingStory.tags.join(', ') : String((editingStory as any)[f.name] || '') }))} onSubmit={handleEditStory} submitLabel="حفظ" successMessage="تم تحديث القصة بنجاح" />}
      {viewingStory && <GenericDetailModal isOpen={!!viewingStory} onClose={() => setViewingStory(null)} title={viewingStory.title} fields={getViewFields(viewingStory)} />}
    </div>
  );
};
