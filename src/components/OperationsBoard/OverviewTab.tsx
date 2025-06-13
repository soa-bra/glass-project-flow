
import React from 'react';
import { TimelineWidget } from './Overview/TimelineWidget';
import { MainStatsWidget } from './Overview/MainStatsWidget';
import { PowerConsumptionWidget } from './Overview/PowerConsumptionWidget';
import { ThermostatWidget } from './Overview/ThermostatWidget';
import { HumidityWidget } from './Overview/HumidityWidget';
import { TemperatureWidget } from './Overview/TemperatureWidget';
import { DeviceControlsWidget } from './Overview/DeviceControlsWidget';
import { WeatherWidget } from './Overview/WeatherWidget';
import { MediaPlayerWidget } from './Overview/MediaPlayerWidget';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  department: string;
  color: string;
}

interface WidgetsData {
  budget: {
    total: number;
    spent: number;
  };
  contracts: {
    signed: number;
    expired: number;
  };
  hr: {
    members: number;
    vacancies: number;
    onLeave: number;
  };
  satisfaction: number;
}

interface OverviewData {
  timeline: TimelineEvent[];
  widgets: WidgetsData;
}

interface OverviewTabProps {
  data?: OverviewData;
  loading: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  data,
  loading
}) => {
  if (loading || !data) {
    return <div className="h-full flex items-center justify-center text-gray-600 font-arabic">جارٍ التحميل...</div>;
  }

  return (
    <div className="h-full overflow-auto">
      {/* الشبكة الجديدة للوحة مع صفوف متعددة - تصميم مشابه للصورة */}
      <section className="
        grid grid-cols-12 gap-1 
        h-full w-full px-[10px] py-2.5 pb-[25px]
        auto-rows-min
        max-h-full
      ">
        
        {/* الصف الأول - البطاقة الرئيسية والرسم البياني للاستهلاك */}
        <MainStatsWidget 
          data={data.widgets} 
          className="col-span-4 h-[280px]" 
        />

        <PowerConsumptionWidget 
          className="col-span-5 h-[280px]" 
        />

        <ThermostatWidget 
          className="col-span-3 h-[280px]" 
        />

        {/* الصف الثاني - المؤشرات الصغيرة */}
        <HumidityWidget 
          className="col-span-2 h-[120px]" 
        />

        <TemperatureWidget 
          className="col-span-2 h-[120px]" 
        />

        <WeatherWidget 
          className="col-span-2 h-[120px]" 
        />

        <MediaPlayerWidget 
          className="col-span-6 h-[120px]" 
        />

        {/* الصف الثالث - أدوات التحكم بالأجهزة */}
        <DeviceControlsWidget 
          className="col-span-12 h-[180px]" 
        />

      </section>
    </div>
  );
};
