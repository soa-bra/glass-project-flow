import React from 'react';
import { KPIStatsSection } from '@/components/shared/KPIStatsSection';
import { NumericStatCard } from '@/components/shared/visual-data';
import { AppDashboardGrid, AppGridItem } from '@/components/shared/layout';

export const OverviewTab: React.FC = () => {
  const culturalHarmonyIndex = 87;
  const identityHealthScore = 92;
  const brandAwarenessScore = 78;
  const culturalImpactScore = 85;

  const kpiStats = [
    { title: 'مؤشر الانسجام الثقافي', value: culturalHarmonyIndex, unit: '%', description: 'مستوى التوافق مع القيم الجوهرية' },
    { title: 'صحة الهوية', value: identityHealthScore, unit: '%', description: 'تماسك الهوية البصرية والثقافية' },
    { title: 'الوعي بالعلامة', value: brandAwarenessScore, unit: '%', description: 'مستوى الإدراك والتميز' },
    { title: 'الأثر الثقافي', value: culturalImpactScore, unit: '%', description: 'قوة التأثير في المجتمع' },
  ];

  const healthMetrics = [
    { label: 'التوافق مع القيم الجوهرية', value: 95 },
    { label: 'الاتساق في الرسائل', value: 88 },
    { label: 'تطبيق الهوية البصرية', value: 92 },
    { label: 'التفاعل الثقافي', value: 85 },
  ];

  const activities = [
    { msg: 'تم تحديث دليل الهوية البصرية', time: 'منذ ساعتين', badge: 'جديد', color: '#bdeed3' },
    { msg: 'مراجعة محتوى حملة "التراث الثقافي"', time: 'منذ 4 ساعات', badge: 'قيد المراجعة', color: '#fbe2aa' },
    { msg: 'تم جدولة فعالية "ندوة علم اجتماع العلامة"', time: 'أمس', badge: 'مجدولة', color: '#a4e2f6' },
    { msg: 'نشر بحث "الهوية الثقافية للعلامات السعودية"', time: 'منذ يومين', badge: 'منشور', color: '#d9d2fd' },
  ];

  const performanceStats = [
    { title: 'التفاعل الشهري', value: '15.2K', change: '+12% عن الشهر الماضي' },
    { title: 'رضا العملاء الثقافي', value: '89%', change: '+5% عن الربع الماضي' },
    { title: 'التزام الموظفين بالقيم', value: '94%', change: '+8% عن العام الماضي' },
  ];

  const insights = [
    { msg: 'يُظهر التحليل زيادة في الاهتمام بمواضيع "التراث الرقمي" بنسبة 23%. يُنصح بإنتاج محتوى متخصص في هذا المجال.', confidence: 87, color: '#a4e2f6' },
    { msg: 'مستوى الانسجام الثقافي في المشاريع الأخيرة أعلى بـ 15% من المتوسط السنوي، مما يشير لفعالية الاستراتيجية الحالية.', confidence: 92, color: '#bdeed3' },
  ];

  return (
    <div className="space-y-5">
      <KPIStatsSection stats={kpiStats} />

      <AppDashboardGrid density="spacious">
        {/* Cultural Identity Health */}
        <AppGridItem colSpan={6}>
          <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 h-full">
            <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
              صحة الهوية الثقافية
            </span>
            <div className="space-y-4 mt-5">
              {healthMetrics.map((m, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[rgba(11,15,18,0.60)] font-arabic">{m.label}</span>
                    <span className="text-[12px] font-bold text-[#0B0F12]">{m.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-[rgba(11,15,18,0.04)] rounded-full">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${m.value}%`, backgroundColor: '#bdeed3', transition: 'width 0.6s ease' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AppGridItem>

        {/* Recent Activities */}
        <AppGridItem colSpan={6}>
          <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6 h-full">
            <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
              النشاطات الأخيرة
            </span>
            <div className="space-y-2 mt-4">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-[14px] bg-[rgba(11,15,18,0.02)]">
                  <div className="w-5 h-5 rounded-full bg-[#0B0F12] flex items-center justify-center shrink-0">
                    <span className="text-white text-[8px]">●</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-arabic text-[rgba(11,15,18,0.70)]">{a.msg}</p>
                    <p className="text-[10px] text-[rgba(11,15,18,0.30)]">{a.time}</p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-arabic shrink-0"
                    style={{ backgroundColor: `${a.color}30`, color: 'rgba(11,15,18,0.70)' }}
                  >
                    {a.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AppGridItem>
      </AppDashboardGrid>

      {/* Performance */}
      <AppDashboardGrid density="spacious">
        {performanceStats.map((s, i) => (
          <AppGridItem key={i} colSpan={4}>
            <NumericStatCard
              title={s.title}
              value={s.value}
              description={s.change}
            />
          </AppGridItem>
        ))}
      </AppDashboardGrid>

      {/* AI Insights */}
      <div className="rounded-[24px] bg-white border border-[#DADCE0] p-6">
        <span className="text-xs font-semibold text-[rgba(11,15,18,0.50)] font-arabic uppercase tracking-wide">
          رؤى الذكاء الاصطناعي
        </span>
        <div className="space-y-3 mt-4">
          {insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-[16px]" style={{ backgroundColor: `${ins.color}15` }}>
              <span className="w-1.5 h-full min-h-[20px] rounded-full shrink-0" style={{ backgroundColor: ins.color }} />
              <div className="flex-1">
                <p className="text-[12px] text-[rgba(11,15,18,0.70)] font-arabic leading-relaxed">{ins.msg}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full mt-1.5 inline-block" style={{ backgroundColor: `${ins.color}25`, color: 'rgba(11,15,18,0.60)' }}>
                  ثقة: {ins.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
