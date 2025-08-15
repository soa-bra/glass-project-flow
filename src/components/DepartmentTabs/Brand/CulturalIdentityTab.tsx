
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseBadge } from '@/components/ui/BaseBadge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Star, 
  Users, 
  Target, 
  Edit,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const CulturalIdentityTab: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState({
    mission: "تمكين المؤسسات من بناء علامات تجارية ذات هوية ثقافية متميزة تعكس قيم المجتمع وتساهم في التنمية الثقافية والاقتصادية",
    vision: "أن نكون الرائدون في علم اجتماع العلامة التجارية، ونساهم في تطوير فهم عميق للعلاقة بين الثقافة والعلامات التجارية",
    coreValues: "الأصالة، الابتكار، التميز، المسؤولية الاجتماعية، التطوير المستمر"
  });

  const culturalPersonality = [
    { trait: "الأصالة الثقافية", score: 95 },
    { trait: "الابتكار المسؤول", score: 88 },
    { trait: "التميز الأكاديمي", score: 92 },
    { trait: "العمق الفكري", score: 90 },
    { trait: "المسؤولية المجتمعية", score: 87 }
  ];

  const culturalAlignment = [
    { area: "المشاريع", score: 92, status: "ممتاز" },
    { area: "التواصل", score: 89, status: "جيد جداً" },
    { area: "الفعاليات", score: 95, status: "ممتاز" },
    { area: "البحث الأكاديمي", score: 97, status: "ممتاز" },
    { area: "العلاقات العامة", score: 85, status: "جيد جداً" }
  ];

  return (
    <div className="space-y-6">
      {/* Core Identity Elements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            العناصر الأساسية للهوية
          </CardTitle>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
            {isEditing ? "حفظ" : "تعديل"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">الرسالة</h3>
            {isEditing ? (
              <Textarea 
                value={values.mission}
                onChange={(e) => setValues({...values, mission: e.target.value})}
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{values.mission}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">الرؤية</h3>
            {isEditing ? (
              <Textarea 
                value={values.vision}
                onChange={(e) => setValues({...values, vision: e.target.value})}
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{values.vision}</p>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-2">القيم الجوهرية</h3>
            {isEditing ? (
              <Textarea 
                value={values.coreValues}
                onChange={(e) => setValues({...values, coreValues: e.target.value})}
                className="min-h-[60px]"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {values.coreValues.split('، ').map((value, index) => (
                  <BaseBadge key={index} variant="secondary" className="px-3 py-1">
                    {value}
                  </BaseBadge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cultural Personality */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              الشخصية الثقافية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {culturalPersonality.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{trait.trait}</span>
                    <span className="text-sm font-bold text-blue-600">{trait.score}%</span>
                  </div>
                  <Progress value={trait.score} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">التقييم العام</span>
              </div>
              <p className="text-sm text-blue-700">
                الشخصية الثقافية لسوبرا تُظهر توازناً ممتازاً بين الأصالة والابتكار، مع تركيز قوي على التميز الأكاديمي والمسؤولية المجتمعية.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cultural Alignment Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              مراقبة التوافق الثقافي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {culturalAlignment.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium text-sm">{area.area}</span>
                    <div className="text-xs text-gray-600 mt-1">{area.status}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{area.score}%</span>
                    {area.score >= 90 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : area.score >= 80 ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث القياسات
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Employee Cultural Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            مشاركة الموظفين الثقافية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">94%</div>
              <div className="text-sm text-gray-600">فهم القيم</div>
              <div className="text-xs text-green-600">+5% عن الربع الماضي</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">89%</div>
              <div className="text-sm text-gray-600">تطبيق القيم</div>
              <div className="text-xs text-blue-600">+3% عن الربع الماضي</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">91%</div>
              <div className="text-sm text-gray-600">الانتماء الثقافي</div>
              <div className="text-xs text-purple-600">+7% عن الربع الماضي</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-3">آخر استطلاع للموظفين</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>"أشعر بالفخر للعمل في سوبرا"</span>
                <span className="font-medium">96%</span>
              </div>
              <div className="flex justify-between">
                <span>"أفهم قيم العلامة التجارية وأطبقها"</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span>"أشعر بالانتماء للثقافة المؤسسية"</span>
                <span className="font-medium">89%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
