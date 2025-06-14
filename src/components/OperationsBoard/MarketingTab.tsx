
import React from 'react';

interface Campaign {
  id: number;
  name: string;
  channel: string;
  launchDate: string;
}

interface MarketingTabProps {
  data?: {
    campaigns: Campaign[];
  };
  loading: boolean;
}

export const MarketingTab: React.FC<MarketingTabProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center text-gray-600 font-arabic">
        جاري تحميل الأنشطة التسويقية...
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      <div className="text-right">
        <h2 className="text-2xl font-arabic font-semibold text-gray-800 mb-1">
          التسويق
        </h2>
        <p className="text-gray-600 text-sm">
          متابعة الحملات والأنشطة التسويقية
        </p>
      </div>
      <div className="rounded-2xl bg-white/40 shadow-lg p-6 backdrop-blur-[20px] border border-white/40">
        <table className="w-full text-right font-arabic">
          <thead>
            <tr className="bg-[#eafae1]/60">
              <th className="py-2 px-4 rounded-l-2xl">تاريخ الإطلاق</th>
              <th className="py-2 px-4">القناة</th>
              <th className="py-2 px-4 rounded-r-2xl">اسم الحملة</th>
            </tr>
          </thead>
          <tbody>
            {data.campaigns.map((c) => (
              <tr key={c.id} className="border-b last:border-b-0">
                <td className="py-2 px-4">{c.launchDate}</td>
                <td className="py-2 px-4">{c.channel}</td>
                <td className="py-2 px-4">{c.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
