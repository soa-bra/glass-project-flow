import React, { useState } from 'react';
import { BaseCard } from '@/components/ui/BaseCard';
import { UnifiedButton } from '@/components/ui/UnifiedButton';
import { UnifiedBadge } from '@/components/ui/UnifiedBadge';
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
    <div className="font-arabic px-[15px] py-0">
      {/* Core Identity Elements */}
      <div className="mb-6">
        <BaseCard
          variant="operations"
          size="md"
          className="w-full"
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                العناصر الأساسية للهوية
              </h3>
              <UnifiedButton 
                variant={isEditing ? "primary" : "outline"} 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <Save className="h-4 w-4 mr-1" /> : <Edit className="h-4 w-4 mr-1" />}
                {isEditing ? "حفظ" : "تعديل"}
              </UnifiedButton>
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2 text-black font-arabic">الرسالة</h3>
              {isEditing ? (
                <Textarea 
                  value={values.mission}
                  onChange={(e) => setValues({...values, mission: e.target.value})}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-black leading-relaxed font-arabic">{values.mission}</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-black font-arabic">الرؤية</h3>
              {isEditing ? (
                <Textarea 
                  value={values.vision}
                  onChange={(e) => setValues({...values, vision: e.target.value})}
                  className="min-h-[80px]"
                />
              ) : (
                <p className="text-black leading-relaxed font-arabic">{values.vision}</p>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-2 text-black font-arabic">القيم الجوهرية</h3>
              {isEditing ? (
                <Textarea 
                  value={values.coreValues}
                  onChange={(e) => setValues({...values, coreValues: e.target.value})}
                  className="min-h-[60px]"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {values.coreValues.split('، ').map((value, index) => (
                    <UnifiedBadge key={index} variant="info" size="sm">
                      {value}
                    </UnifiedBadge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </BaseCard>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Cultural Personality */}
          <BaseCard
            variant="operations"
            size="md"
            className="w-full"
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  الشخصية الثقافية
                </h3>
              </div>
            }
          >
            <div className="space-y-4">
              {culturalPersonality.map((trait, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-black font-arabic">{trait.trait}</span>
                    <span className="text-sm font-bold text-black">{trait.score}%</span>
                  </div>
                  <Progress value={trait.score} className="h-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-transparent border border-black/10 rounded-3xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-black" />
                <span className="font-medium text-black font-arabic">التقييم العام</span>
              </div>
              <p className="text-sm text-black font-arabic">
                الشخصية الثقافية لسوبرا تُظهر توازناً ممتازاً بين الأصالة والابتكار، مع تركيز قوي على التميز الأكاديمي والمسؤولية المجتمعية.
              </p>
            </div>
          </BaseCard>

          {/* Cultural Alignment Monitoring */}
          <BaseCard
            variant="operations"
            size="md"
            className="w-full"
            header={
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  مراقبة التوافق الثقافي
                </h3>
              </div>
            }
          >
            <div className="space-y-4">
              {culturalAlignment.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-black/10 rounded-3xl">
                  <div>
                    <span className="font-medium text-sm text-black font-arabic">{area.area}</span>
                    <div className="text-xs text-black/60 mt-1 font-arabic">{area.status}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-black">{area.score}%</span>
                    {area.score >= 90 ? (
                      <CheckCircle className="h-4 w-4 text-black" />
                    ) : area.score >= 80 ? (
                      <AlertCircle className="h-4 w-4 text-black" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-black" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <UnifiedButton variant="outline" size="md" className="w-full mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              تحديث القياسات
            </UnifiedButton>
          </BaseCard>
        </div>
      </div>

      {/* Employee Cultural Engagement */}
      <div className="mb-6">
        <BaseCard
          variant="operations"
          size="md"
          className="w-full"
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-black font-arabic flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
                مشاركة الموظفين الثقافية
              </h3>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-black font-arabic">94%</div>
              <div className="text-sm text-black font-arabic">فهم القيم</div>
              <div className="text-xs text-black font-arabic">+5% عن الربع الماضي</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-black font-arabic">89%</div>
              <div className="text-sm text-black font-arabic">تطبيق القيم</div>
              <div className="text-xs text-black font-arabic">+3% عن الربع الماضي</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold text-black font-arabic">91%</div>
              <div className="text-sm text-black font-arabic">الانتماء الثقافي</div>
              <div className="text-xs text-black font-arabic">+7% عن الربع الماضي</div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-transparent border border-black/10 rounded-3xl">
            <h4 className="font-medium mb-3 text-black font-arabic">آخر استطلاع للموظفين</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-black font-arabic">"أشعر بالفخر للعمل في سوبرا"</span>
                <span className="font-medium text-black">96%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black font-arabic">"أفهم قيم العلامة التجارية وأطبقها"</span>
                <span className="font-medium text-black">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black font-arabic">"أشعر بالانتماء للثقافة المؤسسية"</span>
                <span className="font-medium text-black">89%</span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};