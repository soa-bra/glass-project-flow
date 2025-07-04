import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Calendar, 
  Folder, 
  Image, 
  Share,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface CanvasElement {
  id: string;
  type: 'sticky-note' | 'shape' | 'text' | 'connection' | 'mindmap-node';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  locked?: boolean;
  userId?: string;
  layer: number;
}

interface ExportPanelProps {
  elements: CanvasElement[];
  onClose: () => void;
}

const exportOptions = [
  {
    id: 'pdf',
    icon: FileText,
    title: 'PDF',
    description: 'تصدير كملف PDF للطباعة والمشاركة',
    color: 'red',
    available: true
  },
  {
    id: 'gantt',
    icon: Calendar,
    title: 'مخطط جانت',
    description: 'تحويل إلى مخطط جانت لإدارة المشاريع',
    color: 'blue',
    available: true
  },
  {
    id: 'project',
    icon: Folder,
    title: 'مشروع سوبرا',
    description: 'إنشاء مشروع جديد في النظام',
    color: 'green',
    available: true
  },
  {
    id: 'notion',
    icon: FileText,
    title: 'Notion',
    description: 'تصدير إلى Notion كصفحة منظمة',
    color: 'gray',
    available: true
  },
  {
    id: 'image',
    icon: Image,
    title: 'صورة',
    description: 'حفظ كصورة PNG عالية الجودة',
    color: 'purple',
    available: true
  },
  {
    id: 'mindmap',
    icon: Share,
    title: 'خريطة ذهنية',
    description: 'تحويل إلى خريطة ذهنية تفاعلية',
    color: 'orange',
    available: false
  }
];

export const ExportPanel: React.FC<ExportPanelProps> = ({
  elements,
  onClose
}) => {
  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [exportSettings, setExportSettings] = useState({
    includeComments: true,
    includeMetadata: false,
    highQuality: true,
    includeBackground: true
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');

  const handleExport = async (exportId: string) => {
    setSelectedExport(exportId);
    setIsExporting(true);
    setExportStatus('exporting');

    // محاكاة عملية التصدير
    setTimeout(() => {
      setIsExporting(false);
      setExportStatus('success');
      
      // إعادة تعيين الحالة بعد 3 ثوان
      setTimeout(() => {
        setExportStatus('idle');
        setSelectedExport(null);
      }, 3000);
    }, 2000);
  };

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'bg-red-50 text-red-700 border-red-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      gray: 'bg-gray-50 text-gray-700 border-gray-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-modal rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h3 className="text-xl font-bold text-black">تصدير اللوحة</h3>
            <p className="text-sm text-gray-600 mt-1">
              اختر تنسيق التصدير المناسب لاحتياجاتك
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/20 text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Export Options */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedExport === option.id;
              const isExportingThis = isExporting && isSelected;
              
              return (
                <button
                  key={option.id}
                  onClick={() => option.available && handleExport(option.id)}
                  disabled={!option.available || isExporting}
                  className={`relative p-4 border-2 rounded-xl transition-all duration-200 text-right ${
                    option.available
                      ? isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white/30 hover:bg-white/50'
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className={`p-2 rounded-lg ${getColorClasses(option.color)}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 flex items-center space-x-2 space-x-reverse">
                        <span>{option.title}</span>
                        {!option.available && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                            قريباً
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </div>
                  </div>

                  {/* Status indicators */}
                  {isExportingThis && (
                    <div className="absolute inset-0 bg-blue-50/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="flex items-center space-x-2 space-x-reverse text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium">جاري التصدير...</span>
                      </div>
                    </div>
                  )}

                  {exportStatus === 'success' && isSelected && (
                    <div className="absolute inset-0 bg-green-50/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="flex items-center space-x-2 space-x-reverse text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">تم التصدير بنجاح!</span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Export Settings */}
          <div className="bg-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <Settings size={16} className="text-gray-600" />
              <h4 className="font-medium text-gray-800">إعدادات التصدير</h4>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportSettings.includeComments}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    includeComments: e.target.checked
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">تضمين التعليقات</span>
              </label>
              
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportSettings.includeMetadata}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    includeMetadata: e.target.checked
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">تضمين البيانات الوصفية</span>
              </label>
              
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportSettings.highQuality}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    highQuality: e.target.checked
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">جودة عالية</span>
              </label>
              
              <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportSettings.includeBackground}
                  onChange={(e) => setExportSettings(prev => ({
                    ...prev,
                    includeBackground: e.target.checked
                  }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">تضمين الخلفية </span>
              </label>
            </div>
          </div>

          {/* Canvas Info */}
          <div className="mt-4 bg-white/20 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-2">معلومات اللوحة</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-800">{elements.length}</div>
                <div className="text-gray-600">عنصر</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-800">
                  {elements.filter(e => e.type === 'sticky-note').length}
                </div>
                <div className="text-gray-600">ملاحظة</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-gray-800">
                  {elements.filter(e => e.type === 'mindmap-node').length}
                </div>
                <div className="text-gray-600">عقدة</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/20 bg-white/10">
          <div className="text-sm text-gray-600">
            سيتم حفظ الملف في مجلد التحميلات
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};