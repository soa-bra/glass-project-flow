
import React, { useState } from 'react';
import { Lightbulb, Volume2, Camera, Fan } from 'lucide-react';

interface DeviceControlsWidgetProps {
  className?: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  isActive: boolean;
  color: string;
}

export const DeviceControlsWidget: React.FC<DeviceControlsWidgetProps> = ({
  className = ''
}) => {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'المكيف',
      type: 'مكيف هواء',
      icon: <Fan size={24} />,
      isActive: true,
      color: 'blue'
    },
    {
      id: '2',
      name: 'مكبر الصوت',
      type: 'نظام صوتي',
      icon: <Volume2 size={24} />,
      isActive: false,
      color: 'green'
    },
    {
      id: '3',
      name: 'الإضاءة الذكية',
      type: 'إضاءة LED',
      icon: <Lightbulb size={24} />,
      isActive: true,
      color: 'yellow'
    },
    {
      id: '4',
      name: 'الكاميرا',
      type: 'كاميرا مراقبة',
      icon: <Camera size={24} />,
      isActive: false,
      color: 'red'
    },
    {
      id: '5',
      name: 'جهاز التحكم',
      type: 'تحكم مركزي',
      icon: <Fan size={24} />,
      isActive: true,
      color: 'purple'
    },
    {
      id: '6',
      name: 'المراوح',
      type: 'تهوية',
      icon: <Fan size={24} />,
      isActive: false,
      color: 'gray'
    }
  ]);

  const toggleDevice = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, isActive: !device.isActive }
        : device
    ));
  };

  const getDeviceStyles = (device: Device) => {
    const baseStyles = "rounded-2xl p-4 backdrop-blur-[20px] border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-between cursor-pointer";
    
    if (device.isActive) {
      switch (device.color) {
        case 'blue': return `${baseStyles} bg-blue-500/80 text-white`;
        case 'green': return `${baseStyles} bg-green-500/80 text-white`;
        case 'yellow': return `${baseStyles} bg-yellow-500/80 text-white`;
        case 'red': return `${baseStyles} bg-red-500/80 text-white`;
        case 'purple': return `${baseStyles} bg-purple-500/80 text-white`;
        default: return `${baseStyles} bg-gray-500/80 text-white`;
      }
    }
    
    return `${baseStyles} bg-white/40 text-gray-700`;
  };

  return (
    <div className={`
      ${className}
      rounded-3xl p-6
      bg-white/40 backdrop-blur-[20px] border border-white/30
      shadow-lg hover:shadow-xl transition-all duration-300
      flex flex-col
      font-arabic
    `}>
      
      {/* رأس البطاقة */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          التحكم بالأجهزة
        </h3>
        <div className="text-sm text-gray-600">
          {devices.filter(d => d.isActive).length} من {devices.length} نشط
        </div>
      </div>

      {/* شبكة الأجهزة */}
      <div className="grid grid-cols-6 gap-4 flex-1">
        {devices.map((device) => (
          <div
            key={device.id}
            onClick={() => toggleDevice(device.id)}
            className={getDeviceStyles(device)}
          >
            <div className="mb-3">
              {device.icon}
            </div>
            
            <div className="text-center">
              <div className="text-sm font-semibold mb-1">
                {device.name}
              </div>
              <div className="text-xs opacity-75">
                {device.type}
              </div>
            </div>

            {/* مؤشر الحالة */}
            <div className={`w-2 h-2 rounded-full mt-2 ${
              device.isActive ? 'bg-white' : 'bg-gray-400'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};
